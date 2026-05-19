import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { AllocationStudio } from "@/components/neural/AllocationStudio";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({
    meta: [
      { title: "Allocation Studio — split one balance across every AI tool" },
      { name: "description", content: "Preview the NeuralGift dashboard: split your balance across ChatGPT, Claude, Midjourney, Cursor and more, then issue single-use virtual cards." },
      { property: "og:title", content: "Allocation Studio · NeuralGift" },
      { property: "og:description", content: "One balance, every AI tool. Drag the sliders and see your virtual cards issued instantly." },
    ],
  }),
});

const PRESETS = [50, 100, 250, 500];

function StudioPage() {
  const [balance, setBalance] = useState(100);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gold/30 text-gold/90 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold ng-pulse-ring" /> Live preview
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl"
            >
              One balance. <span className="text-gradient-gold">Every AI tool.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl"
            >
              Try the redemption experience your recipient sees. Drag the sliders, watch the balance follow you, then issue single-use virtual cards.
            </motion.p>

            {/* Balance preset bar */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">Try with</span>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setBalance(p)}
                  className={`h-9 px-4 rounded-full text-sm font-semibold border transition-colors tabular ${
                    balance === p
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-border text-muted-foreground hover:border-indigo/40 hover:text-foreground"
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
          <AllocationStudio key={balance} balance={balance} />
        </section>

        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-indigo/30 bg-gradient-to-br from-surface to-background p-8 sm:p-12 text-center">
            <div className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
            <h2 className="relative font-display text-2xl sm:text-4xl font-bold">
              Like what you see? Send it to someone.
            </h2>
            <p className="relative mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
              The studio above is exactly what your recipient unlocks after they tap your unwrap link.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/buy"
                className="inline-flex h-11 items-center gap-2 px-6 rounded-full text-sm font-semibold text-gold-foreground"
                style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
              >
                Buy a card <ArrowRight size={14} />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex h-11 items-center px-5 rounded-full text-sm font-medium border border-border hover:bg-elevated"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}