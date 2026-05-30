import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Smartphone, CheckCircle2, ArrowLeft, Rocket } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { useRegion } from "@/contexts/RegionContext";
import { REGION_BY_CODE, formatLocalAmount } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { toast } from "sonner";
import { createFlutterwaveCheckout } from "@/utils/flutterwave.functions";
import { useServerFn } from "@tanstack/react-start";

type Search = {
  amount?: number;
  quantity?: number;
  email?: string;
  region?: string;
};

export const Route = createFileRoute("/pay/local")({
  component: PayLocalPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? Number(s.amount) : (s.amount as number | undefined),
    quantity: typeof s.quantity === "string" ? Number(s.quantity) : (s.quantity as number | undefined),
    email: typeof s.email === "string" ? s.email : undefined,
    region: typeof s.region === "string" ? s.region.toUpperCase() : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pay with mobile money — NeuralGift" },
      { name: "description", content: "Pay in your local currency with M-Pesa, MTN MoMo, PIX, UPI and more." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function PayLocalPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/pay/local" }) as Search;
  const { region: ctxRegion } = useRegion();
  const region = (search.region && REGION_BY_CODE[search.region]) || ctxRegion;

  const amount = Math.max(1, Number(search.amount ?? 25));
  const quantity = Math.max(1, Number(search.quantity ?? 1));
  const usdTotal = amount * quantity;
  const buyerEmail = search.email ?? "";

  const [method, setMethod] = useState<string>(region.methods[0] ?? "Mobile money");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<"form" | "processing" | "done">("form");
  const [liveReady, setLiveReady] = useState<boolean | null>(null);

  const localTotal = useMemo(() => formatLocalAmount(usdTotal, region), [usdTotal, region]);
  const flutterwaveCheckout = useServerFn(createFlutterwaveCheckout);

  const isFlutterwave = region.psp === "flutterwave";

  useEffect(() => {
    void track("pay_local_view", { region: region.code, method, usd: usdTotal });
  }, [region.code, method, usdTotal]);

  async function submit() {
    if (phone.trim().length < 6) {
      toast.error("Enter your mobile number to receive the prompt.");
      return;
    }
    if (!buyerEmail.includes("@")) {
      toast.error("Missing email — restart the order.");
      return;
    }

    // Try live Flutterwave checkout first for African regions
    if (isFlutterwave) {
      setStage("processing");
      try {
        const result = await flutterwaveCheckout({
          data: {
            amountInCents: usdTotal * 100,
            quantity,
            buyerEmail,
            regionCode: region.code,
            currency: region.currency,
            rate: region.rate,
            paymentMethod: method,
            phone: phone || undefined,
            returnUrl: `${window.location.origin}/buy/success?code=`, // code appended after order creation
          },
        });
        setLiveReady(true);
        // Redirect to Flutterwave hosted checkout
        window.location.href = result.checkoutUrl;
        return;
      } catch (err: any) {
        const msg = err?.message || "";
        if (msg.includes("FLW_SECRET_KEY not configured")) {
          setLiveReady(false);
          setStage("form");
          toast.info("Flutterwave is not yet configured. Showing demo flow.");
        } else {
          console.error(err);
          toast.error("Checkout failed. Try again or switch to crypto.");
          setStage("form");
          return;
        }
      }
    }

    // Demo / non-Flutterwave flow
    setStage("processing");
    void track("pay_local_submit", { region: region.code, method });
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          amount: usdTotal * 100,
          quantity,
          buyer_email: buyerEmail,
          currency: region.currency.toLowerCase(),
          currency_code: region.currency,
          exchange_rate: region.rate,
          local_amount: usdTotal * region.rate,
          country_code: region.code,
          payment_method_key: method,
          psp: region.psp,
          status: "pending",
          is_crypto_payment: false,
        })
        .select("id, redemption_code")
        .single();
      if (error) throw error;

      await new Promise((r) => setTimeout(r, 2400));
      setStage("done");
      void track("pay_local_mock_success", { order_id: order.id });
      setTimeout(() => {
        navigate({ to: "/buy/success", search: { code: order.redemption_code } as never });
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't queue your payment. Try again or switch to crypto.");
      setStage("form");
    }
  }

  const showLaunchingSoon = !isFlutterwave || liveReady === false;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-14">
        <Link to="/buy" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
          <ArrowLeft size={14} /> Back to order
        </Link>

        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--success-green)_85%,white)] mb-2">
            {region.emoji} {region.name} · {region.currency}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Pay with your money.</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            We charge <span className="text-foreground font-semibold">{localTotal}</span> ({region.currency}) — equivalent to ${usdTotal.toFixed(2)} USD.
          </p>
        </div>

        {stage === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-6 space-y-6"
          >
            {showLaunchingSoon && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                <Rocket size={14} />
                <span>
                  {isFlutterwave
                    ? "Flutterwave live keys not configured yet — this is a demo flow."
                    : `${region.psp.toUpperCase()} integration is launching soon — demo flow below.`}
                </span>
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Payment method</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {region.methods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`px-3 py-2 rounded-lg text-xs border text-left transition-colors ${
                      method === m
                        ? "border-indigo/60 bg-indigo/10 text-foreground"
                        : "border-border bg-background hover:border-indigo/40 text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Mobile / wallet number</label>
              <div className="mt-1 flex items-center gap-2 h-12 bg-background border border-border rounded-xl px-3 focus-within:border-indigo/60">
                <Smartphone size={16} className="text-muted-foreground shrink-0" />
                <input
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, 24))}
                  placeholder="e.g. +255 712 345 678"
                  className="flex-1 bg-transparent outline-none text-sm tabular"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                You'll receive a {method} prompt on this number. Approve to release the card.
              </p>
            </div>

            <button
              onClick={submit}
              className="w-full h-12 rounded-full font-semibold text-gold-foreground"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
            >
              {isFlutterwave && liveReady !== false ? `Pay ${localTotal} via Flutterwave →` : `Pay ${localTotal} →`}
            </button>

            <p className="text-[11px] text-muted-foreground text-center">
              {isFlutterwave && liveReady !== false
                ? "Secure checkout powered by Flutterwave. You'll be redirected to complete payment."
                : `Demo — production routes through ${region.psp.toUpperCase()}. No real charge.`}
            </p>
          </motion.div>
        )}

        {stage === "processing" && (
          <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-4">
            <Loader2 className="animate-spin text-indigo" size={36} />
            <div>
              <div className="font-display text-lg font-semibold">Waiting for confirmation…</div>
              <p className="text-sm text-muted-foreground mt-1">Check your phone for the {method} prompt.</p>
            </div>
          </div>
        )}

        {stage === "done" && (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-4"
          >
            <CheckCircle2 className="text-[color-mix(in_oklab,var(--success-green)_85%,white)]" size={44} />
            <div>
              <div className="font-display text-lg font-semibold">Payment received.</div>
              <p className="text-sm text-muted-foreground mt-1">Generating your card…</p>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
