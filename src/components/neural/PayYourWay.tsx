import { useRegion } from "@/contexts/RegionContext";

type Method = { name: string; region: string; emoji: string; tint: string };

const METHODS: Method[] = [
  { name: "M-Pesa",        region: "East Africa",    emoji: "📱", tint: "#00b14f" },
  { name: "MTN MoMo",      region: "West Africa",    emoji: "📶", tint: "#ffcc00" },
  { name: "Wave",          region: "Senegal · CI",   emoji: "🌊", tint: "#1dc8ff" },
  { name: "PIX",           region: "Brazil",         emoji: "⚡", tint: "#00c4a7" },
  { name: "OXXO",          region: "Mexico",         emoji: "🏪", tint: "#e30613" },
  { name: "UPI",           region: "India",          emoji: "🇮🇳", tint: "#ff6b35" },
  { name: "GCash",         region: "Philippines",    emoji: "💙", tint: "#007dfe" },
  { name: "DANA / OVO",    region: "Indonesia",      emoji: "🟢", tint: "#118eea" },
  { name: "bKash",         region: "Bangladesh",     emoji: "💗", tint: "#e2136e" },
  { name: "JazzCash",      region: "Pakistan",       emoji: "⚡", tint: "#b91d47" },
  { name: "Papara",        region: "Turkey",         emoji: "💳", tint: "#ff7a00" },
  { name: "USDT (TRC-20)", region: "Universal",      emoji: "₮",  tint: "#26a17b" },
  { name: "USDC (Stellar)",region: "Universal",      emoji: "Ⓢ",  tint: "#2775ca" },
  { name: "Cards (Visa/MC)",region: "Where it works",emoji: "💳", tint: "#6366f1" },
];

export function PayYourWay() {
  const { region, openSelector } = useRegion();
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)] mb-2">
            Pay your way
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight max-w-2xl">
            Local money. Mobile wallets. Crypto when banks won't.
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl">
            {region.code === "XX"
              ? "Pick any rail. We meet you where your wallet is."
              : <>In {region.emoji} {region.name} we accept <span className="text-foreground font-medium">{region.methods.slice(0,2).join(" · ")}</span> and more.</>}
          </p>
        </div>
        <button
          onClick={openSelector}
          className="text-sm text-indigo hover:underline"
        >
          See methods for your country →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {METHODS.map((m) => (
          <div
            key={m.name}
            className="bg-surface border border-border rounded-xl p-4 hover:border-indigo/40 transition-colors flex flex-col items-center text-center gap-2"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: `${m.tint}22`, color: m.tint }}
            >
              {m.emoji}
            </div>
            <div className="text-xs font-medium leading-tight">{m.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.region}</div>
          </div>
        ))}
      </div>
    </section>
  );
}