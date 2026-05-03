import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { type StripeEnv, createStripeClient } from '@/lib/stripe.server';

const MANAGED_PAYMENTS_COUNTRIES = new Set([
  'US','CA','BR','CL','CO','AR','PE','UY',
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'GB','NO','CH','IS','LI',
  'AU','NZ','KR','MY','TH','ID','PH','VN','IN','HK','TW',
  'AE','SA','ZA','IL','TR','EG','NG','KE',
  'GI','BH','GE','KZ','BD','PK','LK','MM','KH','LA','RS','BA','ME','MK','AL','MD','AM',
]);

function shouldUseManaged(country?: string): boolean {
  if (!country) return false;
  return MANAGED_PAYMENTS_COUNTRIES.has(country.toUpperCase());
}

export const createGiftCardCheckout = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    amountInCents: number;
    quantity: number;
    deliveryFeeInCents: number;
    buyerEmail: string;
    recipientEmail?: string;
    recipientName?: string;
    message?: string;
    deliveryType: 'digital' | 'physical';
    customerCountry?: string;
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    if (!Number.isInteger(data.amountInCents) || data.amountInCents < 500 || data.amountInCents > 1_000_000) {
      throw new Error('Amount must be between $5 and $10,000');
    }
    if (!Number.isInteger(data.quantity) || data.quantity < 1 || data.quantity > 500) {
      throw new Error('Quantity must be between 1 and 500');
    }
    if (!data.buyerEmail.includes('@')) throw new Error('Invalid buyer email');
    if (data.deliveryType !== 'digital' && data.deliveryType !== 'physical') throw new Error('Invalid delivery type');
    return data;
  })
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Create pending order first so we have the redemption code
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        buyer_email: data.buyerEmail,
        recipient_email: data.recipientEmail || null,
        amount: Math.round(data.amountInCents / 100),
        delivery_type: data.deliveryType,
        quantity: data.quantity,
        message: data.message || null,
        status: 'pending',
        currency: 'usd',
      })
      .select('id, redemption_code')
      .single();

    if (error || !order) throw new Error(error?.message || 'Could not create order');

    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `NeuralGift Card — $${data.amountInCents / 100}` },
          unit_amount: data.amountInCents,
        },
        quantity: data.quantity,
      },
    ];

    if (data.deliveryFeeInCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Physical card shipping' },
          unit_amount: data.deliveryFeeInCents,
        },
        quantity: 1,
      });
    }

    const useManaged = shouldUseManaged(data.customerCountry);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      ui_mode: 'embedded_page',
      return_url: data.returnUrl,
      customer_email: data.buyerEmail,
      metadata: {
        order_id: order.id,
        redemption_code: order.redemption_code,
        managed_payments: useManaged ? 'true' : 'false',
        customer_country: data.customerCountry || '',
      },
      ...(useManaged
        ? { managed_payments: { enabled: true } }
        : { automatic_tax: { enabled: true } }),
    });

    // Save session id on order so webhook can match
    await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

    return { clientSecret: session.client_secret, orderId: order.id };
  });
