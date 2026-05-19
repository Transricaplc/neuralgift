import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Mail, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useRegion } from "@/contexts/RegionContext";
import { formatLocalAmount } from "@/data/regions";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

const search = z.object({ code: z.string().optional() });

export const Route = createFileRoute("/claim")({
  validateSearch: zodValidator(search),
  component: ClaimPage,
  head: () => ({
    meta: [
      { title: "You've received a gift — NeuralGift" },
      { name: "description", content: "Unwrap your AI gift card. Pick the tools you want. No account required." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "You've received a NeuralGift card" },
      { property: "og:description", content: "Unwrap your AI gift card. Pick the tools you want." },
    ],
  }),
});

type Order = {
  id: string;
  amount: number;
  status: string;
  recipient_email: string | null;
  message: string | null;
  created_at: string;
};

function ClaimPage() {
  const navigate = useNavigate();
  const code = (Route.useSearch().code ?? "").trim();
  const { region } = useRegion();

  const [stage, setStage] = useState<"loading" | "sealed" | "unsealed" | "missing" | "redeemed">("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionEmail(session?.user.email ?? null);
      if (!code) {
        setStage("missing");
        return;
      }
      const { data, error } = await supabase.rpc("lookup_order_by_code", { _code: code });
      if (error || !data || data.length === 0) {
        setStage("missing");
        void track("claim_lookup_failed");
        return;
      }
      const o = data[0] as Order;
      setOrder(o);
      if (o.recipient_email) setEmail(o.recipient_email);
      if (o.status === "redeemed") {
        setStage("redeemed");
        void track("claim_already_redeemed");
        return;
      }
      setStage("sealed");
      void track("claim_view", { amount: o.amount });
    })();
  }, [code]);

  function unwrap() {
    setStage("unsealed");
    void track("claim_unwrapped");
  }

  async function sendMagicLink() {
    if (!email.includes("@")) {
      toast.error("Enter the email this gift was sent to.");
      return;
    }
    setSending(true);
    const redirectUrl = `${window.location.origin}/redeem?code=${encodeURIComponent(code)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectUrl, shouldCreateUser: true },
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      void track("claim_magic_link_failed");
      return;
    }
    setSent(true);
    void track("claim_magic_link_sent");
  }

  function continueAsGuest() {
    void track("claim_continue_guest");
    navigate({ to: "/redeem", search: { code } });
  }

  const amount = order?.amount ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-16">
        {stage === "loading" && (
          <div className="h-[40vh] flex items-center justify-center text-muted-foreground text-sm">Looking up your gift…</div>
        )}

        {stage === "missing" && (
          <div className="text-center max-w-md mx-auto py-16">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber/15 border border-amber/40 flex items-center justify-center text-amber text-2xl">?</div>
            <h1 className="mt-5 font-display text-3xl font-bold">We couldn't find that gift.</h1>
            <p className="mt-3 text-muted-foreground text-sm">The link may be incomplete. Try the full URL from your email, or paste the code on the redeem page.</p>
            <Link to="/redeem" className="mt-6 inline-flex h-11 px-5 items-center rounded-full bg-indigo text-indigo-foreground font-semibold">Enter a code →</Link>
          </div>
        )}

        {stage === "redeemed" && (
          <div className="text-center max-w-md mx-auto py-16">
            <div className="mx-auto w-14 h-14 rounded-full bg-success-green/15 border border-success-green/40 flex items-center justify-center text-success-green">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold">This gift's already unwrapped.</h1>
            <p className="mt-3 text-muted-foreground text-sm">If it was you, the AI tools you picked are on their way to your inbox.</p>
            <Link to="/account" className="mt-6 inline-flex h-11 px-5 items-center rounded-full border border-border">Go to my account</Link>
          </div>
        )}

        {stage === "sealed" && order && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="text-xs uppercase tracking-widest text-gold mb-3">You've received a gift</div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">Something's waiting for you.</h1>
            <p className="mt-3 text-muted-foreground">An AI gift card — no app to install, no subscription, no expiry.</p>

            <motion.button
              type="button"
              onClick={unwrap}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 relative mx-auto block w-full max-w-sm aspect-[1.6/1] rounded-3xl overflow-hidden border border-gold/40"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
              aria-label="Unwrap your gift"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gold-foreground">
                <Gift size={48} strokeWidth={1.5} />
                <div className="mt-3 font-display text-xl font-bold">Tap to unwrap</div>
                <div className="text-xs opacity-80 mt-1">A NeuralGift card</div>
              </div>
              {/* Ribbon */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-gold-foreground/15 backdrop-blur-sm" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gold-foreground/15 backdrop-blur-sm" />
            </motion.button>

            <p className="mt-6 text-[11px] text-muted-foreground">No account needed. You'll choose your AI tools in the next step.</p>
          </motion.div>
        )}

        {stage === "unsealed" && order && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold"
              >
                <Sparkles size={14} /> Unwrapped
              </motion.div>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
                You got <span className="text-gradient-gold tabular">${amount}</span> in AI tools.
              </h1>
              {region.code !== "XX" && region.currency !== "USD" && (
                <p className="mt-2 text-sm text-muted-foreground tabular">
                  ≈ {formatLocalAmount(amount, region)} {region.emoji}
                </p>
              )}
            </div>

            {order.message && (
              <motion.figure
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-surface border border-border rounded-2xl p-6 mb-6 relative"
              >
                <div className="absolute -top-3 left-5 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-background border border-border rounded-full text-muted-foreground">
                  A note for you
                </div>
                <blockquote className="font-display text-lg leading-snug text-foreground">"{order.message}"</blockquote>
              </motion.figure>
            )}

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose how to claim</div>

              {sessionEmail && order.recipient_email && sessionEmail.toLowerCase() === order.recipient_email.toLowerCase() ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-success-green">
                    <CheckCircle2 size={16} /> Signed in as {sessionEmail}. This gift is linked to your account.
                  </div>
                  <button
                    onClick={continueAsGuest}
                    className="w-full h-12 rounded-full font-semibold text-gold-foreground"
                    style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                  >
                    Pick my AI tools →
                  </button>
                </div>
              ) : sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-indigo/15 border border-indigo/40 flex items-center justify-center text-indigo">
                    <Mail size={20} />
                  </div>
                  <div className="mt-3 font-display font-semibold">Check your inbox.</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We sent a sign-in link to <span className="text-foreground">{email}</span>. Open it from this device to claim your gift.
                  </p>
                  <button
                    onClick={continueAsGuest}
                    className="mt-5 text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Or skip — claim as guest →
                  </button>
                </motion.div>
              ) : (
                <>
                  <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Your email</label>
                  <div className="mt-1 flex items-center gap-2 h-12 bg-background border border-border rounded-xl px-3 focus-within:border-indigo/60">
                    <Mail size={16} className="text-muted-foreground shrink-0" />
                    <input
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.slice(0, 120))}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={sendMagicLink}
                    disabled={sending}
                    className="mt-4 w-full h-12 rounded-full font-semibold text-gold-foreground disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
                  >
                    {sending ? "Sending link…" : <>Save to my account <ArrowRight size={16} /></>}
                  </button>
                  <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
                  </div>
                  <button
                    onClick={continueAsGuest}
                    className="w-full h-11 rounded-full border border-border hover:border-indigo/40 text-sm font-medium"
                  >
                    Continue as guest →
                  </button>
                  <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck size={12} className="mt-0.5 shrink-0" />
                    <span>We never charge recipients. Picking your tools issues single-use virtual cards — pre-paid by your sender.</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}