import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "ng_sid";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export async function track(event: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("analytics_events").insert({
      event: event.slice(0, 64),
      path: window.location.pathname.slice(0, 256),
      session_id: getSessionId().slice(0, 64),
      metadata,
      user_agent: navigator.userAgent.slice(0, 512),
      referrer: document.referrer ? document.referrer.slice(0, 512) : null,
    });
  } catch {
    // swallow — analytics must never break UX
  }
}

export function trackPageview(path?: string) {
  void track("pageview", { path: path ?? (typeof window !== "undefined" ? window.location.pathname : "") });
}