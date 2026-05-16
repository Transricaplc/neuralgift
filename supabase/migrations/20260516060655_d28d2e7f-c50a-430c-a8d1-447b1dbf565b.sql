-- =============== REGIONS ===============
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code CHAR(2) UNIQUE NOT NULL,
  country_name TEXT NOT NULL,
  currency_code CHAR(3) NOT NULL,
  currency_symbol TEXT NOT NULL,
  exchange_rate_usd NUMERIC(14,6) NOT NULL DEFAULT 1,
  available_payment_methods JSONB NOT NULL DEFAULT '[]'::jsonb,
  primary_psp TEXT,
  micro_bundle_usd NUMERIC(6,2),
  access_note TEXT,
  coverage_status TEXT NOT NULL DEFAULT 'coming_soon',
  emoji TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regions publicly readable when active"
  ON public.regions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage regions"
  ON public.regions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== ORDERS extensions ===============
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS local_amount NUMERIC(16,2),
  ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(14,6) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS payment_method_key TEXT NOT NULL DEFAULT 'card',
  ADD COLUMN IF NOT EXISTS psp TEXT NOT NULL DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS gift_mode BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS occasion TEXT,
  ADD COLUMN IF NOT EXISTS recipient_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS country_code CHAR(2),
  ADD COLUMN IF NOT EXISTS is_crypto_payment BOOLEAN NOT NULL DEFAULT false;

-- delivery_method already exists on orders per current schema; skip re-add.

-- =============== PAYMENT INTENTS ===============
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method_key TEXT NOT NULL,
  psp TEXT NOT NULL,
  crypto_network TEXT,
  crypto_token TEXT,
  crypto_address TEXT,
  crypto_tx_hash TEXT,
  local_currency CHAR(3),
  local_amount NUMERIC(16,2),
  usd_amount NUMERIC(10,2),
  exchange_rate NUMERIC(14,6),
  platform_commission_pct NUMERIC(5,2),
  phone_number TEXT,
  voucher_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_reference TEXT,
  buyer_ip_country CHAR(2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payment_intents_order ON public.payment_intents(order_id);
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers read own payment intents"
  ON public.payment_intents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payment_intents.order_id
        AND auth.uid() IS NOT NULL
        AND (
          o.buyer_user_id = auth.uid()
          OR lower(o.buyer_email) = lower((auth.jwt() ->> 'email'))
        )
    )
  );
CREATE POLICY "Admins manage payment intents"
  ON public.payment_intents FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== GIFT DELIVERIES ===============
CREATE TABLE IF NOT EXISTS public.gift_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  delivery_method TEXT NOT NULL,
  recipient_contact TEXT,
  occasion TEXT,
  personal_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gift_deliveries_order ON public.gift_deliveries(order_id);
ALTER TABLE public.gift_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers read own gift deliveries"
  ON public.gift_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = gift_deliveries.order_id
        AND auth.uid() IS NOT NULL
        AND (
          o.buyer_user_id = auth.uid()
          OR lower(o.buyer_email) = lower((auth.jwt() ->> 'email'))
        )
    )
  );
CREATE POLICY "Admins manage gift deliveries"
  ON public.gift_deliveries FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== TOKEN BUNDLES ===============
CREATE TABLE IF NOT EXISTS public.token_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  bundle_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  token_quantity BIGINT,
  token_unit TEXT,
  usd_price NUMERIC(8,2) NOT NULL,
  fulfillment_type TEXT NOT NULL DEFAULT 'virtual_card',
  is_giftable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 99,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.token_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Token bundles publicly readable when active"
  ON public.token_bundles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage token bundles"
  ON public.token_bundles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== PLATFORM REQUESTS ===============
CREATE TABLE IF NOT EXISTS public.platform_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL,
  requested_value TEXT NOT NULL,
  requester_email TEXT,
  requester_country TEXT,
  vote_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a request"
  ON public.platform_requests FOR INSERT
  WITH CHECK (
    length(trim(request_type)) > 0
    AND length(requested_value) BETWEEN 1 AND 120
    AND (requester_email IS NULL OR requester_email ~ '^[^@]+@[^@]+\.[^@]+$')
    AND (requester_country IS NULL OR length(requester_country) BETWEEN 2 AND 2)
  );
CREATE POLICY "Admins read requests"
  ON public.platform_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage requests"
  ON public.platform_requests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));