import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Send, Search, ArrowRight } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { REGIONS, CRISIS_REGIONS, type Region } from "@/data/regions";
import { useRegion } from "@/contexts/RegionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/global-access")({
  head: () => ({
    meta: [
      { title: "Global Access — NeuralGift covers 80+ countries" },
      { name: "description", content: "A student in Dar es Salaam shouldn't need a Visa card to use Claude. See every country, currency, and payment method NeuralGift supports — and request your own." },
      { property: "og:title", content: "Global Access — AI for every human, in every currency" },
      { property: "og:description", content: "80+ countries. Every local payment method. Crypto where banks won't. Request the country we're missing." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/global-access" }],
  }),
  component: GlobalAccessPage,
});

type Group = { label: string; codes: string[] };
const CONTINENTS: Group[] = [
  { label: "Africa",          codes: ["TZ","KE","UG","RW","ET","SO","NG","GH","SN","CI","CM","ML","ZA","ZW","ZM","MZ","EG","MA","TN","DZ"] },
  { label: "Middle East",     codes: ["PS","LB","IQ","JO","TR","SA","AE"] },
  { label: "South Asia",      codes: ["IN","BD","PK","LK","NP","MM"] },
  { label: "Southeast Asia",  codes: ["ID","PH","VN","TH","MY","KH","SG"] },
  { label: "East Asia",       codes: ["CN","KR","JP","TW"] },
  { label: "Latin America",   codes: ["BR","MX","CO","AR","PE","CL","EC","BO","PY","UY","CU","HT","GT","VE"] },
  { label: "Eastern Europe & Central Asia", codes: ["UA","KZ","UZ","GE","PL","RO","RS"] },
  { label: "Western Europe",  codes: ["DE","FR","NL","BE","PT","ES","IT","SE","CH","GB"] },
  { label: "North America & Oceania", codes: ["US","CA","AU","NZ","PG","FJ"] },
];

function statusOf(r: Region) {
  if (CRISIS_REGIONS.has(r.code)) return { key: "crypto", label: "Crypto rails", color: "var(--crypto-teal)" };
  if (r.psp === "stripe") return { key: "live", label: "Live", color: "var(--success-green)" };
  if (r.psp === "crypto") return { key: "crypto", label: "Crypto rails", color: "var(--crypto-teal)" };
  return { key: "soon", label: "Launching soon", color: "var(--conflict-amber)" };
}

function GlobalAccessPage() {
  const { setRegion } = useRegion();
  const [query, setQuery] = useState("");

  const liveCount = REGIONS.filter((r) => r.code !== "XX").length;
  const cryptoCount = REGIONS.filter((r) => r.psp === "crypto" && r.code !== "XX").length;
  const currencies = new Set(REGIONS.filter((r) => r.code !== "XX").map((r) => r.currency)).size;

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONTINENTS.map((g) => ({
      ...g,
      regions: g.codes
        .map((c) => REGIONS.find((r) => r.code === c))
        .filter(Boolean)
        .filter((r) => {
          if (!q) return true;
          const reg = r!;
          return (
            reg.name.toLowerCase().includes(q) ||
            reg.currency.toLowerCase().includes(q) ||
            reg.methods.some((m) => m.toLowerCase().includes(q))
          );
        }) as Region[],
    })).filter((g) => g.regions.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-[color-mix(in_oklab,var(--world-blue)_40%,transparent)] text-[color-mix(in_oklab,var(--world-blue)_85%,white)] mb-6"
          >
            <Globe2 size={12} /> Global Access Manifesto
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            AI Access for <span className="text-gradient-gold">Every Human.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A student in Dar es Salaam shouldn't need a Visa card to use Claude. A developer in Gaza shouldn't be locked out of Lovable because her bank collapsed. We are the financial bridge between every builder on earth and the AI tools they deserve.
          </motion.p>

          <div className="mt-10 grid grid-cols-3 max-w-2xl mx-auto gap-6">
            {[
              { v: `${liveCount}+`, l: "Countries" },
              { v: `${currencies}`,  l: "Local currencies" },
              { v: `${cryptoCount}`, l: "Via crypto rails" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-semibold text-gradient-gold tabular leading-none">{s.v}</div>
                <div className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGEND + SEARCH */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Legend color="var(--success-green)" label="Live" />
            <Legend color="var(--crypto-teal)" label="Crypto rails — works where banks don't" />
            <Legend color="var(--conflict-amber)" label="Launching soon" />
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search country, currency, or method…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-surface border-border"
            />
          </div>
        </div>
      </section>

      {/* COVERAGE GROUPS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 w-full space-y-12">
        {filteredGroups.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            No matches. <a href="#request" className="text-indigo hover:underline">Request your country →</a>
          </div>
        )}
        {filteredGroups.map((g) => (
          <div key={g.label}>
            <h2 className="font-display text-xl sm:text-2xl font-semibold mb-4 flex items-baseline gap-3">
              {g.label}
              <span className="text-xs uppercase tracking-widest text-muted-foreground tabular">
                {g.regions.length} {g.regions.length === 1 ? "country" : "countries"}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {g.regions.map((r) => {
                const s = statusOf(r);
                return (
                  <button
                    key={r.code}
                    onClick={() => {
                      setRegion(r.code);
                      toast.success(`${r.emoji} ${r.name} set as your region.`, {
                        description: `Prices will now be shown in ${r.currency}.`,
                      });
                    }}
                    title={`Make ${r.name} your active region — local prices and payment methods will appear across the site.`}
                    className="group bg-surface border border-border rounded-xl p-4 text-left hover:border-indigo/40 transition-colors flex flex-col gap-2"
                    style={{ borderTopColor: s.color, borderTopWidth: 2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl leading-none">{r.emoji}</span>
                        <span className="font-medium truncate">{r.name}</span>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-widest tabular shrink-0"
                        style={{ color: s.color }}
                      >
                        {r.currency}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2 min-h-[2.5em]">
                      {r.methods.slice(0, 3).join(" · ")}
                    </div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest pt-1">
                      <span style={{ color: s.color }}>● {s.label}</span>
                      <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                        Use this region <ArrowRight size={10} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* REQUEST FORM */}
      <RequestSection />

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
          Ready to gift the future?
        </h2>
        <p className="mt-4 text-muted-foreground">Pick a denomination. They pick the tool. In any currency, anywhere on earth.</p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link to="/buy" className="inline-flex items-center h-12 px-6 rounded-full font-semibold text-gold-foreground" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}>
            Buy a card
          </Link>
          <Link to="/" className="inline-flex items-center h-12 px-6 rounded-full font-semibold border border-border hover:bg-elevated">
            Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function RequestSection() {
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!country.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("platform_requests").insert([{
        request_type: "country",
        requested_value: country.trim().slice(0, 120),
        requester_email: email.trim() || null,
      }]);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Got it — we'll email you when it's live.");
      setCountry("");
      setEmail("");
    } catch {
      toast.error("Couldn't submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="request" className="border-y border-border bg-surface/30">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--world-blue)_85%,white)] mb-2">
          Missing your country?
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
          Tell us. We'll build the bridge.
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every request maps to a real human we'd be locking out. We prioritise launches based on demand — yours included.
        </p>

        <form onSubmit={submit} className="mt-8 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Country</label>
            <Input
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Madagascar"
              className="mt-1 bg-background border-border"
              maxLength={120}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email (optional)</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 bg-background border-border"
            />
          </div>
          <Button
            type="submit"
            disabled={!country.trim() || submitting}
            className="h-10 bg-indigo text-indigo-foreground hover:opacity-90"
          >
            <Send size={14} className="mr-1.5" />
            {submitting ? "Sending…" : submitted ? "Sent ✓" : "Request"}
          </Button>
        </form>
        <p className="mt-3 text-[11px] text-muted-foreground">
          In the meantime, USDT and USDC work in your country today — pick "Other / Not listed" at checkout.
        </p>
      </div>
    </section>
  );
}