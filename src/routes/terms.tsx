import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — NeuralGift" },
      { name: "description", content: "The terms that govern your use of NeuralGift digital gift cards." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/terms" }],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-20 flex-1">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: May 2026 · Operated by Transrica PLC.</p>
        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            NeuralGift is a digital gift card service operated by Transrica PLC. By purchasing a card you agree
            to our <Link to="/refunds" className="text-gold underline">refund policy</Link> and confirm that
            the redemption country you select is not on a sanctioned-jurisdiction list.
          </p>
          <p>
            Cards never expire, are non-transferable to cash, and may be revoked if used to violate the terms
            of the downstream AI provider (OpenAI, Anthropic, Midjourney, etc.).
          </p>
          <p className="text-sm text-muted-foreground">
            A full long-form Terms document is being drafted and will replace this notice. For commercial
            agreements, contact <a className="text-gold underline" href="mailto:hello@neuralgift.app">hello@neuralgift.app</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}