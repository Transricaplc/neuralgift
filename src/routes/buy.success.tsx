import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { ShareInvite } from "@/components/neural/ShareInvite";
import { Gift } from "lucide-react";

const search = z.object({ code: z.string() });

export const Route = createFileRoute("/buy/success")({
  validateSearch: zodValidator(search),
  component: SuccessPage,
});

function SuccessPage() {
  const { code } = Route.useSearch();
  const short = code.replace(/-/g, "").slice(0, 16).toUpperCase();
  const claimUrl = `/claim?code=${encodeURIComponent(code)}`;
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center bg-surface border border-border rounded-3xl p-10"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-2xl">✓</div>
          <h1 className="mt-5 font-display text-3xl font-bold">Your card is ready.</h1>
          <p className="mt-3 text-muted-foreground">We've emailed the receipt and a redemption code. They can use it any time — no expiry tricks.</p>
          <div className="mt-6 bg-background border border-border rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Redemption code</div>
            <div className="mt-2 font-mono text-2xl tabular text-gold tracking-widest break-all">{short}</div>
            <div className="mt-1 text-[10px] text-muted-foreground break-all">Full UUID: {code}</div>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/redeem" search={{ code }} className="h-11 inline-flex items-center px-5 rounded-full bg-indigo text-indigo-foreground font-semibold">
              Redeem now →
            </Link>
            <Link to="/" className="h-11 inline-flex items-center px-5 rounded-full border border-border">Back home</Link>
          </div>
          <div className="mt-6 text-left bg-background border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Gift size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm">Share the unwrap link</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">A personal claim page — no account needed to open.</p>
                <ShareInvite
                  title=""
                  message={`I sent you a $${"" /* amount unknown here */} NeuralGift card — unwrap it here:`}
                  url={claimUrl}
                  surface="buy_success_claim"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 text-left">
            <ShareInvite
              title="Share the moment"
              message="I just sent an AI gift card on NeuralGift — one card, every tool."
              url="/?ref=share"
              surface="buy_success"
            />
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
