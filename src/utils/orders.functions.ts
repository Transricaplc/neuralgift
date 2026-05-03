import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';

export const getOrderBySession = createServerFn({ method: 'GET' })
  .inputValidator((data: { sessionId: string }) => {
    if (!/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error('Invalid session id');
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: order } = await supabase
      .from('orders')
      .select('redemption_code, status')
      .eq('stripe_session_id', data.sessionId)
      .maybeSingle();
    return { redemptionCode: order?.redemption_code as string | undefined, status: order?.status as string | undefined };
  });
