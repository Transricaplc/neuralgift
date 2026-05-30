import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

const FLW_BASE = 'https://api.flutterwave.com/v3';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function verifyFlwTransaction(txId: number, secret: string) {
  const res = await fetch(`${FLW_BASE}/transactions/${txId}/verify`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) {
    console.error('FLW verify failed:', res.status, await res.text());
    return null;
  }
  const data = await res.json() as any;
  return data?.data ?? null;
}

async function handleSuccessfulCharge(tx: any, origin: string) {
  const meta = tx.meta || {};
  const orderId = meta.order_id;
  const code = meta.redemption_code;

  if (!orderId) {
    console.error('Flutterwave webhook missing order_id in meta');
    return;
  }

  const supabase = getSupabase();

  // Idempotent: only update if not already paid
  const { data: existing } = await (supabase as any)
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .maybeSingle();

  if (existing?.status === 'paid') {
    console.log('Order already paid, skipping:', orderId);
    return;
  }

  await (supabase as any).from('orders').update({
    status: 'paid',
    paid_at: new Date().toISOString(),
    flutterwave_tx_id: tx.id,
  } as any).eq('id', orderId);

  // Record delivery "sent" event
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

export const Route = createFileRoute('/api/public/payments/flutterwave')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.FLW_SECRET_KEY;
        const webhookHash = process.env.FLW_WEBHOOK_HASH;

        // If secrets aren't configured, accept silently (dev / pre-live)
        if (!secret || !webhookHash) {
          console.warn('Flutterwave secrets not configured — accepting webhook silently');
          return Response.json({ received: true, live: false });
        }

        // Verify webhook signature
        const signature = request.headers.get('verif-hash');
        if (signature !== webhookHash) {
          console.error('Invalid Flutterwave webhook signature');
          return new Response('Unauthorized', { status: 401 });
        }

        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response('Invalid JSON', { status: 400 });
        }

        const event = payload.event;
        const txData = payload.data;

        if (event === 'charge.completed') {
          // Defensive: verify transaction server-side before fulfilling
          const verified = await verifyFlwTransaction(txData?.id, secret);
          if (!verified || verified.status !== 'successful') {
            console.warn('Transaction not successful or verify failed:', verified?.status);
            return Response.json({ received: true, verified: false });
          }
          await handleSuccessfulCharge(verified, new URL(request.url).origin);
        }

        return Response.json({ received: true });
      },
    },
  },
});
