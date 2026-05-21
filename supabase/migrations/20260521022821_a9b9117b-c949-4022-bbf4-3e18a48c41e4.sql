-- 1. Add redeemed_at column
ALTER TABLE public.gift_deliveries
  ADD COLUMN IF NOT EXISTS redeemed_at timestamp with time zone;

-- 2. Ensure one delivery row per order (idempotent backfill safe)
CREATE UNIQUE INDEX IF NOT EXISTS gift_deliveries_order_id_unique
  ON public.gift_deliveries(order_id)
  WHERE order_id IS NOT NULL;

-- 3. Mark order as sent (called by Stripe webhook on checkout.session.completed)
CREATE OR REPLACE FUNCTION public.mark_gift_sent(_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_method text;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = _order_id LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'order_not_found');
  END IF;

  v_method := CASE
    WHEN v_order.recipient_whatsapp IS NOT NULL THEN 'whatsapp'
    WHEN v_order.recipient_email IS NOT NULL THEN 'email'
    ELSE 'link'
  END;

  INSERT INTO public.gift_deliveries (order_id, delivery_method, recipient_contact, occasion, personal_message, status, sent_at)
  VALUES (
    _order_id,
    v_method,
    COALESCE(v_order.recipient_whatsapp, v_order.recipient_email),
    v_order.occasion,
    v_order.message,
    'sent',
    now()
  )
  ON CONFLICT (order_id) DO UPDATE
    SET status = CASE WHEN public.gift_deliveries.sent_at IS NULL THEN 'sent' ELSE public.gift_deliveries.status END,
        sent_at = COALESCE(public.gift_deliveries.sent_at, EXCLUDED.sent_at);

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- 4. Mark gift as opened (first view of tracking / email open)
CREATE OR REPLACE FUNCTION public.mark_gift_opened(_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.gift_deliveries (order_id, delivery_method, status, opened_at)
  VALUES (_order_id, 'link', 'opened', now())
  ON CONFLICT (order_id) DO UPDATE
    SET opened_at = COALESCE(public.gift_deliveries.opened_at, now()),
        status = CASE
          WHEN public.gift_deliveries.status IN ('redeemed') THEN public.gift_deliveries.status
          ELSE 'opened'
        END;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- 5. Public-safe read of delivery timeline (no PII)
CREATE OR REPLACE FUNCTION public.get_gift_track(_order_id uuid)
RETURNS TABLE(
  order_id uuid,
  order_status text,
  sent_at timestamp with time zone,
  opened_at timestamp with time zone,
  redeemed_at timestamp with time zone,
  delivery_method text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.status, gd.sent_at, gd.opened_at, gd.redeemed_at, gd.delivery_method
  FROM public.orders o
  LEFT JOIN public.gift_deliveries gd ON gd.order_id = o.id
  WHERE o.id = _order_id
  LIMIT 1;
$$;

-- 6. Patch redeem_order to also stamp gift_deliveries
CREATE OR REPLACE FUNCTION public.redeem_order(_code uuid, _services jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  INSERT INTO public.gift_deliveries (order_id, delivery_method, status, redeemed_at)
  VALUES (v_order.id, 'link', 'redeemed', now())
  ON CONFLICT (order_id) DO UPDATE
    SET redeemed_at = COALESCE(public.gift_deliveries.redeemed_at, now()),
        status = 'redeemed';

  RETURN jsonb_build_object('ok', true, 'redemption_id', v_redemption_id, 'order_id', v_order.id);
END;
$$;