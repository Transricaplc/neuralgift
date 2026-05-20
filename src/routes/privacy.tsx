import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — NeuralGift" },
      { name: "description", content: "How NeuralGift collects, stores, and never sells your data." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-20 flex-1">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: May 2026 · NeuralGift, operated by Transrica PLC.</p>
        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            We collect only what we need to deliver a gift card and prove a payment happened: your email,
            payment metadata (processor ID, amount, currency), and the country your IP resolved to at checkout.
          </p>
          <p>
            We do not sell, rent, or share personal data with advertisers. We use Stripe and local PSPs
            (Flutterwave, Razorpay, MercadoPago, Yape, etc.) to process payments — each is the data controller
            for the payment instrument you choose.
          </p>
          <p>
            You can request export or deletion of your data at any time by emailing <a className="text-gold underline" href="mailto:privacy@neuralgift.app">privacy@neuralgift.app</a>.
          </p>
          <p className="text-sm text-muted-foreground">
            A full GDPR/CCPA-aligned policy is being drafted and will replace this notice. Questions? <Link to="/manifesto" className="text-indigo hover:underline">Read our manifesto</Link> or write to us.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}