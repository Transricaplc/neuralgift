-- 1. orders.referral_code column
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS referral_code text;
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON public.orders(referral_code);

-- 2. referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  owner_email text,
  owner_user_id uuid,
  discount_cents integer NOT NULL DEFAULT 500,
  credit_cents integer NOT NULL DEFAULT 500,
  max_uses integer NOT NULL DEFAULT 100,
  uses_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referral_code_format CHECK (code ~ '^[A-Z0-9_-]{4,32}$')
);
CREATE INDEX IF NOT EXISTS idx_referral_codes_owner_user_id ON public.referral_codes(owner_user_id);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage referral codes" ON public.referral_codes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners read own referral codes" ON public.referral_codes
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND owner_user_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND lower(owner_email) = lower(auth.jwt() ->> 'email'))
  );

-- 3. referral_redemptions table
CREATE TABLE IF NOT EXISTS public.referral_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id uuid NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  code text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  buyer_email text,
  discount_cents integer NOT NULL DEFAULT 0,
  credit_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_code_id ON public.referral_redemptions(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_order_id ON public.referral_redemptions(order_id);

ALTER TABLE public.referral_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage referral redemptions" ON public.referral_redemptions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Buyers read own referral redemptions" ON public.referral_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = referral_redemptions.order_id
        AND auth.uid() IS NOT NULL
        AND (o.buyer_user_id = auth.uid() OR lower(o.buyer_email) = lower(auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Owners read redemptions of own codes" ON public.referral_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.referral_codes rc
      WHERE rc.id = referral_redemptions.referral_code_id
        AND auth.uid() IS NOT NULL
        AND (rc.owner_user_id = auth.uid() OR lower(rc.owner_email) = lower(auth.jwt() ->> 'email'))
    )
  );

-- 4. Public validation function (security definer; safe limited fields)
CREATE OR REPLACE FUNCTION public.validate_referral_code(_code text)
RETURNS TABLE(ok boolean, reason text, discount_cents integer, credit_cents integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE rc public.referral_codes%ROWTYPE;
BEGIN
  IF _code IS NULL OR length(trim(_code)) = 0 THEN
    RETURN QUERY SELECT false, 'empty', 0, 0; RETURN;
  END IF;
  SELECT * INTO rc FROM public.referral_codes WHERE upper(code) = upper(trim(_code)) LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'not_found', 0, 0; RETURN;
  END IF;
  IF NOT rc.is_active THEN
    RETURN QUERY SELECT false, 'inactive', 0, 0; RETURN;
  END IF;
  IF rc.expires_at IS NOT NULL AND rc.expires_at < now() THEN
    RETURN QUERY SELECT false, 'expired', 0, 0; RETURN;
  END IF;
  IF rc.uses_count >= rc.max_uses THEN
    RETURN QUERY SELECT false, 'max_uses_reached', 0, 0; RETURN;
  END IF;
  RETURN QUERY SELECT true, 'ok'::text, rc.discount_cents, rc.credit_cents;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_referral_code(text) TO anon, authenticated;

-- 5. Apply referral to a paid order (server-side; idempotent per order)
CREATE OR REPLACE FUNCTION public.apply_referral_to_order(_order_id uuid, _code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rc public.referral_codes%ROWTYPE;
  v_order public.orders%ROWTYPE;
  v_existing uuid;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = _order_id LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'order_not_found');
  END IF;

  SELECT * INTO rc FROM public.referral_codes
   WHERE upper(code) = upper(trim(_code))
   FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;
  IF NOT rc.is_active OR (rc.expires_at IS NOT NULL AND rc.expires_at < now()) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'inactive_or_expired');
  END IF;
  IF rc.uses_count >= rc.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'error', 'max_uses_reached');
  END IF;

  SELECT id INTO v_existing FROM public.referral_redemptions
    WHERE order_id = _order_id LIMIT 1;
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_applied');
  END IF;

  INSERT INTO public.referral_redemptions (referral_code_id, code, order_id, buyer_email, discount_cents, credit_cents)
  VALUES (rc.id, rc.code, _order_id, v_order.buyer_email, rc.discount_cents, rc.credit_cents);

  UPDATE public.referral_codes
    SET uses_count = uses_count + 1, updated_at = now()
    WHERE id = rc.id;

  UPDATE public.orders SET referral_code = rc.code WHERE id = _order_id;

  RETURN jsonb_build_object('ok', true, 'discount_cents', rc.discount_cents, 'credit_cents', rc.credit_cents);
END;
$$;

-- updated_at trigger for referral_codes
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_referral_codes_updated ON public.referral_codes;
CREATE TRIGGER trg_referral_codes_updated
  BEFORE UPDATE ON public.referral_codes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
