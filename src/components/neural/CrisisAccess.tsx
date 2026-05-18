import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { REGIONS, CRISIS_REGIONS } from "@/data/regions";

/**
 * Surfaces the human story: the regions where banking has collapsed,
 * sanctions bite, or currency volatility makes "just use Stripe" a fantasy.
 * Each card shows the access note verbatim — no spin, no marketing gloss.
 */
export function CrisisAccess() {
  const crisis = REGIONS.filter((r) => CRISIS_REGIONS.has(r.code) && r.accessNote);

  return (
    <section className="relative border-y border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)] mb-3">
              <Heart size={12} /> Where banking has broken down
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
              We don't ask you to wait for your country to be "supported".
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              In every region below, traditional payment rails are restricted, sanctioned, or simply gone. Crypto and direct USD are accepted with <span className="text-foreground font-semibold">zero markup</span>. We see you.
            </p>
          </div>
          <Link
            to="/global-access"
            className="text-sm text-indigo hover:text-foreground transition-colors"
          >
            See full coverage →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {crisis.map((r, i) => (
            <motion.div
              key={r.code}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative bg-background border border-border rounded-2xl p-5 hover:border-[color-mix(in_oklab,var(--crypto-teal)_45%,transparent)] transition-colors"
            >
              <div className="absolute top-0 left-5 right-5 h-px" style={{ background: "var(--crypto-teal)", opacity: 0.5 }} />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl leading-none">{r.emoji}</span>
                <div>
                  <div className="font-display font-semibold text-sm">{r.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.currency} · via {r.psp}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.accessNote}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.methods.slice(0, 3).map((m) => (
                  <span key={m} className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-elevated text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}