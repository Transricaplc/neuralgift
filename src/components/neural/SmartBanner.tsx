import { useEffect, useState } from "react";
import { X, Globe2 } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { CRISIS_REGIONS, SUPPRESS_BANNER_REGIONS } from "@/data/regions";

const DISMISS_KEY = "ng_smart_banner_dismissed_v1";

/**
 * Geo-aware banner shown below the sticky nav on /.
 * - Crisis regions (PS, LB, VE, MM, ZW, CU): teal "crypto works where banks don't"
 * - Other non-US/EU regions: emerald "you're in [X], pay in [Y] via [Z]"
 * - US/EU/UK/AU/NZ/CA: suppressed (already well-served)
 */
export function SmartBanner() {
  const { region, openSelector } = useRegion();
  const [dismissed, setDismissed] = useState(true); // start true to avoid SSR flash

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;
  if (SUPPRESS_BANNER_REGIONS.has(region.code)) return null;
  if (region.code === "XX") return null;

  const isCrisis = CRISIS_REGIONS.has(region.code);

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
  };

  return (
    <div
      role="status"
      className={`relative border-b px-5 sm:px-8 py-2.5 text-sm flex items-center gap-3 ${
        isCrisis
          ? "bg-[color-mix(in_oklab,var(--crypto-teal)_10%,transparent)] border-[color-mix(in_oklab,var(--crypto-teal)_30%,transparent)] text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)]"
          : "bg-[color-mix(in_oklab,var(--success-green)_8%,transparent)] border-[color-mix(in_oklab,var(--success-green)_25%,transparent)] text-[color-mix(in_oklab,var(--success-green)_90%,white)]"
      }`}
    >
      <Globe2 size={14} className="shrink-0 opacity-80" />
      <div className="flex-1 min-w-0">
        {isCrisis ? (
          <span>
            <span aria-hidden>🌍</span> NeuralGift works where banks don't. Crypto payments accepted everywhere — including {region.name}.
          </span>
        ) : (
          <span>
            <span aria-hidden>{region.emoji}</span> You're browsing from{" "}
            <span className="font-semibold">{region.name}</span>. Pay in{" "}
            <span className="font-semibold">{region.currency}</span> with{" "}
            <button onClick={openSelector} className="font-semibold underline underline-offset-2 hover:opacity-80">
              {region.methods[0]}
            </button>
            .
          </span>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}