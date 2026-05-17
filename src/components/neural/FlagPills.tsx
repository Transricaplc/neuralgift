import { useRegion } from "@/contexts/RegionContext";
import { REGIONS } from "@/data/regions";

const FEATURED = ["TZ","KE","NG","GH","ZA","EG","IN","PK","BD","ID","PH","BR","MX","AR","PE","TR","PS","LB","UA","VN"];

export function FlagPills() {
  const { openSelector, region } = useRegion();
  const pills = FEATURED
    .map((c) => REGIONS.find((r) => r.code === c))
    .filter(Boolean) as typeof REGIONS;
  const totalLive = REGIONS.filter((r) => r.code !== "XX").length;

  return (
    <div className="flex flex-wrap gap-1.5 items-center max-w-xl">
      {pills.map((r) => (
        <button
          key={r.code}
          onClick={openSelector}
          aria-label={`${r.name} — pay in ${r.currency}`}
          title={`${r.name} · ${r.methods[0]}`}
          className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] border transition-colors ${
            region.code === r.code
              ? "border-indigo/60 bg-indigo/10 text-foreground"
              : "border-border bg-surface/60 hover:border-indigo/40"
          }`}
        >
          <span className="text-sm leading-none">{r.emoji}</span>
          <span className="uppercase tracking-widest tabular text-muted-foreground">{r.code}</span>
        </button>
      ))}
      <button
        onClick={openSelector}
        className="inline-flex items-center h-7 px-2.5 rounded-full text-[11px] border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
      >
        +{totalLive - pills.length} more →
      </button>
    </div>
  );
}