-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_email TEXT NOT NULL,
  recipient_email TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  delivery_type TEXT NOT NULL DEFAULT 'digital' CHECK (delivery_type IN ('digital','physical')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','fulfilled','redeemed')),
  redemption_code UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  buyer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order (guest checkout)
CREATE POLICY "anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
-- Public read by redemption_code is required for the redemption portal; we expose via RPC below
-- Buyers (logged in) can read their own orders
CREATE POLICY "buyers read own orders" ON public.orders FOR SELECT USING (auth.uid() IS NOT NULL AND buyer_user_id = auth.uid());
CREATE POLICY "buyers update own orders" ON public.orders FOR UPDATE USING (auth.uid() IS NOT NULL AND buyer_user_id = auth.uid());

-- Redemptions table
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  services_selected JSONB NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
-- No direct access; redemptions go through RPC

-- Leads table (B2B demo requests)
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  team_size TEXT NOT NULL,
  use_case TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Business accounts
CREATE TABLE public.business_accounts (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  billing_email TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'starter' CHECK (plan_tier IN ('starter','growth','enterprise')),
  webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user reads own business account" ON public.business_accounts FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user inserts own business account" ON public.business_accounts FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "user updates own business account" ON public.business_accounts FOR UPDATE USING (auth.uid() = id);

-- Auto-create a business_account on signup
CREATE OR REPLACE FUNCTION public.handle_new_business_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.business_accounts (id, billing_email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_biz
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_business_user();

-- RPC: lookup an order by redemption code (public)
CREATE OR REPLACE FUNCTION public.lookup_order_by_code(_code UUID)
RETURNS TABLE (id UUID, amount INTEGER, status TEXT, recipient_email TEXT, message TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, amount, status, recipient_email, message, created_at
  FROM public.orders WHERE redemption_code = _code LIMIT 1;
$$;

-- RPC: redeem an order (public, idempotent)
CREATE OR REPLACE FUNCTION public.redeem_order(_code UUID, _services JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_redemption_id UUID;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE redemption_code = _code LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;
  IF v_order.status = 'redeemed' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_redeemed');
  END IF;
  INSERT INTO public.redemptions (order_id, services_selected)
  VALUES (v_order.id, _services)
  RETURNING id INTO v_redemption_id;
  UPDATE public.orders SET status = 'redeemed' WHERE id = v_order.id;
  RETURN jsonb_build_object('ok', true, 'redemption_id', v_redemption_id, 'order_id', v_order.id);
END; $$;

GRANT EXECUTE ON FUNCTION public.lookup_order_by_code(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_order(UUID, JSONB) TO anon, authenticated;