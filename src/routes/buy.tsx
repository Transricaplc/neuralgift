import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { GiftCard } from "@/components/neural/GiftCard";
import { StripeGiftCardCheckout } from "@/components/StripeGiftCardCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { track } from "@/lib/analytics";
import { useRegion } from "@/contexts/RegionContext";
import { formatLocalAmount } from "@/data/regions";

export const Route = createFileRoute("/buy")({
  component: BuyPage,
  validateSearch: (s: Record<string, unknown>): { ref?: string; amount?: number } => ({
    ref: typeof s.ref === "string" ? s.ref.slice(0, 32) : undefined,
    amount: typeof s.amount === "string" ? Number(s.amount) : (s.amount as number | undefined),
  }),
  head: () => ({
    meta: [
      { title: "Buy a card — NeuralGift" },
      { name: "description", content: "Pick a denomination. Send digitally or ship a physical card." },
      { property: "og:title", content: "Buy a NeuralGift card" },
      { property: "og:description", content: "Pick a denomination. Send digitally or ship a physical card." },
      { property: "og:url", content: "https://neuralgift.app/buy" },
      { name: "twitter:title", content: "Buy a NeuralGift card" },
      { name: "twitter:description", content: "Pick a denomination. Send digitally or ship a physical card." },
    ],
    links: [
      { rel: "canonical", href: "https://neuralgift.app/buy" },
    ],
  }),
});

const DENOMS = [25, 50, 100] as const;

type Rail = "card" | "local" | "crypto";

function BuyPage() {
  const navigate = useNavigate();
  const { region, openSelector } = useRegion();
  const search = Route.useSearch();
  const initialAmount = search.amount && search.amount >= 5 ? Math.min(500, Math.round(search.amount)) : 50;
  const [amount, setAmount] = useState<number>(initialAmount);
  const [delivery, setDelivery] = useState<"digital" | "physical">("digital");
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const defaultRail: Rail =
    region.psp === "stripe" ? "card" : region.psp === "crypto" ? "crypto" : "local";
  const [rail, setRail] = useState<Rail>(defaultRail);

  // Re-sync rail when region changes via selector
  if (rail === "card" && region.psp !== "stripe") {
    // soft nudge: switch off-card defaults when region updates
  }

  const subtotal = amount * quantity;
  const total = subtotal + (delivery === "physical" ? 5 : 0);
  const localTotal = region.code === "XX" ? null : formatLocalAmount(total, region);

  function handleCheckout() {
    setError(null);
    if (!buyerEmail.includes("@")) {
      setError("Add your email so we can send the receipt.");
      void track("buy_checkout_validation_failed", { reason: "email" });
      return;
    }
    void track("buy_checkout_opened", { amount, quantity, delivery, total, rail, region: region.code });
    if (rail === "local") {
      navigate({
        to: "/pay/local",
        search: { amount, quantity, email: buyerEmail, region: region.code } as never,
      });
      return;
    }
    if (rail === "crypto") {
      navigate({
        to: "/pay/crypto",
        search: { amount, quantity, email: buyerEmail, region: region.code } as never,
      });
      return;
    }
    setCheckoutOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PaymentTestModeBanner />
      <Nav />
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16 w-full">
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Buy a card.</h1>
          <p className="mt-2 text-muted-foreground">Pick a denomination. Choose digital or physical. They redeem when ready.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
          {/* LEFT: form */}
          <div className="space-y-8">
            {/* Denomination */}
            <Section title="Denomination">
              <div className="grid grid-cols-3 gap-3">
                {DENOMS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setAmount(d)}
                    className={`relative rounded-2xl border p-5 text-left transition-all ${
                      amount === d
                        ? "border-gold/60 bg-gold/5 -translate-y-1"
                        : "border-border bg-surface hover:border-indigo/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Card</div>
                    <div className="text-3xl font-display font-bold tabular mt-1">${d}</div>
                    {amount === d && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold" />
                    )}
                  </button>
                ))}
              </div>
            </Section>

            {/* Delivery */}
            <Section title="Delivery">
              <div className="grid sm:grid-cols-2 gap-3">
                <DeliveryTile
                  active={delivery === "digital"}
                  onClick={() => setDelivery("digital")}
                  title="Digital Delivery"
                  desc="Sent by email instantly. No shipping."
                />
                <DeliveryTile
                  active={delivery === "physical"}
                  onClick={() => setDelivery("physical")}
                  title="Physical Card"
                  desc="Ships in 3–5 days. +$5 shipping."
                />
              </div>
            </Section>

            {/* Quantity */}
            <Section title="Quantity" hint="For B2B bulk: 1–500 units">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-border hover:bg-elevated"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                  className="w-24 h-10 rounded-lg bg-surface border border-border text-center tabular font-display font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(500, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-border hover:bg-elevated"
                >+</button>
                <span className="text-sm text-muted-foreground ml-2">cards</span>
              </div>
            </Section>

            {/* Recipient */}
            <Section title="Gift details" hint="Optional — for sending as a gift">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Recipient name" value={recipientName} onChange={setRecipientName} placeholder="Alex" />
                <Input label="Recipient email" value={recipientEmail} onChange={setRecipientEmail} placeholder="alex@example.com" type="email" />
              </div>
              <div className="mt-3">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Personal message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 160))}
                  rows={3}
                  placeholder="A little runway for your next idea."
                  className="mt-1 w-full rounded-xl bg-surface border border-border p-3 text-sm focus:outline-none focus:border-indigo/60"
                />
                <div className="text-xs text-muted-foreground mt-1 tabular">{message.length} / 160</div>
              </div>
            </Section>

            <Section title="Your email" hint="We send your receipt and codes here">
              <Input label="" value={buyerEmail} onChange={setBuyerEmail} placeholder="you@company.com" type="email" />
            </Section>
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex justify-center mb-6">
                <GiftCard amount={amount} />
              </div>
              {/* Region + rail selector */}
              <button
                type="button"
                onClick={openSelector}
                className="w-full mb-4 flex items-center justify-between text-xs px-3 py-2 rounded-lg border border-border bg-background hover:border-indigo/40"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{region.emoji}</span>
                  <span className="text-muted-foreground">Paying from</span>
                  <span className="font-medium text-foreground">{region.name}</span>
                </span>
                <span className="text-indigo">change</span>
              </button>
              <div className="mb-4 grid grid-cols-3 gap-1.5">
                <RailChip active={rail === "card"} onClick={() => setRail("card")} label="Card" sub="Visa · MC" disabled={region.psp !== "stripe" && region.code !== "XX"} />
                <RailChip active={rail === "local"} onClick={() => setRail("local")} label="Local" sub={region.methods[0] ?? "Mobile"} disabled={region.psp === "stripe" && region.code !== "XX"} />
                <RailChip active={rail === "crypto"} onClick={() => setRail("crypto")} label="Crypto" sub="USDT/USDC" />
              </div>
              <div className="space-y-2 text-sm">
                <Row label={`$${amount} card × ${quantity}`} value={`$${subtotal}`} />
                <Row label="Delivery" value={delivery === "physical" ? "$5" : "Free"} />
                <div className="border-t border-border my-3" />
                <Row label="Total" value={`$${total}`} bold />
                {localTotal && (
                  <div className="flex justify-between text-xs text-muted-foreground -mt-1">
                    <span>In {region.currency}</span>
                    <span className="tabular">≈ {localTotal}</span>
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-4 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">
                  {error}
                </div>
              )}
              <button
                type="button"
                disabled={checkoutOpen}
                onClick={handleCheckout}
                className="mt-5 w-full h-12 rounded-full font-semibold text-gold-foreground disabled:opacity-60"
                style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
              >
                {checkoutOpen
                  ? "Loading checkout…"
                  : rail === "card"
                    ? "Continue to card →"
                    : rail === "local"
                      ? `Pay with ${region.methods[0] ?? "mobile money"} →`
                      : "Pay with crypto →"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {rail === "card" && "Secure checkout by Stripe. Code generated after payment."}
                {rail === "local" && "Approve the prompt on your phone. Code drops by email."}
                {rail === "crypto" && "USDT/USDC on Tron, Stellar, or Polygon. Lands in minutes."}
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-lg px-5 py-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
          <div className="font-display font-bold text-lg tabular">${total}</div>
        </div>
        <button
          type="button"
          disabled={checkoutOpen}
          onClick={handleCheckout}
          className="h-11 px-5 rounded-full font-semibold text-gold-foreground disabled:opacity-60"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
        >
          Continue →
        </button>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ✕ Cancel
              </button>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-2 sm:p-4">
              <StripeGiftCardCheckout
                amountInCents={amount * 100}
                quantity={quantity}
                deliveryFeeInCents={delivery === "physical" ? 500 : 0}
                buyerEmail={buyerEmail}
                recipientEmail={recipientEmail || undefined}
                recipientName={recipientName || undefined}
                message={message || undefined}
                deliveryType={delivery}
                returnUrl={`${window.location.origin}/buy/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface border border-border rounded-2xl p-6"
    >
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </motion.div>
  );
}

function DeliveryTile({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${
        active ? "border-indigo/60 bg-indigo/10" : "border-border bg-background hover:border-indigo/40"
      }`}
    >
      <div className="font-display font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      {label && <label className="text-xs text-muted-foreground uppercase tracking-widest">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm focus:outline-none focus:border-indigo/60"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-foreground font-display font-semibold text-base" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}

function RailChip({
  active, onClick, label, sub, disabled,
}: { active: boolean; onClick: () => void; label: string; sub: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-2 py-2 text-left transition-colors ${
        active
          ? "border-gold/60 bg-gold/10"
          : disabled
            ? "border-border bg-background opacity-40 cursor-not-allowed"
            : "border-border bg-background hover:border-indigo/40"
      }`}
    >
      <div className="text-[11px] font-semibold leading-tight">{label}</div>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wider truncate">{sub}</div>
    </button>
  );
}
