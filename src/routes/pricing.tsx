import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { Reveal } from "@/components/neural/Reveal";
import { TransparencyStrip } from "@/components/neural/TransparencyStrip";
import { FAQ } from "@/components/neural/FAQ";
import { AI_SERVICES } from "@/lib/services";
import { ServiceIcon } from "@/components/neural/ServiceIcon";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — pay only for the AI you actually use" },
      { name: "description", content: "Stop stacking subscriptions you forget to cancel. One NeuralGift balance, 3.5% flat, no expiry. Calculate your savings vs ChatGPT, Claude, Midjourney and more." },
      { property: "og:title", content: "NeuralGift Pricing — one balance, every AI" },
      { property: "og:description", content: "Interactive calculator: what you'd pay subscribing to every AI vs. loading one card." },
    ],
  }),
});

const FEE_PCT = 0.035;

const COMPARE_ROWS: { label: string; us: string | true; them: string | false }[] = [
  { label: "One balance, every AI tool",     us: true, them: false },
  { label: "Pay in your local currency",     us: true, them: false },
  { label: "Crypto fallback (USDT / USDC)",  us: true, them: false },
  { label: "Balance never expires",          us: true, them: false },
  { label: "No auto-renew traps",            us: true, them: false },
  { label: "Single-use virtual cards",       us: true, them: false },
  { label: "Flat 3.5% fee",                  us: "Always", them: "Hidden FX + decline risk" },
  { label: "Works for unbanked users",       us: true, them: false },
];

function PricingPage() {
  const [picked, setPicked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(AI_SERVICES.map((s) => [s.id, ["chatgpt", "claude", "midjourney"].includes(s.id)])),
  );
  const [months, setMonths] = useState(12);
  const [utilization, setUtilization] = useState(60); // %

  const picks = AI_SERVICES.filter((s) => picked[s.id]);
  const subsMonthly = picks.reduce((sum, s) => sum + s.cost, 0);
  const subsTotal = subsMonthly * months;

  // NeuralGift cost: only pay for what you use × usage %, plus 3.5% fee.
  const ngBase = useMemo(
    () => Math.round(subsMonthly * months * (utilization / 100)),
    [subsMonthly, months, utilization],
  );
  const ngFee = Math.round(ngBase * FEE_PCT);
  const ngTotal = ngBase + ngFee;
  const savings = Math.max(0, subsTotal - ngTotal);
  const savingsPct = subsTotal === 0 ? 0 : Math.round((savings / subsTotal) * 100);

  function toggle(id: string) {
    setPicked((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gold/30 text-gold/90 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Pricing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
            >
              Stop paying for AI you{" "}
              <span className="text-gradient-gold">forget to cancel.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              One balance. Every AI tool. Flat 3.5%. No subscriptions, no expiry, no surprise FX. See your savings below.
            </motion.p>
          </div>
        </section>

        {/* Calculator */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
            {/* Left: pick tools */}
            <Reveal>
              <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  1 · Pick the AI tools you'd subscribe to
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {AI_SERVICES.map((s) => {
                    const on = picked[s.id];
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggle(s.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                          on
                            ? "border-gold/60 bg-gold/5"
                            : "border-border bg-background hover:border-indigo/40"
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${s.color}1a`, border: `1px solid ${s.color}44` }}
                        >
                          <ServiceIcon id={s.id} size={16} color={s.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground tabular">${s.cost}/mo</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            on ? "bg-gold border-gold text-gold-foreground" : "border-border"
                          }`}
                        >
                          {on && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">2 · Months</label>
                      <span className="font-display font-semibold tabular">{months}</span>
                    </div>
                    <input
                      type="range" min={1} max={24} value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full accent-[color:var(--gold)]"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground tabular mt-1">
                      <span>1</span><span>24</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">3 · How much you actually use</label>
                      <span className="font-display font-semibold tabular">{utilization}%</span>
                    </div>
                    <input
                      type="range" min={10} max={100} step={5} value={utilization}
                      onChange={(e) => setUtilization(Number(e.target.value))}
                      className="w-full accent-[color:var(--gold)]"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground tabular mt-1">
                      <span>10%</span><span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: result */}
            <Reveal delay={0.05}>
              <div className="relative h-full bg-surface border border-gold/30 rounded-3xl p-6 sm:p-8 overflow-hidden ng-shimmer">
                <div className="text-xs uppercase tracking-widest text-gold mb-1">Over {months} months</div>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Subscriptions</div>
                    <div className="font-display text-3xl sm:text-4xl font-bold tabular line-through decoration-amber/70 text-foreground/70">
                      ${subsTotal.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 tabular">
                      {picks.length} {picks.length === 1 ? "tool" : "tools"} · ${subsMonthly}/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-gold/80">With NeuralGift</div>
                    <div className="font-display text-3xl sm:text-4xl font-bold tabular text-gradient-gold">
                      ${ngTotal.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 tabular">
                      ${ngBase} usage + ${ngFee} fee (3.5%)
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-gradient-to-br from-gold/15 to-transparent border border-gold/30 p-5">
                  <div className="text-[11px] uppercase tracking-widest text-gold mb-1">You keep</div>
                  <div className="font-display text-5xl sm:text-6xl font-bold tabular text-gradient-gold leading-none">
                    ${savings.toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {savingsPct}% less than subscribing to all of them.
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/buy"
                    className="inline-flex h-11 items-center gap-2 px-6 rounded-full text-sm font-bold text-gold-foreground"
                    style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                  >
                    Load a card <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/studio"
                    className="inline-flex h-11 items-center px-5 rounded-full text-sm font-medium border border-border hover:bg-elevated"
                  >
                    Try the studio
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <TransparencyStrip />

        {/* Compare */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-20">
          <Reveal>
            <div className="text-center mb-10">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Side by side</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">NeuralGift vs. stacking subscriptions.</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_160px_160px] text-xs uppercase tracking-widest bg-elevated border-b border-border">
                <div className="px-5 sm:px-8 py-4 text-muted-foreground">Feature</div>
                <div className="px-3 py-4 text-gold text-center">NeuralGift</div>
                <div className="px-3 py-4 text-muted-foreground text-center">Direct subs</div>
              </div>
              {COMPARE_ROWS.map((r, i) => (
                <div
                  key={r.label}
                  className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_160px_160px] items-center text-sm ${
                    i % 2 ? "bg-surface" : "bg-background/40"
                  }`}
                >
                  <div className="px-5 sm:px-8 py-4">{r.label}</div>
                  <div className="px-3 py-4 text-center">
                    {r.us === true ? (
                      <Check className="inline text-gold" size={18} />
                    ) : (
                      <span className="text-gold text-xs font-semibold">{r.us}</span>
                    )}
                  </div>
                  <div className="px-3 py-4 text-center">
                    {r.them === false ? (
                      <X className="inline text-muted-foreground" size={18} />
                    ) : (
                      <span className="text-muted-foreground text-xs">{r.them}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <FAQ />

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-background p-10 sm:p-14 text-center">
              <div className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
              <h2 className="relative font-display text-3xl sm:text-5xl font-bold">
                One card. Every AI. Your terms.
              </h2>
              <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
                Load any amount from $10 to $500. We do the rest.
              </p>
              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/buy"
                  className="inline-flex h-12 items-center gap-2 px-7 rounded-full text-sm font-semibold text-gold-foreground"
                  style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                >
                  Buy a card <ArrowRight size={16} />
                </Link>
                <Link
                  to="/manifesto"
                  className="inline-flex h-12 items-center px-6 rounded-full text-sm font-medium border border-border hover:bg-elevated"
                >
                  Read the manifesto
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}