/**
 * NeuralGift — AI Access for Every Human
 *
 * A student in Dar es Salaam shouldn't need a Visa card to use Claude.
 * A developer in Gaza shouldn't be locked out of Lovable because her bank collapsed.
 * A kid in Lima building his first app shouldn't fail at checkout because Yape
 * isn't in the payment menu.
 *
 * We are the financial bridge between every builder on earth and the AI tools
 * they deserve access to. One platform. Every payment method. Every currency.
 * A small transparent commission. Nothing hidden.
 *
 * This codebase exists to make that real.
 */

import type { PspKey } from "./providers";

export type Region = {
  code: string;        // ISO 3166-1 alpha-2 (or "XX" universal fallback)
  name: string;
  currency: string;    // ISO 4217
  symbol: string;
  rate: number;        // local units per 1 USD
  emoji: string;
  psp: PspKey;
  methods: string[];
  microBundle?: { label: string; usd: number };
  accessNote?: string;
};

export const REGIONS: Region[] = [
  // EAST AFRICA
  { code: "TZ", name: "Tanzania",   currency: "TZS", symbol: "TSh",  rate: 2650, emoji: "🇹🇿", psp: "flutterwave",
    methods: ["M-Pesa","Tigo Pesa","Airtel Money","HaloPesa","NMB Bank Transfer","Card"],
    microBundle: { label: "TSh 5,000", usd: 1.89 } },
  { code: "KE", name: "Kenya",      currency: "KES", symbol: "KSh",  rate: 129,  emoji: "🇰🇪", psp: "flutterwave",
    methods: ["M-Pesa","Airtel Money","Bank Transfer","Card"],
    microBundle: { label: "KSh 250", usd: 1.94 } },
  { code: "UG", name: "Uganda",     currency: "UGX", symbol: "USh",  rate: 3720, emoji: "🇺🇬", psp: "flutterwave",
    methods: ["MTN Mobile Money","Airtel Money","Bank Transfer","Card"],
    microBundle: { label: "USh 7,500", usd: 2.02 } },
  { code: "RW", name: "Rwanda",     currency: "RWF", symbol: "FRw",  rate: 1330, emoji: "🇷🇼", psp: "flutterwave",
    methods: ["MTN Mobile Money","Airtel Money","Card"],
    microBundle: { label: "FRw 2,700", usd: 2.03 } },
  { code: "ET", name: "Ethiopia",   currency: "ETB", symbol: "Br",   rate: 57,   emoji: "🇪🇹", psp: "flutterwave",
    methods: ["Telebirr","Commercial Bank Ethiopia","Card"],
    microBundle: { label: "Br 110", usd: 1.93 } },
  { code: "SO", name: "Somalia",    currency: "USD", symbol: "$",    rate: 1,    emoji: "🇸🇴", psp: "crypto",
    methods: ["EVC Plus (Hormuud)","Premier Wallet","USDT (TRC-20)","Card"],
    microBundle: { label: "$2.00", usd: 2.00 } },

  // WEST AFRICA
  { code: "NG", name: "Nigeria",    currency: "NGN", symbol: "₦",    rate: 1580, emoji: "🇳🇬", psp: "flutterwave",
    methods: ["Paystack","OPay","Flutterwave","Bank Transfer","Card"],
    microBundle: { label: "₦3,000", usd: 1.90 } },
  { code: "GH", name: "Ghana",      currency: "GHS", symbol: "GH₵",  rate: 15.4, emoji: "🇬🇭", psp: "flutterwave",
    methods: ["MTN Mobile Money","Telecel Cash","AirtelTigo Money","Card"],
    microBundle: { label: "GH₵30", usd: 1.95 } },
  { code: "SN", name: "Senegal",    currency: "XOF", symbol: "CFA",  rate: 613,  emoji: "🇸🇳", psp: "flutterwave",
    methods: ["Wave","Orange Money","Free Money","Card"],
    microBundle: { label: "CFA 1,200", usd: 1.96 } },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", symbol: "CFA", rate: 613, emoji: "🇨🇮", psp: "flutterwave",
    methods: ["MTN Mobile Money","Orange Money","Wave","Card"],
    microBundle: { label: "CFA 1,200", usd: 1.96 } },
  { code: "CM", name: "Cameroon",   currency: "XAF", symbol: "CFA",  rate: 613,  emoji: "🇨🇲", psp: "flutterwave",
    methods: ["MTN Mobile Money","Orange Money","Card"],
    microBundle: { label: "CFA 1,200", usd: 1.96 } },
  { code: "ML", name: "Mali",       currency: "XOF", symbol: "CFA",  rate: 613,  emoji: "🇲🇱", psp: "flutterwave",
    methods: ["Orange Money","Moov Money","Card"],
    microBundle: { label: "CFA 1,200", usd: 1.96 } },

  // SOUTHERN AFRICA
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", rate: 18.4, emoji: "🇿🇦", psp: "flutterwave",
    methods: ["Ozow (EFT)","SnapScan","MTN MoMo","Capitec Pay","Card"],
    microBundle: { label: "R35", usd: 1.90 } },
  { code: "ZW", name: "Zimbabwe",   currency: "ZWG", symbol: "ZWG",  rate: 14, emoji: "🇿🇼", psp: "crypto",
    methods: ["EcoCash","InnBucks","USDT (TRC-20)","Card (USD only)"],
    microBundle: { label: "$2.00 USD", usd: 2.00 },
    accessNote: "Currency volatility makes USD/crypto the most reliable path in Zimbabwe." },
  { code: "ZM", name: "Zambia",     currency: "ZMW", symbol: "K", rate: 27, emoji: "🇿🇲", psp: "flutterwave",
    methods: ["MTN Mobile Money","Airtel Money","Zamtel Kwacha","Card"],
    microBundle: { label: "K55", usd: 2.04 } },
  { code: "MZ", name: "Mozambique", currency: "MZN", symbol: "MT", rate: 63, emoji: "🇲🇿", psp: "flutterwave",
    methods: ["M-Pesa (Vodacom)","Mkesh","emola","Card"],
    microBundle: { label: "MT125", usd: 1.98 } },

  // NORTH AFRICA
  { code: "EG", name: "Egypt",      currency: "EGP", symbol: "E£", rate: 48.8, emoji: "🇪🇬", psp: "flutterwave",
    methods: ["Fawry","Vodafone Cash","Orange Cash","InstaPay","Card"],
    microBundle: { label: "E£98", usd: 2.01 } },
  { code: "MA", name: "Morocco",    currency: "MAD", symbol: "DH", rate: 9.9, emoji: "🇲🇦", psp: "dlocal",
    methods: ["CMI","CIH Mobile","Maroc Telecom Money","Card"],
    microBundle: { label: "DH20", usd: 2.02 } },
  { code: "TN", name: "Tunisia",    currency: "TND", symbol: "DT", rate: 3.1, emoji: "🇹🇳", psp: "dlocal",
    methods: ["D17","Poste Tunisienne","Card"],
    microBundle: { label: "DT6", usd: 1.94 } },
  { code: "DZ", name: "Algeria",    currency: "DZD", symbol: "DA", rate: 134, emoji: "🇩🇿", psp: "dlocal",
    methods: ["CIB","Satim","Card"],
    microBundle: { label: "DA270", usd: 2.01 } },

  // MIDDLE EAST + CONFLICT ZONES
  { code: "PS", name: "Palestine / Gaza", currency: "ILS", symbol: "₪", rate: 3.7, emoji: "🇵🇸", psp: "crypto",
    methods: ["USDT (TRC-20)","USDC (Stellar)","eFAWATEERcom (West Bank)","Card (if accessible)"],
    microBundle: { label: "$2.00 USDT", usd: 2.00 },
    accessNote: "We see you. Banking infrastructure is severely limited in Gaza — USDT and USDC are accepted with zero markup." },
  { code: "LB", name: "Lebanon",    currency: "LBP", symbol: "L£", rate: 89500, emoji: "🇱🇧", psp: "crypto",
    methods: ["USDT (TRC-20)","Whish Money","OMT","Western Union (USD)","Card (USD)"],
    microBundle: { label: "$2.00 USD", usd: 2.00 },
    accessNote: "Lebanese banking is restricted. USD cash and crypto are the working options." },
  { code: "VE", name: "Venezuela",  currency: "VES", symbol: "Bs", rate: 36.5, emoji: "🇻🇪", psp: "crypto",
    methods: ["USDT (TRC-20)","Zelle (USD)","Pago Móvil (VES)","Binance P2P","Card"],
    microBundle: { label: "$2.00 USD", usd: 2.00 } },
  { code: "IQ", name: "Iraq",       currency: "IQD", symbol: "IQD", rate: 1310, emoji: "🇮🇶", psp: "dlocal",
    methods: ["Qi Card","AsiaHawala","Card"],
    microBundle: { label: "IQD 2,650", usd: 2.02 } },
  { code: "JO", name: "Jordan",     currency: "JOD", symbol: "JD", rate: 0.71, emoji: "🇯🇴", psp: "dlocal",
    methods: ["eFAWATEERcom","Zain Cash","Orange Money","Card"],
    microBundle: { label: "JD 1.40", usd: 1.97 } },
  { code: "TR", name: "Turkey",     currency: "TRY", symbol: "₺", rate: 32.5, emoji: "🇹🇷", psp: "dlocal",
    methods: ["Papara","iyzico","Payfix","Card"],
    microBundle: { label: "₺65", usd: 2.00 } },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "SR", rate: 3.75, emoji: "🇸🇦", psp: "stripe",
    methods: ["STC Pay","Apple Pay","Mada","Card"],
    microBundle: { label: "SR 7.50", usd: 2.00 } },
  { code: "AE", name: "UAE",        currency: "AED", symbol: "AED", rate: 3.67, emoji: "🇦🇪", psp: "stripe",
    methods: ["Apple Pay","Google Pay","Tabby","Card"],
    microBundle: { label: "AED 7.35", usd: 2.00 } },

  // SOUTH ASIA
  { code: "IN", name: "India",      currency: "INR", symbol: "₹", rate: 83.5, emoji: "🇮🇳", psp: "razorpay",
    methods: ["UPI (PhonePe/GPay/Paytm)","NetBanking","Paytm Wallet","Card"],
    microBundle: { label: "₹160", usd: 1.92 } },
  { code: "BD", name: "Bangladesh", currency: "BDT", symbol: "৳", rate: 110, emoji: "🇧🇩", psp: "dlocal",
    methods: ["bKash","Nagad","Rocket","Card"],
    microBundle: { label: "৳210", usd: 1.91 } },
  { code: "PK", name: "Pakistan",   currency: "PKR", symbol: "Rs", rate: 278, emoji: "🇵🇰", psp: "dlocal",
    methods: ["JazzCash","EasyPaisa","HBL Pay","Card"],
    microBundle: { label: "Rs 560", usd: 2.01 } },
  { code: "LK", name: "Sri Lanka",  currency: "LKR", symbol: "Rs", rate: 308, emoji: "🇱🇰", psp: "dlocal",
    methods: ["Dialog eZ Cash","Sampath Vishwa","FriMi","Card"],
    microBundle: { label: "Rs 620", usd: 2.01 } },
  { code: "NP", name: "Nepal",      currency: "NPR", symbol: "Rs", rate: 133, emoji: "🇳🇵", psp: "dlocal",
    methods: ["eSewa","Khalti","IME Pay","Card"],
    microBundle: { label: "Rs 270", usd: 2.03 } },
  { code: "MM", name: "Myanmar",    currency: "MMK", symbol: "K",  rate: 2100, emoji: "🇲🇲", psp: "crypto",
    methods: ["KBZPay","Wave Money","USDT (TRC-20)","Card"],
    microBundle: { label: "$2.00 USDT", usd: 2.00 },
    accessNote: "Traditional banking is restricted in Myanmar — crypto is the most reliable path for international access." },

  // SOUTHEAST ASIA
  { code: "ID", name: "Indonesia",  currency: "IDR", symbol: "Rp", rate: 15800, emoji: "🇮🇩", psp: "xendit",
    methods: ["GoPay","OVO","DANA","QRIS","BNI","Mandiri","Card"],
    microBundle: { label: "Rp 32,000", usd: 2.03 } },
  { code: "PH", name: "Philippines", currency: "PHP", symbol: "₱", rate: 56.5, emoji: "🇵🇭", psp: "xendit",
    methods: ["GCash","Maya","7-Eleven","Cebuana","Card"],
    microBundle: { label: "₱115", usd: 2.04 } },
  { code: "VN", name: "Vietnam",    currency: "VND", symbol: "₫", rate: 24350, emoji: "🇻🇳", psp: "xendit",
    methods: ["MoMo","ZaloPay","VNPay","ViettelPay","Card"],
    microBundle: { label: "₫49,000", usd: 2.01 } },
  { code: "TH", name: "Thailand",   currency: "THB", symbol: "฿", rate: 35.5, emoji: "🇹🇭", psp: "xendit",
    methods: ["PromptPay","TrueMoney Wallet","SCB Easy","Card"],
    microBundle: { label: "฿70", usd: 1.97 } },
  { code: "MY", name: "Malaysia",   currency: "MYR", symbol: "RM", rate: 4.71, emoji: "🇲🇾", psp: "xendit",
    methods: ["DuitNow","Touch 'n Go eWallet","MAE","FPX","Card"],
    microBundle: { label: "RM 9.50", usd: 2.02 } },
  { code: "KH", name: "Cambodia",   currency: "KHR", symbol: "KHR", rate: 4100, emoji: "🇰🇭", psp: "xendit",
    methods: ["ABA Bank","ACLEDA","Wing","KHQR","Card"],
    microBundle: { label: "$2.00 USD", usd: 2.00 } },
  { code: "SG", name: "Singapore",  currency: "SGD", symbol: "S$", rate: 1.35, emoji: "🇸🇬", psp: "stripe",
    methods: ["PayNow","GrabPay","Card"],
    microBundle: { label: "S$2.70", usd: 2.00 } },

  // EAST ASIA
  { code: "CN", name: "China",      currency: "CNY", symbol: "¥", rate: 7.25, emoji: "🇨🇳", psp: "stripe",
    methods: ["Alipay","WeChat Pay","UnionPay","Card"],
    microBundle: { label: "¥14.50", usd: 2.00 } },
  { code: "KR", name: "South Korea", currency: "KRW", symbol: "₩", rate: 1340, emoji: "🇰🇷", psp: "stripe",
    methods: ["KakaoPay","Naver Pay","Toss","Card"],
    microBundle: { label: "₩2,680", usd: 2.00 } },
  { code: "JP", name: "Japan",      currency: "JPY", symbol: "¥", rate: 148, emoji: "🇯🇵", psp: "stripe",
    methods: ["PayPay","LINE Pay","au PAY","Konbini","Card"],
    microBundle: { label: "¥300", usd: 2.03 } },
  { code: "TW", name: "Taiwan",     currency: "TWD", symbol: "NT$", rate: 32.3, emoji: "🇹🇼", psp: "stripe",
    methods: ["LINE Pay","JKOPay","Pi Wallet","Card"],
    microBundle: { label: "NT$65", usd: 2.01 } },

  // LATIN AMERICA
  { code: "BR", name: "Brazil",     currency: "BRL", symbol: "R$", rate: 4.97, emoji: "🇧🇷", psp: "dlocal",
    methods: ["PIX","Boleto Bancário","Mercado Pago","Card"],
    microBundle: { label: "R$10", usd: 2.01 } },
  { code: "MX", name: "Mexico",     currency: "MXN", symbol: "$", rate: 17.1, emoji: "🇲🇽", psp: "dlocal",
    methods: ["OXXO Pay","SPEI","CoDi","Mercado Pago","Card"],
    microBundle: { label: "$34", usd: 1.99 } },
  { code: "CO", name: "Colombia",   currency: "COP", symbol: "$", rate: 3950, emoji: "🇨🇴", psp: "dlocal",
    methods: ["Nequi","Daviplata","PSE","Efecty","Card"],
    microBundle: { label: "$7,900", usd: 2.00 } },
  { code: "AR", name: "Argentina",  currency: "ARS", symbol: "$", rate: 890, emoji: "🇦🇷", psp: "dlocal",
    methods: ["Mercado Pago","Rapipago","PagoFácil","Naranja X","Card"],
    microBundle: { label: "$1,800", usd: 2.02 } },
  { code: "PE", name: "Peru",       currency: "PEN", symbol: "S/", rate: 3.71, emoji: "🇵🇪", psp: "dlocal",
    methods: ["Yape","Plin","PagoEfectivo","Izipay","Card"],
    microBundle: { label: "S/7.50", usd: 2.02 } },
  { code: "CL", name: "Chile",      currency: "CLP", symbol: "$", rate: 930, emoji: "🇨🇱", psp: "dlocal",
    methods: ["Webpay","Khipu","Mach","BECH","Card"],
    microBundle: { label: "$1,900", usd: 2.04 } },
  { code: "EC", name: "Ecuador",    currency: "USD", symbol: "$", rate: 1, emoji: "🇪🇨", psp: "dlocal",
    methods: ["Depósito Bancario","DeUna!","Card"],
    microBundle: { label: "$2.00", usd: 2.00 } },
  { code: "BO", name: "Bolivia",    currency: "BOB", symbol: "Bs", rate: 6.91, emoji: "🇧🇴", psp: "dlocal",
    methods: ["Yape Bolivia","Tigo Money","QR Simple","Card"],
    microBundle: { label: "Bs 14", usd: 2.03 } },
  { code: "PY", name: "Paraguay",   currency: "PYG", symbol: "₲", rate: 7300, emoji: "🇵🇾", psp: "dlocal",
    methods: ["Tigo Money","Personal Pay","Billetera Personal","Card"],
    microBundle: { label: "₲14,600", usd: 2.00 } },
  { code: "UY", name: "Uruguay",    currency: "UYU", symbol: "$U", rate: 38.5, emoji: "🇺🇾", psp: "dlocal",
    methods: ["Abitab","RedPagos","OCA","Card"],
    microBundle: { label: "$U77", usd: 2.00 } },
  { code: "CU", name: "Cuba",       currency: "USD", symbol: "$", rate: 1, emoji: "🇨🇺", psp: "crypto",
    methods: ["USDT (TRC-20)","USDC (Stellar)"],
    microBundle: { label: "$2.00 USDT", usd: 2.00 },
    accessNote: "Financial access in Cuba is limited. Crypto is currently the most reliable method." },
  { code: "HT", name: "Haiti",      currency: "HTG", symbol: "G", rate: 131, emoji: "🇭🇹", psp: "crypto",
    methods: ["MonCash","Labouka","USDT (TRC-20)","Western Union","Card"],
    microBundle: { label: "G260", usd: 1.98 } },
  { code: "GT", name: "Guatemala",  currency: "GTQ", symbol: "Q", rate: 7.78, emoji: "🇬🇹", psp: "dlocal",
    methods: ["Tigo Money","Claro Pay","Visa/MC Debit","Card"],
    microBundle: { label: "Q15.50", usd: 1.99 } },

  // CENTRAL ASIA + EASTERN EUROPE
  { code: "UA", name: "Ukraine",    currency: "UAH", symbol: "₴", rate: 37.3, emoji: "🇺🇦", psp: "stripe",
    methods: ["Privat24","Monobank","Apple Pay","Card"],
    microBundle: { label: "₴75", usd: 2.01 } },
  { code: "KZ", name: "Kazakhstan", currency: "KZT", symbol: "₸", rate: 455, emoji: "🇰🇿", psp: "stripe",
    methods: ["Kaspi Pay","Kaspi QR","Card"],
    microBundle: { label: "₸910", usd: 2.00 } },
  { code: "UZ", name: "Uzbekistan", currency: "UZS", symbol: "so'm", rate: 12700, emoji: "🇺🇿", psp: "stripe",
    methods: ["Payme","Click","Uzum","Card"],
    microBundle: { label: "so'm 25,400", usd: 2.00 } },
  { code: "GE", name: "Georgia",    currency: "GEL", symbol: "₾", rate: 2.68, emoji: "🇬🇪", psp: "stripe",
    methods: ["TBC Pay","Bank of Georgia","Card"],
    microBundle: { label: "₾5.35", usd: 1.99 } },
  { code: "PL", name: "Poland",     currency: "PLN", symbol: "zł", rate: 4.0, emoji: "🇵🇱", psp: "stripe",
    methods: ["BLIK","Przelewy24","Card"],
    microBundle: { label: "zł8", usd: 2.00 } },
  { code: "RO", name: "Romania",    currency: "RON", symbol: "lei", rate: 4.68, emoji: "🇷🇴", psp: "stripe",
    methods: ["BLIK (RO)","Card","Bank Transfer"],
    microBundle: { label: "lei 9.40", usd: 2.01 } },
  { code: "RS", name: "Serbia",     currency: "RSD", symbol: "din", rate: 108, emoji: "🇷🇸", psp: "stripe",
    methods: ["DinaCard","IPS QR","Card"],
    microBundle: { label: "din 220", usd: 2.04 } },

  // WESTERN EUROPE
  { code: "DE", name: "Germany",    currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇩🇪", psp: "stripe", methods: ["SEPA","Giropay","PayPal","Klarna","Card"] },
  { code: "FR", name: "France",     currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇫🇷", psp: "stripe", methods: ["SEPA","Lydia","Alma","PayPal","Card"] },
  { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇳🇱", psp: "stripe", methods: ["iDEAL","SEPA","Card"] },
  { code: "BE", name: "Belgium",    currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇧🇪", psp: "stripe", methods: ["Bancontact","SEPA","Card"] },
  { code: "PT", name: "Portugal",   currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇵🇹", psp: "stripe", methods: ["MB Way","Multibanco","SEPA","Card"] },
  { code: "ES", name: "Spain",      currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇪🇸", psp: "stripe", methods: ["Bizum","SEPA","Card"] },
  { code: "IT", name: "Italy",      currency: "EUR", symbol: "€", rate: 0.92, emoji: "🇮🇹", psp: "stripe", methods: ["Satispay","SEPA","Card"] },
  { code: "SE", name: "Sweden",     currency: "SEK", symbol: "kr", rate: 10.5, emoji: "🇸🇪", psp: "stripe", methods: ["Swish","Klarna","Card"] },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "Fr", rate: 0.89, emoji: "🇨🇭", psp: "stripe", methods: ["Twint","SEPA","Card"] },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.79, emoji: "🇬🇧", psp: "stripe", methods: ["Open Banking","PayPal","Card"] },

  // NORTH AMERICA + OCEANIA
  { code: "US", name: "United States", currency: "USD", symbol: "$", rate: 1, emoji: "🇺🇸", psp: "stripe",
    methods: ["ACH","Venmo","PayPal","Apple Pay","Google Pay","Card"] },
  { code: "CA", name: "Canada",     currency: "CAD", symbol: "CA$", rate: 1.37, emoji: "🇨🇦", psp: "stripe",
    methods: ["Interac","Apple Pay","Card"] },
  { code: "AU", name: "Australia",  currency: "AUD", symbol: "A$", rate: 1.54, emoji: "🇦🇺", psp: "stripe",
    methods: ["PayID","BPAY","Afterpay","Card"] },
  { code: "NZ", name: "New Zealand", currency: "NZD", symbol: "NZ$", rate: 1.65, emoji: "🇳🇿", psp: "stripe",
    methods: ["POLi","Card"] },

  // PACIFIC
  { code: "PG", name: "Papua New Guinea", currency: "PGK", symbol: "K", rate: 3.77, emoji: "🇵🇬", psp: "crypto",
    methods: ["BSP Mobile","USDT (TRC-20)","Card"],
    microBundle: { label: "K7.50", usd: 1.99 } },
  { code: "FJ", name: "Fiji",       currency: "FJD", symbol: "FJ$", rate: 2.25, emoji: "🇫🇯", psp: "stripe",
    methods: ["Vodafone MPaisa","Card"] },

  // UNIVERSAL FALLBACK
  { code: "XX", name: "Other / Not listed", currency: "USD", symbol: "$", rate: 1, emoji: "🌍", psp: "crypto",
    methods: ["USDT (TRC-20)","USDC (Stellar)","USDC (Polygon)","Card (if available)"],
    microBundle: { label: "$2.00 USDT", usd: 2.00 },
    accessNote: "We may not have local payment support yet, but crypto works everywhere. Request your country below." },
];

export const REGION_BY_CODE: Record<string, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.code, r]),
);

export const FALLBACK_REGION: Region = REGION_BY_CODE.XX;

/**
 * Timezone → ISO country mapping for regions we ship.
 * Only a curated list: when a user's tz isn't here we fall back to "XX".
 * Lightweight on purpose — no Intl.Locale country guessing (browser support varies).
 */
export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Africa/Dar_es_Salaam": "TZ",
  "Africa/Nairobi": "KE",
  "Africa/Kampala": "UG",
  "Africa/Kigali": "RW",
  "Africa/Addis_Ababa": "ET",
  "Africa/Mogadishu": "SO",
  "Africa/Lagos": "NG",
  "Africa/Accra": "GH",
  "Africa/Dakar": "SN",
  "Africa/Abidjan": "CI",
  "Africa/Douala": "CM",
  "Africa/Bamako": "ML",
  "Africa/Johannesburg": "ZA",
  "Africa/Harare": "ZW",
  "Africa/Lusaka": "ZM",
  "Africa/Maputo": "MZ",
  "Africa/Cairo": "EG",
  "Africa/Casablanca": "MA",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Beirut": "LB",
  "America/Caracas": "VE",
  "Asia/Baghdad": "IQ",
  "Asia/Amman": "JO",
  "Europe/Istanbul": "TR",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dhaka": "BD",
  "Asia/Karachi": "PK",
  "Asia/Colombo": "LK",
  "Asia/Kathmandu": "NP",
  "Asia/Yangon": "MM",
  "Asia/Jakarta": "ID",
  "Asia/Manila": "PH",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Bangkok": "TH",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Phnom_Penh": "KH",
  "Asia/Singapore": "SG",
  "Asia/Shanghai": "CN",
  "Asia/Seoul": "KR",
  "Asia/Tokyo": "JP",
  "Asia/Taipei": "TW",
  "America/Sao_Paulo": "BR",
  "America/Mexico_City": "MX",
  "America/Bogota": "CO",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Lima": "PE",
  "America/Santiago": "CL",
  "America/Guayaquil": "EC",
  "America/La_Paz": "BO",
  "America/Asuncion": "PY",
  "America/Montevideo": "UY",
  "America/Havana": "CU",
  "America/Port-au-Prince": "HT",
  "America/Guatemala": "GT",
  "Europe/Kiev": "UA",
  "Europe/Kyiv": "UA",
  "Asia/Almaty": "KZ",
  "Asia/Tashkent": "UZ",
  "Asia/Tbilisi": "GE",
  "Europe/Warsaw": "PL",
  "Europe/Bucharest": "RO",
  "Europe/Belgrade": "RS",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Lisbon": "PT",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Stockholm": "SE",
  "Europe/Zurich": "CH",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "Pacific/Port_Moresby": "PG",
  "Pacific/Fiji": "FJ",
};

/** Countries where banking is collapsed/restricted — used for crisis banner. */
export const CRISIS_REGIONS = new Set(["PS", "LB", "VE", "MM", "ZW", "CU"]);

/** Countries treated as "well-served already" — suppress the geo banner. */
export const SUPPRESS_BANNER_REGIONS = new Set([
  "US","CA","GB","DE","FR","NL","BE","PT","ES","IT","SE","CH","AU","NZ",
]);

export function detectRegionFromBrowser(): Region {
  if (typeof Intl === "undefined") return FALLBACK_REGION;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TIMEZONE_TO_COUNTRY[tz];
    if (code && REGION_BY_CODE[code]) return REGION_BY_CODE[code];
  } catch {
    // ignore
  }
  return FALLBACK_REGION;
}

export function formatLocalAmount(usd: number, region: Region): string {
  const local = usd * region.rate;
  // Choose decimals: integer-ish currencies get 0 decimals
  const big = region.rate >= 50;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: big ? 0 : 2,
    minimumFractionDigits: big ? 0 : 2,
  }).format(local);
  return `${region.symbol}${formatted}`;
}