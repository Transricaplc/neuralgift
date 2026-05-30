import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';

const FLW_BASE = 'https://api.flutterwave.com/v3';

function getFlwSecret(): string | undefined {
  return process.env.FLW_SECRET_KEY;
}

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export const createFlutterwaveCheckout = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    amountInCents: number;
    quantity: number;
    buyerEmail: string;
    regionCode: string;
    currency: string;
    rate: number;
    paymentMethod: string;
    phone?: string;
    returnUrl: string;
  }) => {
    if (!Number.isInteger(data.amountInCents) || data.amountInCents < 500 || data.amountInCents > 1_000_000) {
      throw new Error('Amount must be between $5 and $10,000');
    }
    if (!Number.isInteger(data.quantity) || data.quantity < 1 || data.quantity > 500) {
      throw new Error('Quantity must be between 1 and 500');
    }
    if (!data.buyerEmail.includes('@')) throw new Error('Invalid buyer email');
    if (!data.regionCode) throw new Error('Region code required');
    if (!data.currency) throw new Error('Currency required');
    return data;
  })
  .handler(async ({ data }) => {
    const secret = getFlwSecret();
    if (!secret) {
      throw new Error('FLW_SECRET_KEY not configured');
    }

    const supabase = getSupabase();
    const usdTotal = data.amountInCents / 100;
    const localAmount = Math.round(usdTotal * data.rate);

    // Create pending order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        buyer_email: data.buyerEmail,
        amount: data.amountInCents,
        quantity: data.quantity,
        status: 'pending',
        currency: data.currency.toLowerCase(),
        currency_code: data.currency,
        exchange_rate: data.rate,
        local_amount: localAmount,
        country_code: data.regionCode,
        payment_method_key: data.paymentMethod,
        psp: 'flutterwave',
        is_crypto_payment: false,
      })
      .select('id, redemption_code')
      .single();

    if (error || !order) throw new Error(error?.message || 'Could not create order');

    const txRef = `NG-${order.id}-${Date.now()}`;

    const payload = {
      tx_ref: txRef,
      amount: usdTotal,
      currency: 'USD',
      redirect_url: data.returnUrl,
      customer: {
        email: data.buyerEmail,
        phonenumber: data.phone || '',
      },
      customizations: {
        title: 'NeuralGift Card',
        description: `AI access gift card — ${data.quantity}x $${usdTotal.toFixed(2)}`,
        logo: 'https://neuralgift.app/logo.png',
      },
      meta: {
        order_id: order.id,
        redemption_code: order.redemption_code,
        region_code: data.regionCode,
      },
    };

    const res = await fetch(`${FLW_BASE}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Flutterwave payment init failed:', res.status, txt);
      throw new Error(`Flutterwave error: ${res.status}`);
    }

    const flwData = await res.json() as any;
    if (!flwData?.data?.link) {
      console.error('Flutterwave response missing link:', flwData);
      throw new Error('Flutterwave did not return a checkout link');
    }

    // Save tx_ref on order for webhook matching
    await supabase.from('orders').update({
      flutterwave_tx_ref: txRef,
    } as any).eq('id', order.id);

    return {
      checkoutUrl: flwData.data.link as string,
      orderId: order.id,
      txRef,
    };
  });
