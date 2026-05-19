import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import { AI_SERVICES, type AIService } from "@/lib/services";
import { ServiceIcon } from "@/components/neural/ServiceIcon";
import { Reveal } from "@/components/neural/Reveal";

type Allocations = Record<string, number>;

function fmt(n: number) {
  return `$${n.toFixed(0)}`;
}

/**
 * AllocationStudio — Phase 12.
 * The interactive "split your balance across AI tools" experience
 * promised on /how-it-works. Visual / state only — no backend wiring yet.
 * Pass `balance` to drive the available amount; defaults to $100.
 */
export function AllocationStudio({
  balance = 100,
  services = AI_SERVICES,
}: {
  balance?: number;
  services?: AIService[];
}) {
  const [alloc, setAlloc] = useState<Allocations>(() =>
    Object.fromEntries(services.map((s) => [s.id, 0])),
  );
  const [issued, setIssued] = useState(false);

  const total = useMemo(
    () => Object.values(alloc).reduce((a, b) => a + b, 0),
    [alloc],
  );
  const remaining = Math.max(0, balance - total);
  const overspent = total > balance;

  function bump(id: string, amount: number, max: number) {
    setAlloc((prev) => {
      const next = { ...prev };
      const others = total - (prev[id] ?? 0);
      const cap = Math.min(max, balance - others);
      next[id] = Math.max(0, Math.min(cap, Math.round(amount)));
      return next;
    });
  }

  function quickFill(id: string, cost: number) {
    bump(id, (alloc[id] ?? 0) === 0 ? cost : 0, cost * 4);
  }

  function reset() {
    setAlloc(Object.fromEntries(services.map((s) => [s.id, 0])));
    setIssued(false);
  }

  const activeCount = Object.values(alloc).filter((v) => v > 0).length;

  return (
    <div className="relative">
      {/* Header strip */}
      <Reveal>
        <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 mb-5 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold/90 mb-1">Available balance</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-bold tabular text-gradient-gold leading-none">
                {fmt(remaining)}
              </span>
              <span className="text-sm text-muted-foreground tabular">of {fmt(balance)}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-elevated overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: overspent
                    ? "linear-gradient(90deg, var(--amber), #ef4444)"
                    : "var(--gradient-gold)",
                }}
                animate={{ width: `${Math.min(100, (total / balance) * 100)}%` }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              />
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              {activeCount} {activeCount === 1 ? "tool" : "tools"} allocated · {fmt(total)} assigned
              {overspent && <span className="text-amber"> · over balance</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-1.5 px-4 rounded-full text-xs font-semibold border border-border hover:bg-elevated"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={() => setIssued(true)}
              disabled={total === 0 || overspent}
              className="inline-flex h-10 items-center gap-2 px-5 rounded-full text-xs font-bold text-gold-foreground disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
            >
              <Sparkles size={14} /> Issue virtual cards <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Service grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => {
          const value = alloc[s.id] ?? 0;
          const active = value > 0;
          const max = Math.max(s.cost * 4, balance);
          return (
            <Reveal key={s.id} delay={0.04 * i}>
              <div
                className={`relative h-full rounded-2xl border p-5 transition-colors ${
                  active
                    ? "border-gold/60 bg-gradient-to-br from-surface to-elevated"
                    : "border-border bg-surface hover:border-indigo/40"
                }`}
              >
                {active && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-gold-foreground flex items-center justify-center text-[10px] font-bold ng-pulse-ring">
                    ✓
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}1a`, border: `1px solid ${s.color}55` }}
                  >
                    <ServiceIcon id={s.id} size={20} color={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-display font-semibold truncate">{s.name}</div>
                      <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-border text-muted-foreground">
                        {s.category}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.blurb}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <button
                    onClick={() => quickFill(s.id, s.cost)}
                    className="text-[10px] uppercase tracking-widest text-indigo hover:text-foreground"
                  >
                    {active ? "Clear" : `+${fmt(s.cost)} / mo`}
                  </button>
                  <div className="font-display text-2xl font-bold tabular text-gradient-gold leading-none">
                    {fmt(value)}
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={max}
                  step={1}
                  value={value}
                  onChange={(e) => bump(s.id, Number(e.target.value), max)}
                  className="mt-3 w-full accent-[color:var(--gold)]"
                  aria-label={`Allocate to ${s.name}`}
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular">
                  <span>$0</span>
                  <span>${max}</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Trust strip */}
      <Reveal delay={0.1}>
        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
          {[
            { icon: Lock, label: "Single-use virtual card per tool" },
            { icon: ShieldCheck, label: "Cancel any time · balance never expires" },
            { icon: Sparkles, label: "Add more tools later — re-split anytime" },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="flex items-center gap-2 bg-surface/60 border border-border rounded-xl px-3 py-2.5 text-muted-foreground"
              >
                <Icon size={14} className="text-gold shrink-0" />
                <span>{t.label}</span>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Issued sheet */}
      <AnimatePresence>
        {issued && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-5"
            onClick={() => setIssued(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="ng-shimmer relative w-full max-w-lg bg-surface border border-gold/40 rounded-3xl p-8"
              style={{ boxShadow: "var(--shadow-glow-gold)" }}
            >
              <div className="text-xs uppercase tracking-widest text-gold mb-2">Cards issued</div>
              <h3 className="font-display text-2xl font-bold">
                {activeCount} virtual {activeCount === 1 ? "card is" : "cards are"} ready.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Each card works only on its assigned service. Copy the details into the tool's billing page — done.
              </p>
              <ul className="mt-5 space-y-2 max-h-60 overflow-auto pr-1">
                {services
                  .filter((s) => (alloc[s.id] ?? 0) > 0)
                  .map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between bg-background border border-border rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <ServiceIcon id={s.id} size={16} color={s.color} />
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      <span className="font-mono text-xs text-gold tabular">
                        4242 •••• {Math.floor(1000 + Math.random() * 9000)} · {fmt(alloc[s.id] ?? 0)}
                      </span>
                    </li>
                  ))}
              </ul>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIssued(false)}
                  className="inline-flex h-10 items-center px-5 rounded-full text-xs font-semibold border border-border hover:bg-elevated"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}