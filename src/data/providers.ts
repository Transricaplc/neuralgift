/**
 * NeuralGift — Payment Service Provider coverage map.
 *
 * One PSP key per backend integration. The display name + status are
 * surfaced in checkout ("via Flutterwave", "Launching soon", etc.).
 */

export type PspKey =
  | "stripe"
  | "flutterwave"
  | "dlocal"
  | "xendit"
  | "razorpay"
  | "crypto"
  | "manual";

export type PspStatus = "live" | "coming_soon";

export const PSP_COVERAGE: Record<
  PspKey,
  { name: string; status: PspStatus; blurb: string }
> = {
  stripe:      { name: "Stripe",      status: "live",        blurb: "Cards + 30+ local methods across 47 countries." },
  crypto:      { name: "Crypto rails", status: "live",       blurb: "USDT (Tron) + USDC (Stellar/Polygon). Universal fallback." },
  flutterwave: { name: "Flutterwave", status: "live",        blurb: "30+ African countries — M-Pesa, MTN MoMo, Airtel, Wave, OPay." },
  dlocal:      { name: "dLocal",      status: "coming_soon", blurb: "LatAm + South Asia + MENA — PIX, OXXO, Yape, bKash, JazzCash, Papara." },
  xendit:      { name: "Xendit",      status: "coming_soon", blurb: "Southeast Asia — GoPay, OVO, GCash, Maya, DuitNow, PromptPay." },
  razorpay:    { name: "Razorpay",    status: "coming_soon", blurb: "Deepest India coverage — UPI, NetBanking, Paytm, PhonePe." },
  manual:      { name: "Manual",      status: "coming_soon", blurb: "Fulfilled by the NeuralGift team within 24h." },
};