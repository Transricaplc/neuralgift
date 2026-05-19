import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { Reveal } from "@/components/neural/Reveal";

export const Route = createFileRoute("/manifesto")({
  component: ManifestoPage,
  head: () => ({
    meta: [
      { title: "Manifesto — A student in Dar es Salaam shouldn't need a Visa to use Claude." },
      { name: "description", content: "Why NeuralGift exists: the global payment system left billions of builders behind. We're the gift card that works in every country, on every AI tool." },
      { property: "og:title", content: "NeuralGift Manifesto" },
      { property: "og:description", content: "The AI revolution shouldn't have a passport check at the door." },
    ],
  }),
});

const PILLARS = [
  {
    n: "I",
    title: "Access is the new literacy.",
    body: "Reading the printed word reshaped the 16th century. Talking to a model that reasons is reshaping ours. If you can't get in the door, you can't write the next chapter.",
  },
  {
    n: "II",
    title: "The door has a bouncer most don't see.",
    body: "1.4 billion people don't have a bank account. Hundreds of millions more have one — that doesn't accept dollars, won't process foreign 3D-Secure, or simply blocks the AI page. Stripe declines the card. The wait is silent.",
  },
  {
    n: "III",
    title: "We refuse to make builders beg.",
    body: "No 'ask a friend abroad'. No fake addresses. No crypto-only ghetto. One card, your currency, your rails — M-Pesa, MTN MoMo, PIX, UPI, Yape, USDT — and the entire AI shelf opens.",
  },
  {
    n: "IV",
    title: "We charge once. We never expire.",
    body: "3.5% flat. No FX games. No subscription that auto-renews after the trial. No balance that vanishes in 12 months because we'd like to keep your money.",
  },
  {
    n: "V",
    title: "Gifts compound.",
    body: "A $20 card to a teenager in Lima is a Cursor seat for a month. A $50 card to a researcher in Gaza is six weeks of Claude. The compound interest of those hours is what we're really shipping.",
  },
];

const VOICES = [
  {
    quote: "I'd been refused by four foreign processors before NeuralGift. I redeemed in 90 seconds with M-Pesa.",
    name: "Asha M.",
    role: "CS student",
    where: "Dar es Salaam 🇹🇿",
  },
  {
    quote: "We sent cards to twelve interns across three continents. Nobody filed an expense report. Nobody asked HR.",
    name: "Daniel O.",
    role: "Eng manager · fintech",
    where: "Lagos 🇳🇬",
  },
  {
    quote: "After our payment rails collapsed, this was the only way our team kept using AI tools. Quietly. Reliably.",
    name: "Layla K.",
    role: "Self-taught dev",
    where: "Gaza 🇵🇸",
  },
];

function ManifestoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero — editorial */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="text-[11px] uppercase tracking-[0.3em] text-gold/90 mb-6"
            >
              Manifesto · v1 · May 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.7 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight"
            >
              The AI revolution shouldn't have a{" "}
              <span className="text-gradient-gold">passport check</span> at the door.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}
              className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              We built NeuralGift for the student in Dar es Salaam, the researcher in Gaza, the 16-year-old in Lima — every builder the global payment system quietly excluded from the most important tools of their lifetime.
            </motion.p>
          </div>
        </section>

        {/* The number */}
        <Reveal>
          <section className="border-y border-border bg-surface/30">
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-[auto_1fr] gap-8 items-center">
              <div className="font-display text-6xl sm:text-8xl font-bold text-gradient-gold tabular leading-none">
                1.4B
              </div>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl">
                People without a bank account. Add the hundreds of millions whose cards exist but get silently declined on every foreign AI checkout. That's the audience the model providers say they want — and shut the door on.
              </p>
            </div>
          </section>
        </Reveal>

        {/* Pillars — long form */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="space-y-16">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.04}>
                <article className="grid sm:grid-cols-[80px_1fr] gap-6 sm:gap-10">
                  <div className="font-display text-4xl sm:text-5xl font-bold text-gold/40 tabular leading-none">
                    {p.n}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                      {p.title}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <Reveal>
          <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
            <div className="relative bg-surface border border-gold/30 rounded-3xl p-10 sm:p-16">
              <Quote className="absolute top-6 left-6 text-gold/30" size={36} />
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                If the next great open-source library, the next protein-fold paper, the next viral indie app comes from a kid in Karachi or Kampala —{" "}
                <span className="text-gradient-gold">it will not be because the payment rails got out of the way.</span>{" "}
                It will be because we did.
              </p>
            </div>
          </section>
        </Reveal>

        {/* Voices */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              In their words
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {VOICES.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.06}>
                <figure className="h-full bg-surface border border-border rounded-2xl p-6 flex flex-col">
                  <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
                    "{v.quote}"
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-border">
                    <div className="text-sm font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.role} · {v.where}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Signature CTA */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-background p-10 sm:p-14">
              <div className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold/90 mb-3">Signed</div>
                <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug max-w-2xl">
                  The NeuralGift team — builders, redeemers, and former excluded-by-Stripe users.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/buy"
                    className="inline-flex h-12 items-center gap-2 px-7 rounded-full text-sm font-semibold text-gold-foreground"
                    style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                  >
                    Gift one card <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/global-access"
                    className="inline-flex h-12 items-center px-6 rounded-full text-sm font-medium border border-border hover:bg-elevated"
                  >
                    See where we work
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}