import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useRegion } from "@/contexts/RegionContext";
import { ChevronDown } from "lucide-react";

function RegionPill() {
  const { region, openSelector } = useRegion();
  return (
    <button
      onClick={openSelector}
      className="hidden sm:inline-flex h-9 items-center gap-1.5 px-3 rounded-full text-sm border border-border hover:bg-elevated transition-colors"
      aria-label={`Change region (currently ${region.name})`}
    >
      <span className="text-base leading-none">{region.emoji}</span>
      <span className="text-xs uppercase tracking-widest text-muted-foreground tabular">{region.code === "XX" ? "Set region" : region.code}</span>
      <ChevronDown size={12} className="text-muted-foreground" />
    </button>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/business/landing" className="hover:text-foreground transition-colors">For Business</Link>
          <Link to="/redeem" className="hover:text-foreground transition-colors">Redeem</Link>
          <Link to="/account" className="hover:text-foreground transition-colors">Account</Link>
        </nav>
        <div className="flex items-center gap-2">
          <RegionPill />
          <Link
            to="/redeem"
            className="hidden sm:inline-flex h-9 items-center px-4 rounded-full text-sm font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
          >
            Redeem a Card
          </Link>
          <Link
            to="/buy"
            className="inline-flex h-9 items-center px-4 rounded-full text-sm font-semibold bg-indigo text-indigo-foreground hover:opacity-90 transition-opacity"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </header>
  );
}
