import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">One card. Every AI tool. Instantly redeemable.</p>
        </div>
        <div className="text-sm">
          <div className="font-display font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/buy" className="hover:text-foreground">Buy a card</Link></li>
            <li><Link to="/redeem" className="hover:text-foreground">Redeem</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-display font-semibold mb-3">For business</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/business/landing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/business" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-display font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>support@neuralgift.app</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NeuralGift. They pick the tool. You give the access.
      </div>
    </footer>
  );
}
