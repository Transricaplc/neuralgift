DROP POLICY IF EXISTS "anyone can insert orders" ON public.orders;
CREATE POLICY "guest can insert orders"
ON public.orders FOR INSERT
WITH CHECK (
  amount > 0
  AND quantity > 0
  AND length(trim(buyer_email)) > 3
  AND buyer_email LIKE '%@%'
  AND (buyer_user_id IS NULL OR buyer_user_id = auth.uid())
);

DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
CREATE POLICY "guest can insert leads"
ON public.leads FOR INSERT
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(company)) > 0
  AND length(trim(team_size)) > 0
);