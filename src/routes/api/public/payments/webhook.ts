import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { type StripeEnv, verifyWebhook } from '@/lib/stripe.server';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: any) {
  const orderId = session.metadata?.order_id;
  const code = session.metadata?.redemption_code;
  if (!orderId) {
    console.error('checkout.session.completed missing order_id metadata');
    return;
  }
  const supabase = getSupabase();
  await supabase
    .from('orders')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', orderId);

  // Fire-and-forget purchase confirmation email
  if (code) {
    try {
      const base = process.env.SUPABASE_URL?.includes('localhost')
        ? 'http://localhost:8080'
        : `https://project--${process.env.VITE_SUPABASE_PROJECT_ID || ''}.lovable.app`;
      await fetch(`${base}/api/public/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'purchase', code }),
      });
    } catch (e) {
      console.error('Failed to send purchase email:', e);
    }
  }
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get('env');
        if (rawEnv !== 'sandbox' && rawEnv !== 'live') {
          return Response.json({ received: true, ignored: 'invalid env' });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case 'checkout.session.completed':
              await handleCheckoutCompleted(event.data.object);
              break;
            default:
              console.log('Unhandled event:', event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error('Webhook error:', e);
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});
