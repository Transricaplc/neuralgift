import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Your account — NeuralGift" },
      { name: "description", content: "View your gift card orders, redemption codes, and resend confirmation emails." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Order = {
  id: string;
  amount: number;
  quantity: number;
  delivery_type: string;
  status: string;
  recipient_email: string | null;
  redemption_code: string;
  created_at: string;
  message: string | null;
};

function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {!session ? <AuthPanel /> : <Dashboard session={session} />}
      </main>
      <Footer />
    </div>
  );
}

function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (error) throw error;
        setMsg("Check your email to confirm your address, then log in.");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-surface border border-border rounded-3xl p-8">
      <h1 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Sign in to view your gift card orders and resend codes."
          : "Use the same email you used at checkout — your past orders will appear automatically."}
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full h-11 rounded-xl bg-background border border-border px-4"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-11 rounded-xl bg-background border border-border px-4"
        />
        {err && <div className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{err}</div>}
        {msg && <div className="text-sm text-indigo bg-indigo/10 border border-indigo/30 rounded-lg p-3">{msg}</div>}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-11 rounded-full font-semibold text-gold-foreground disabled:opacity-60"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
        >
          {busy ? "…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(null); setMsg(null); }}
          className="text-indigo hover:underline font-medium"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, amount, quantity, delivery_type, status, recipient_email, redemption_code, created_at, message")
        .order("created_at", { ascending: false });
      if (error) setErr(error.message);
      else setOrders((data ?? []) as Order[]);
    })();
  }, [session.user.id]);

  async function resend(code: string) {
    await fetch("/api/public/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "purchase", code }),
    });
    alert("Confirmation email re-sent.");
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Your orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {session.user.email}</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-muted-foreground hover:text-amber"
        >
          Sign out
        </button>
      </div>

      {err && <div className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3 mb-6">{err}</div>}

      {!orders ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-surface border border-border rounded-3xl p-10 text-center">
          <h2 className="font-display text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">When you buy a card, it'll show up here.</p>
          <Link to="/buy" className="inline-flex mt-5 h-11 items-center px-5 rounded-full bg-indigo text-indigo-foreground font-semibold">
            Buy a card →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const short = o.redemption_code.replace(/-/g, "").slice(0, 16).toUpperCase();
            const statusColor =
              o.status === "redeemed" ? "text-indigo border-indigo/30 bg-indigo/10"
              : o.status === "paid" || o.status === "fulfilled" ? "text-gold border-gold/30 bg-gold/10"
              : "text-muted-foreground border-border bg-elevated";
            return (
              <div key={o.id} className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-display text-2xl font-bold tabular">${o.amount * o.quantity}</div>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border ${statusColor}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString()} · {o.quantity} × ${o.amount} · {o.delivery_type}
                      {o.recipient_email && ` · for ${o.recipient_email}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {o.status !== "redeemed" && (
                      <Link
                        to="/redeem"
                        search={{ code: o.redemption_code }}
                        className="h-9 inline-flex items-center px-4 rounded-full text-xs font-semibold border border-gold/40 text-gold hover:bg-gold/10"
                      >
                        Redeem →
                      </Link>
                    )}
                    <button
                      onClick={() => resend(o.redemption_code)}
                      className="h-9 inline-flex items-center px-4 rounded-full text-xs font-semibold border border-border hover:bg-elevated"
                    >
                      Resend email
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-background border border-border rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Code</div>
                    <div className="font-mono text-sm tabular text-gold tracking-widest">{short}</div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(o.redemption_code)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Copy full code
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
