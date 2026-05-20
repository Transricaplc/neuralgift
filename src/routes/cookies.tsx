import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Cookie Policy — NeuralGift" },
      { name: "description", content: "What we store in your browser and why." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://neuralgift.app/cookies" }],
  }),
});

function CookiesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-20 flex-1">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">Cookie Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">No advertising cookies. Ever.</p>
        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            We use one first-party localStorage key (<code className="text-gold">ng_region_v3</code>) to
            remember the region you picked so prices stay in your currency between visits. No ad networks,
            no cross-site trackers.
          </p>
          <p>
            Stripe and our local PSPs set their own session cookies during checkout — these are required to
            process a payment and are governed by each provider's policy.
          </p>
          <p className="text-sm text-muted-foreground">
            Clear your browser storage at any time to reset all NeuralGift preferences. We will detect your
            region again from your timezone on next visit.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}