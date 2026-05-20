import { useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { createGiftCardCheckout } from '@/utils/payments.functions';

interface Props {
  amountInCents: number;
  quantity: number;
  deliveryFeeInCents: number;
  buyerEmail: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  deliveryType: 'digital' | 'physical';
  returnUrl: string;
  referralCode?: string;
}

export function StripeGiftCardCheckout(props: Props) {
  const fetchClientSecret = useCallback(async () => {
    let country: string | undefined;
    try {
      const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const txt = await res.text();
      const m = txt.match(/loc=([A-Z]{2})/);
      country = m?.[1];
    } catch {}
    const result = await createGiftCardCheckout({
      data: { ...props, customerCountry: country, environment: getStripeEnvironment() },
    });
    return result.clientSecret as string;
  }, [props]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
