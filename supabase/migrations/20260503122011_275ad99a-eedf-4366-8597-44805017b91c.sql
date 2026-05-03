-- Lightweight funnel analytics
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  path TEXT,
  session_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon visitors) may insert an event
CREATE POLICY "Anyone can record analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(event) BETWEEN 1 AND 64
  AND (path IS NULL OR length(path) <= 256)
  AND (session_id IS NULL OR length(session_id) <= 64)
);

-- Only admins can read analytics
CREATE POLICY "Admins can read analytics"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_analytics_events_event_created ON public.analytics_events (event, created_at DESC);
CREATE INDEX idx_analytics_events_session ON public.analytics_events (session_id);