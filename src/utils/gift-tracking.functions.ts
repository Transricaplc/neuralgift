import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export const getGiftTrack = createServerFn({ method: 'GET' })
  .inputValidator((data: { orderId: string }) => {
    if (!UUID_RE.test(data.orderId)) throw new Error('Invalid order id');
    return data;
  })
  .handler(async ({ data }) => {
    const { data: rows, error } = await admin().rpc('get_gift_track', { _order_id: data.orderId });
    if (error) throw new Error(error.message);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return {
      orderId: row.order_id as string,
      orderStatus: (row.order_status as string) ?? 'pending',
      sentAt: (row.sent_at as string | null) ?? null,
      openedAt: (row.opened_at as string | null) ?? null,
      redeemedAt: (row.redeemed_at as string | null) ?? null,
      deliveryMethod: (row.delivery_method as string | null) ?? null,
    };
  });

export const markGiftOpened = createServerFn({ method: 'POST' })
  .inputValidator((data: { orderId: string }) => {
    if (!UUID_RE.test(data.orderId)) throw new Error('Invalid order id');
    return data;
  })
  .handler(async ({ data }) => {
    const { error } = await admin().rpc('mark_gift_opened', { _order_id: data.orderId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });