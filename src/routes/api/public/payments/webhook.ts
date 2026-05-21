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

async function handleCheckoutCompleted(session: any, origin: string) {
  const orderId = session.metadata?.order_id;
  const code = session.metadata?.redemption_code;
  if (!orderId) {
    console.error('checkout.session.completed missing order_id metadata');
    return;
  }
  const supabase = getSupabase();
  await (supabase as any).from('orders')
    .update({ status: 'paid', paid_at: new Date().toISOString() } as any)
    .eq('id', orderId);

  // Record delivery "sent" event (idempotent per order)
  try {
    await (supabase as any).rpc('mark_gift_sent', { _order_id: orderId });
  } catch (e) {
    console.error('Failed to mark gift sent:', e);
  }

  // Fire-and-forget purchase confirmation email
  if (code) {
    try {
      await fetch(`${origin}/api/public/send-email`, {
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
              await handleCheckoutCompleted(event.data.object, new URL(request.url).origin);
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
