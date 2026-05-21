import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function generateCode(seed: string): string {
  // Stable-ish 8-char code from email + random suffix on first creation.
  const base = seed.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4) || 'GIFT';
  const rand = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4);
  return `${base}${rand}`.slice(0, 8);
}

export const getMyReferral = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, claims } = context;
    const email = (claims?.email as string | undefined)?.toLowerCase() ?? null;
    const db = admin();

    // Find existing code owned by this user (by user_id OR email)
    let { data: existing } = await db
      .from('referral_codes')
      .select('id, code, discount_cents, credit_cents, uses_count, max_uses, is_active, expires_at, created_at')
      .or(`owner_user_id.eq.${userId}${email ? `,owner_email.eq.${email}` : ''}`)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    // Lazily create one
    if (!existing) {
      let code = generateCode(email ?? userId);
      // Best-effort uniqueness: retry on conflict a few times
      for (let i = 0; i < 5; i++) {
        const { data: inserted, error } = await db
          .from('referral_codes')
          .insert({
            code,
            owner_user_id: userId,
            owner_email: email,
            discount_cents: 500,
            credit_cents: 500,
            max_uses: 100,
            is_active: true,
          })
          .select('id, code, discount_cents, credit_cents, uses_count, max_uses, is_active, expires_at, created_at')
          .single();
        if (!error && inserted) { existing = inserted; break; }
        code = generateCode(email ?? userId);
      }
    }

    if (!existing) {
      return { code: null, stats: null, recent: [] as Array<{ created_at: string; discount_cents: number }> };
    }

    const { data: redemptions } = await db
      .from('referral_redemptions')
      .select('created_at, discount_cents, credit_cents')
      .eq('referral_code_id', existing.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const totalCreditCents = (redemptions ?? []).reduce(
      (sum, r: any) => sum + (Number(r.credit_cents) || 0),
      0,
    );

    return {
      code: existing.code as string,
      stats: {
        usesCount: Number(existing.uses_count) || 0,
        maxUses: Number(existing.max_uses) || 0,
        discountCents: Number(existing.discount_cents) || 0,
        creditPerUseCents: Number(existing.credit_cents) || 0,
        totalCreditCents,
        isActive: !!existing.is_active,
      },
      recent: (redemptions ?? []).map((r: any) => ({
        created_at: r.created_at as string,
        discount_cents: Number(r.discount_cents) || 0,
      })),
    };
  });