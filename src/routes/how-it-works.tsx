import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag, Gift, Sparkles, CreditCard, ShieldCheck, Globe2, ArrowRight } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { TransparencyStrip } from "@/components/neural/TransparencyStrip";
import { FAQ } from "@/components/neural/FAQ";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
  head: () => ({
    meta: [
      { title: "How NeuralGift works — buy, send, redeem across any AI tool" },
      { name: "description", content: "Three steps: pay in your currency, send a code, redeem across ChatGPT, Claude, Midjourney and 40+ AI tools. No subscriptions. No expiry." },
      { property: "og:title", content: "How NeuralGift works" },
      { property: "og:description", content: "Buy. Send. Redeem. The simplest way to gift AI access anywhere on earth." },
    ],
  }),
});

const STEPS = [
  {
    n: "01",
    icon: ShoppingBag,
    title: "Buy in your currency",
    body: "Pick a denomination from $10 to $500. Pay with card, M-Pesa, MTN MoMo, PIX, UPI, or stablecoins (USDT / USDC). We charge a flat 3.5% — never more.",
    detail: "80+ local rails, 0 hidden FX markup.",
  },
  {
    n: "02",
    icon: Gift,
    title: "Send the unwrap link",
    body: "We deliver a personal claim page to your recipient by email — or copy the link and send it your way. They tap to unwrap, see your note, and bind the code to their account.",
    detail: "Magic-link signup. No password needed.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Redeem across any AI",
    body: "From the dashboard, split the balance how you like. We provision a single-use virtual card per service — ChatGPT, Claude, Midjourney, Cursor, Perplexity, ElevenLabs, and 40+ more.",
    detail: "Balance never expires. No subscriptions.",
  },
];

const PROMISES = [
  { icon: ShieldCheck, title: "Single-use cards", body: "Every AI tool gets its own virtual card. If one leaks, the rest stay safe." },
  { icon: Globe2, title: "Works in every country", body: "Local rails where we have them; crypto fallback where banks won't go." },
  { icon: CreditCard, title: "No subscription traps", body: "You spend exactly what you load. No auto-renew. No trial gotchas." },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gold/30 text-gold/90 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> How it works
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
            >
              Buy. Send. <span className="text-gradient-gold">Redeem.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              The simplest way to gift AI access — to a friend, your team, or yourself. One card, every model, every currency.
            </motion.p>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="grid gap-6 lg:gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-surface border border-border rounded-3xl p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start hover:border-gold/40 transition-colors"
                >
                  <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-6 sm:w-32">
                    <div className="font-display text-5xl sm:text-7xl font-bold text-gradient-gold tabular leading-none">{s.n}</div>
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                      <Icon size={22} />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold">{s.title}</h2>
                    <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">{s.body}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/90">
                      <span className="w-6 h-px bg-gold/60" /> {s.detail}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <TransparencyStrip />

        {/* Promises */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Built for the world, not the lobby</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">What you can count on.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PROMISES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="bg-surface border border-border rounded-2xl p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo/15 border border-indigo/30 flex items-center justify-center text-indigo mb-4">
                    <Icon size={20} />
                  </div>
                  <div className="font-display text-lg font-semibold">{p.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <FAQ />

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-background p-10 sm:p-14 text-center">
            <div className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
            <h2 className="relative font-display text-3xl sm:text-5xl font-bold">Ready to gift the future?</h2>
            <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
              Pick a denomination, write a note, and we'll handle the rest — anywhere on earth.
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
                to="/redeem"
                className="inline-flex h-12 items-center px-6 rounded-full text-sm font-medium border border-border hover:bg-elevated transition-colors"
              >
                I have a code
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}