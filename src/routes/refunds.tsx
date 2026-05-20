import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";

export const Route = createFileRoute("/refunds")({
  component: RefundsPage,
  head: () => ({
    meta: [
      { title: "Refund Policy — NeuralGift" },
      { name: "description", content: "Our 30-day refund and replacement policy for digital gift cards." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/refunds" }],
  }),
});

function RefundsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-20 flex-1">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">Refund Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">A human reads every request. We reply within 24 hours.</p>
        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            If your code doesn't work, your redemption fails, or your delivery never arrived, email
            {" "}<a className="text-gold underline" href="mailto:support@neuralgift.app">support@neuralgift.app</a>{" "}
            within 30 days of purchase. We will issue a full refund or replacement code — your choice.
          </p>
          <p>
            Unused balances on partially redeemed cards can be refunded pro-rata if requested within the
            same 30-day window. After 30 days, balances remain valid forever but cannot be converted to cash.
          </p>
          <p className="text-sm text-muted-foreground">
            Crypto-paid orders are refunded in the same coin you paid with (USDT or USDC), to a wallet address
            you supply at the time of the refund request.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}