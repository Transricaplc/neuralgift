import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { useRegion } from "@/contexts/RegionContext";
import { REGION_BY_CODE } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

type Search = {
  amount?: number;
  quantity?: number;
  email?: string;
  region?: string;
};

// Mock public deposit addresses — replace with provider-issued addresses in production.
const NETWORKS = [
  { id: "usdt-tron",     token: "USDT", network: "TRC-20 (Tron)",    fee: "~$1 network fee",      address: "TYr9k4nFqA1xLm7VeJ3pZ8sWqK2bP6tH4N" },
  { id: "usdc-stellar",  token: "USDC", network: "Stellar",          fee: "~$0.01 network fee",   address: "GA7Z4XQK2BVMNFP3LDYRH8WTSU5JC6E9OA1XKLPDM2NV3RQYT4HBCEFG" },
  { id: "usdc-polygon",  token: "USDC", network: "Polygon",          fee: "~$0.10 network fee",   address: "0x9aF3bE4D2cE1F0c5A6b7D8e9F0A1B2c3D4E5F6A7" },
] as const;

export const Route = createFileRoute("/pay/crypto")({
  component: PayCryptoPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? Number(s.amount) : (s.amount as number | undefined),
    quantity: typeof s.quantity === "string" ? Number(s.quantity) : (s.quantity as number | undefined),
    email: typeof s.email === "string" ? s.email : undefined,
    region: typeof s.region === "string" ? s.region.toUpperCase() : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pay with crypto — NeuralGift" },
      { name: "description", content: "USDT or USDC. Works in every country, including where banks won't." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function PayCryptoPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/pay/crypto" }) as Search;
  const { region: ctxRegion } = useRegion();
  const region = (search.region && REGION_BY_CODE[search.region]) || ctxRegion;

  const amount = Math.max(1, Number(search.amount ?? 25));
  const quantity = Math.max(1, Number(search.quantity ?? 1));
  const usdTotal = amount * quantity;
  const buyerEmail = search.email ?? "";

  const [networkId, setNetworkId] = useState<typeof NETWORKS[number]["id"]>("usdt-tron");
  const network = useMemo(() => NETWORKS.find((n) => n.id === networkId)!, [networkId]);
  const [txHash, setTxHash] = useState("");
  const [stage, setStage] = useState<"form" | "confirming" | "done">("form");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void track("pay_crypto_view", { region: region.code, network: networkId, usd: usdTotal });
  }, [region.code, networkId, usdTotal]);

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function confirm() {
    if (txHash.trim().length < 8) {
      toast.error("Paste your transaction hash to confirm.");
      return;
    }
    if (!buyerEmail.includes("@")) {
      toast.error("Missing email — restart the order.");
      return;
    }
    setStage("confirming");
    void track("pay_crypto_submit", { network: networkId });
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          amount: usdTotal * 100,
          quantity,
          buyer_email: buyerEmail,
          currency: "usd",
          currency_code: "USD",
          exchange_rate: 1,
          local_amount: usdTotal,
          country_code: region.code,
          payment_method_key: network.token.toLowerCase(),
          psp: "crypto",
          status: "pending",
          is_crypto_payment: true,
        })
        .select("id, redemption_code")
        .single();
      if (error) throw error;

      await supabase.from("payment_intents").insert({
        order_id: order.id,
        psp: "crypto",
        payment_method_key: network.token.toLowerCase(),
        status: "submitted",
        usd_amount: usdTotal,
        local_amount: usdTotal,
        local_currency: "USD",
        exchange_rate: 1,
        crypto_token: network.token,
        crypto_network: network.network,
        crypto_address: network.address,
        crypto_tx_hash: txHash.trim().slice(0, 200),
      });

      await new Promise((r) => setTimeout(r, 2200));
      setStage("done");
      void track("pay_crypto_mock_success", { order_id: order.id });
      setTimeout(() => {
        navigate({ to: "/buy/success", search: { code: order.redemption_code } as never });
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't record your transaction. Save the hash and contact support.");
      setStage("form");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-14">
        <Link to="/buy" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
          <ArrowLeft size={14} /> Back to order
        </Link>

        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)] mb-2">
            Crypto · works everywhere
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Send ${usdTotal.toFixed(2)} in stablecoins.</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Pegged 1:1 to USD. Lands in minutes. {region.code !== "XX" && <>Available in {region.emoji} {region.name}.</>}
          </p>
        </div>

        {stage === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose network</div>
              <div className="grid sm:grid-cols-3 gap-2">
                {NETWORKS.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNetworkId(n.id)}
                    className={`text-left rounded-xl border p-3 transition-colors ${
                      networkId === n.id ? "border-[color-mix(in_oklab,var(--crypto-teal)_60%,transparent)] bg-[color-mix(in_oklab,var(--crypto-teal)_10%,transparent)]" : "border-border bg-background hover:border-indigo/40"
                    }`}
                  >
                    <div className="font-display font-semibold text-sm">{n.token}</div>
                    <div className="text-[11px] text-muted-foreground">{n.network}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{n.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Send to this address</div>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-3">
                <code className="flex-1 text-xs sm:text-sm tabular break-all">{network.address}</code>
                <button
                  type="button"
                  onClick={() => copy(network.address)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-elevated hover:bg-elevated/80 text-xs"
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck size={12} />
                Send <span className="text-foreground font-semibold">exactly ${usdTotal.toFixed(2)} {network.token}</span> on {network.network} — other networks will be lost.
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Transaction hash</label>
              <input
                value={txHash}
                onChange={(e) => setTxHash(e.target.value.slice(0, 200))}
                placeholder="Paste your txid after sending…"
                className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-xs tabular focus:outline-none focus:border-indigo/60"
              />
              <button
                onClick={confirm}
                className="mt-4 w-full h-12 rounded-full font-semibold text-gold-foreground"
                style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
              >
                I've sent it — confirm →
              </button>
              <p className="text-[11px] text-muted-foreground mt-3 text-center">
                Demo — addresses above are placeholders. Production issues a fresh address per order.
              </p>
            </div>
          </motion.div>
        )}

        {stage === "confirming" && (
          <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-4">
            <Loader2 className="animate-spin text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)]" size={36} />
            <div>
              <div className="font-display text-lg font-semibold">Watching the chain…</div>
              <p className="text-sm text-muted-foreground mt-1">Confirming your {network.token} transfer on {network.network}.</p>
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
              <div className="font-display text-lg font-semibold">Confirmed on-chain.</div>
              <p className="text-sm text-muted-foreground mt-1">Releasing your card now…</p>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}