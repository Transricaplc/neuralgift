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
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/orders" className="hover:text-foreground">Track an order</Link></li>
            <li>
              <Link to="/studio" className="hover:text-foreground" title="Preview how to split your card across AI tools.">
                Allocation studio
              </Link>
              <span className="block text-[11px] text-muted-foreground/70">Plan your AI spend before you buy.</span>
            </li>
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
            <li><Link to="/manifesto" className="hover:text-foreground">Manifesto</Link></li>
            <li><Link to="/global-access" className="hover:text-foreground">Global access</Link></li>
            <li>support@neuralgift.app</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <span aria-hidden>·</span>
          <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
          <span aria-hidden>·</span>
          <Link to="/refunds" className="hover:text-foreground">Refund Policy</Link>
          <span aria-hidden>·</span>
          <Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NeuralGift · Operated by Transrica PLC. They pick the tool. You give the access.
        </div>
      </div>
    </footer>
  );
}
