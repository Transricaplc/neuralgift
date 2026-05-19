import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Does the balance expire?",
    a: "Never. No 12-month expiry, no inactivity fees, no auto-renew traps. Your card sits there until you redeem it — even years later.",
  },
  {
    q: "What's the catch on the 3.5% fee?",
    a: "That's it. One flat commission, same whether you pay with USD, M-Pesa, PIX, UPI, or USDT. No FX markup, no monthly fee, no per-redemption charge. We make money once, you keep the rest.",
  },
  {
    q: "Do recipients have to create an account?",
    a: "No. They open the unwrap link, pick their AI tools, and we issue single-use virtual cards to their email. Creating an account is optional — useful only if they want to track multiple gifts.",
  },
  {
    q: "What if my country isn't supported by Stripe or PayPal?",
    a: "We route through whichever rail your region actually uses — M-Pesa in Kenya, MTN MoMo in Ghana, PIX in Brazil, UPI in India, and stablecoins everywhere else. If your country is under sanctions, crypto is the fallback and works in minutes.",
  },
  {
    q: "Which AI tools can the recipient pick?",
    a: "ChatGPT, Claude, Midjourney, Cursor, Perplexity, Runway, ElevenLabs, Notion AI, and more — we add new ones every month. The card works as a single-use virtual Visa, accepted wherever the tool takes card payment.",
  },
  {
    q: "Can I use this for my team or as employee perks?",
    a: "Yes — that's our business plan. Bulk-buy cards, deliver by email or branded portal, and we issue per-employee single-use cards on demand. No subscription waste, full spend visibility, finance-friendly reporting.",
  },
  {
    q: "Is this taxable / reportable?",
    a: "In most jurisdictions, gift cards under $50 are de minimis. Above that, your accountant treats it like any other gift card — we provide a clean receipt and a CSV export for business accounts.",
  },
  {
    q: "What happens if I lose the code?",
    a: "Sign in with the email you used to buy, and your codes are in your account dashboard. Or contact support — every card is keyed to the buyer's email.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20">
      <div className="mb-10 text-center">
        <div className="text-xs uppercase tracking-widest text-gold mb-2">Answered before you ask</div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold">The eight questions everyone has.</h2>
      </div>

      <div className="divide-y divide-border border border-border rounded-2xl bg-surface overflow-hidden">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-left hover:bg-elevated/30 transition-colors"
                aria-expanded={isOpen}
              >
                <span className={`font-display text-base sm:text-lg leading-snug ${isOpen ? "text-foreground" : "text-foreground/85"}`}>
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${isOpen ? "border-gold/50 text-gold bg-gold/10" : "border-border text-muted-foreground"}`}
                >
                  <Plus size={16} strokeWidth={2} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-7 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-center text-muted-foreground">
        Still wondering? Email <a href="mailto:hello@neuralgift.app" className="text-foreground underline underline-offset-4">hello@neuralgift.app</a> — a human replies within a day.
      </p>
    </section>
  );
}