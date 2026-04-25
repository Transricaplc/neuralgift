import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { AI_SERVICES, type AIService } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const search = z.object({ code: z.string().optional() });

export const Route = createFileRoute("/redeem")({
  validateSearch: zodValidator(search),
  component: RedeemPage,
  head: () => ({
    meta: [
      { title: "Redeem your card — NeuralGift" },
      { name: "description", content: "Enter your code and pick the AI tools you want." },
    ],
  }),
});

type Order = { id: string; amount: number; status: string };

function RedeemPage() {
  const initial = Route.useSearch().code ?? "";
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [code, setCode] = useState(initial);
  const [order, setOrder] = useState<Order | null>(null);
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (initial) checkBalance(initial); /* eslint-disable-next-line */ }, []);

  async function checkBalance(c: string) {
    setError(null); setLoading(true);
    const cleaned = c.trim();
    const { data, error: rpcErr } = await supabase.rpc("lookup_order_by_code", { _code: cleaned });
    setLoading(false);
    if (rpcErr || !data || data.length === 0) {
      setError("We couldn't find that code. Double-check the format.");
      return;
    }
    const o = data[0] as Order;
    if (o.status === "redeemed") {
      setError("This card has already been redeemed.");
      return;
    }
    setOrder(o); setStep(2);
  }

  function toggle(id: string) {
    const next = new Set(picks);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicks(next);
  }

  const allocated = Array.from(picks).reduce((sum, id) => sum + (AI_SERVICES.find((s) => s.id === id)?.cost ?? 0), 0);
  const balance = order?.amount ?? 0;
  const remaining = balance - allocated;

  async function confirm() {
    if (!order) return;
    setLoading(true); setError(null);
    const services = Array.from(picks).map((id) => AI_SERVICES.find((s) => s.id === id)!);
    const { data, error: rpcErr } = await supabase.rpc("redeem_order", { _code: code.trim(), _services: services as unknown as never });
    setLoading(false);
    if (rpcErr || !(data as { ok?: boolean })?.ok) {
      setError((data as { error?: string })?.error ?? rpcErr?.message ?? "Could not redeem. Try again.");
      return;
    }
    setStep(4);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16 w-full">
        {/* Progress */}
        <div className="mb-10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
          {["Code", "Choose", "Confirm", "Done"].map((label, i) => {
            const n = i + 1;
            const active = step >= n;
            return (
              <div key={label} className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold transition-colors ${active ? "bg-indigo text-indigo-foreground" : "border border-border text-muted-foreground"}`}>{n}</div>
                <span className={`ml-2 ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i < 3 && <div className={`w-6 sm:w-12 h-px mx-3 ${step > n ? "bg-indigo" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-xl mx-auto text-center">
              <h1 className="font-display text-4xl sm:text-5xl font-bold">Enter your code.</h1>
              <p className="mt-3 text-muted-foreground">Paste the redemption code from your card or email.</p>
              <div className="mt-8 bg-surface border border-border rounded-2xl p-6">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  className="w-full h-14 rounded-xl bg-background border border-border px-4 font-mono tabular text-center text-base tracking-wider focus:outline-none focus:border-indigo/60"
                  onKeyDown={(e) => e.key === "Enter" && checkBalance(code)}
                />
                {error && <div className="mt-4 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{error}</div>}
                <button
                  onClick={() => checkBalance(code)}
                  disabled={!code || loading}
                  className="mt-5 w-full h-12 rounded-full font-semibold text-gold-foreground disabled:opacity-60"
                  style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                >
                  {loading ? "Checking…" : "Check balance"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && order && (
            <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="bg-surface border border-border rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Card balance</div>
                  <div className="text-3xl font-display font-bold tabular text-gradient-gold">${balance}</div>
                </div>
                <div className="flex-1 max-w-md min-w-[220px]">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Allocated</span>
                    <span className={`tabular ${remaining < 0 ? "text-amber" : ""}`}>${allocated} / ${balance}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background overflow-hidden">
                    <motion.div
                      className={`h-full ${remaining < 0 ? "bg-amber" : "bg-indigo"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (allocated / balance) * 100)}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>

              <h2 className="font-display text-2xl font-semibold mb-4">Pick your AI tools.</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AI_SERVICES.map((s) => (
                  <ServiceTile key={s.id} s={s} active={picks.has(s.id)} onToggle={() => toggle(s.id)} disabled={!picks.has(s.id) && remaining < s.cost} />
                ))}
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button onClick={() => setStep(1)} className="h-11 px-5 rounded-full border border-border">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={picks.size === 0 || remaining < 0}
                  className="h-11 px-6 rounded-full font-semibold bg-indigo text-indigo-foreground disabled:opacity-50"
                >
                  Review →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && order && (
            <motion.div key="s3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold mb-6">Confirm your selection.</h2>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="space-y-3">
                  {Array.from(picks).map((id) => {
                    const s = AI_SERVICES.find((x) => x.id === id)!;
                    return (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold" style={{ background: `${s.color}22`, color: s.color }}>{s.name.charAt(0)}</div>
                          <div>
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.category}</div>
                          </div>
                        </div>
                        <div className="tabular">${s.cost}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex justify-between text-sm text-muted-foreground"><span>Allocated</span><span className="tabular">${allocated}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Remaining (saved on card)</span><span className="tabular">${remaining}</span></div>
                {error && <div className="mt-4 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{error}</div>}
                <button
                  onClick={confirm}
                  disabled={loading}
                  className="mt-5 w-full h-12 rounded-full font-semibold text-gold-foreground disabled:opacity-60"
                  style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                >
                  {loading ? "Provisioning…" : "Provision My AI Tools"}
                </button>
                <button onClick={() => setStep(2)} className="mt-3 w-full h-10 text-sm text-muted-foreground hover:text-foreground">← Edit selection</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-3xl">✓</div>
              <h2 className="mt-6 font-display text-3xl font-bold">You're set.</h2>
              <p className="mt-3 text-muted-foreground">We're issuing single-use virtual cards for each tool you picked. Expect an email within 24 hours.</p>
              <div className="mt-8 bg-surface border border-border rounded-2xl p-6 text-left">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Fulfillment status</div>
                {Array.from(picks).map((id) => {
                  const s = AI_SERVICES.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="py-2 border-b border-border last:border-0">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">A single-use virtual card has been issued, pre-loaded for use at {s.name} only.</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function ServiceTile({ s, active, onToggle, disabled }: { s: AIService; active: boolean; onToggle: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`text-left rounded-2xl border p-5 transition-all ${
        active ? "border-indigo/60 bg-indigo/10 -translate-y-0.5" : "border-border bg-surface hover:border-indigo/40 disabled:opacity-40 disabled:hover:border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold" style={{ background: `${s.color}22`, color: s.color }}>{s.name.charAt(0)}</div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.category}</span>
      </div>
      <div className="font-display font-semibold">{s.name}</div>
      <div className="text-xs text-muted-foreground mb-3">{s.blurb}</div>
      <div className="flex items-center justify-between">
        <span className="text-sm tabular text-gold">${s.cost}/mo</span>
        <span className={`text-xs font-semibold ${active ? "text-indigo" : "text-muted-foreground"}`}>{active ? "Added" : "Add"}</span>
      </div>
    </button>
  );
}
