import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Track your order — NeuralGift" },
      { name: "description", content: "Look up the status of your NeuralGift card by email and order ID." },
      { property: "og:title", content: "Track your NeuralGift order" },
      { property: "og:description", content: "Look up the status of your NeuralGift card by email and order ID." },
      { property: "og:url", content: "https://neuralgift.app/orders" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/orders" }],
  }),
});

function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<null | { found: boolean }>(null);

  function lookup() {
    if (!email.includes("@") || orderId.trim().length < 4) {
      setResult({ found: false });
      return;
    }
    setResult({ found: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 max-w-2xl mx-auto px-5 sm:px-8 py-16 w-full">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">Track your order.</h1>
        <p className="mt-3 text-muted-foreground">
          We email a receipt with your order ID at checkout. Paste it here with the email you used.
        </p>

        <div className="mt-8 bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email at checkout</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm focus:outline-none focus:border-indigo/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="NG-XXXXXX"
              className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm font-mono tabular focus:outline-none focus:border-indigo/60"
            />
          </div>
          <button
            onClick={lookup}
            className="w-full h-12 rounded-full font-semibold text-gold-foreground"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
          >
            Look up order →
          </button>
        </div>

        {result?.found && (
          <div className="mt-6 bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
                <div className="font-display font-bold tabular text-lg">#{orderId.trim().toUpperCase()}</div>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber/10 text-amber border border-amber/30">
                ⏳ Processing
              </span>
            </div>
            <div className="mt-4 text-sm text-foreground/80 space-y-1">
              <div>Estimated delivery: <span className="text-foreground">Within 24 hours</span></div>
              <div>Recipient: <span className="text-foreground">{email}</span></div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              We're generating your code. You'll receive an email at <span className="text-foreground">{email}</span> within 24 hours.
              Questions? <a href="mailto:hello@neuralgift.app" className="text-indigo hover:underline">hello@neuralgift.app</a> — a human replies fast.
            </p>
          </div>
        )}

        {result && !result.found && (
          <div className="mt-6 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-4">
            We couldn't match that email and order ID. Double-check both, or write to{" "}
            <a className="underline" href="mailto:support@neuralgift.app">support@neuralgift.app</a>.
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground text-center">
          Sent a gift? <Link to="/redeem" className="text-indigo hover:underline">Recipient tracking →</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}