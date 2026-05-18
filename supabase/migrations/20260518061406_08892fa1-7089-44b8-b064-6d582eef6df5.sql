CREATE POLICY "recipients read gifted orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND recipient_email IS NOT NULL
  AND lower(recipient_email) = lower((auth.jwt() ->> 'email'::text))
);