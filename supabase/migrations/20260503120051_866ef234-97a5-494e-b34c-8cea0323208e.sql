
-- Allow buyers to view orders made with their email (even if buyer_user_id is null)
DROP POLICY IF EXISTS "buyers read own orders" ON public.orders;
CREATE POLICY "buyers read own orders" ON public.orders
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      buyer_user_id = auth.uid()
      OR lower(buyer_email) = lower((auth.jwt() ->> 'email'))
    )
  );

-- Trigger: when a new auth user is created, attach any historical orders made with their email
CREATE OR REPLACE FUNCTION public.link_orders_to_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.orders
  SET buyer_user_id = NEW.id
  WHERE buyer_user_id IS NULL
    AND lower(buyer_email) = lower(NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_link_orders ON auth.users;
CREATE TRIGGER on_auth_user_created_link_orders
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.link_orders_to_new_user();
