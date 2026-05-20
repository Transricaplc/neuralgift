import { REGIONS } from "@/data/regions";

const COUNTRY_COUNT = REGIONS.filter((r) => r.code !== "XX").length;

const STATS = [
  { value: "3.5%", label: "Flat commission", note: "Same fee whether you pay in USD or USDT." },
  { value: "0", label: "Subscriptions", note: "No auto-renew. No trial traps." },
  { value: "∞", label: "No expiry", note: "Balance never disappears on you." },
  { value: `${COUNTRY_COUNT}+`, label: "Countries", note: "And every country via crypto fallback." },
];

export function TransparencyStrip() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col">
            <div className="font-display text-3xl sm:text-4xl font-semibold text-gradient-gold tabular leading-none">
              {s.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-foreground/80">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground leading-snug">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}