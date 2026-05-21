import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { getGiftTrack, markGiftOpened } from "@/utils/gift-tracking.functions";

export const Route = createFileRoute("/gift/track/$orderId")({
  component: GiftTrackPage,
  head: ({ params }) => ({
    meta: [
      { title: `Gift ${params.orderId} — NeuralGift` },
      { name: "description", content: "Track delivery and redemption of a NeuralGift you sent." },
      { name: "robots", content: "noindex,nofollow" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function GiftTrackPage() {
  const { orderId } = Route.useParams();
  const fetchTrack = useServerFn(getGiftTrack);
  const recordOpen = useServerFn(markGiftOpened);
  const [track, setTrack] = useState<Awaited<ReturnType<typeof getGiftTrack>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fire open event first (idempotent), then fetch fresh timeline
        recordOpen({ data: { orderId } }).catch(() => {});
        const t = await fetchTrack({ data: { orderId } });
        if (cancelled) return;
        if (!t) setNotFound(true);
        else setTrack(t);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, fetchTrack, recordOpen]);

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Waiting…';

  const events = [
    { key: "sent",     label: "Sent",     active: !!track?.sentAt,     ts: fmt(track?.sentAt ?? null) },
    { key: "opened",   label: "Opened",   active: !!track?.openedAt,   ts: fmt(track?.openedAt ?? null) },
    { key: "redeemed", label: "Redeemed", active: !!track?.redeemedAt, ts: fmt(track?.redeemedAt ?? null) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 max-w-2xl mx-auto px-5 sm:px-8 py-16 w-full">
        <div className="text-xs uppercase tracking-widest text-gold mb-3">Gift tracking</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Your gift is on its way.</h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="font-mono tabular text-foreground">#{orderId}</span> · We'll email you when it's opened and redeemed.
        </p>

        {loading && (
          <div className="mt-8 text-sm text-muted-foreground">Loading timeline…</div>
        )}
        {notFound && !loading && (
          <div className="mt-8 text-sm text-conflict-amber">
            We couldn't find that gift. Double-check the order ID, or <Link to="/orders" className="text-indigo hover:underline">look it up</Link>.
          </div>
        )}

        <ol className="mt-10 space-y-5">
          {events.map((e, i) => (
            <li key={e.key} className="flex items-start gap-4">
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${e.active ? "bg-indigo" : "bg-border"}`}
                  style={e.active ? { boxShadow: "0 0 0 4px oklch(0.62 0.21 277 / 0.18)" } : undefined}
                />
                {i < events.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-5 w-px h-12 bg-border" />
                )}
              </div>
              <div className="flex-1">
                <div className={`font-display font-semibold ${e.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {e.label}
                </div>
                <div className="text-xs text-muted-foreground">{e.ts}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 bg-surface border border-border rounded-2xl p-6 text-sm text-muted-foreground">
          We'll email you the moment your recipient opens the card and again when they redeem.
          No notifications until then — promise.
        </div>

        <div className="mt-8 text-center text-xs">
          <Link to="/orders" className="text-indigo hover:underline">Look up another order →</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}