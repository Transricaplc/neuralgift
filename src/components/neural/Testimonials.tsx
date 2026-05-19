import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Voice = {
  quote: string;
  name: string;
  role: string;
  region: string;
  flag: string;
  tools: string[];
};

const VOICES: Voice[] = [
  {
    quote:
      "My card from Berlin showed up as Naira-priced credit on Claude. First time a Western fintech treated me like a customer, not an edge case.",
    name: "Adaeze O.",
    role: "Indie dev",
    region: "Lagos",
    flag: "🇳🇬",
    tools: ["Claude", "Cursor"],
  },
  {
    quote:
      "Sent my niece a $50 NeuralGift for her birthday instead of a Visa. She built a logo in Midjourney that night. Best gift I've ever given.",
    name: "Marcus R.",
    role: "Product lead",
    region: "Brooklyn",
    flag: "🇺🇸",
    tools: ["Midjourney"],
  },
  {
    quote:
      "Cards arrived for the whole team in São Paulo — paid via PIX, no Stripe nonsense. Engineers picked Cursor, designers grabbed Figma AI. Zero finance drama.",
    name: "Larissa M.",
    role: "COO at Faro Studio",
    region: "São Paulo",
    flag: "🇧🇷",
    tools: ["Cursor", "Figma AI"],
  },
  {
    quote:
      "I'm 17 and live in a country no AI company supports. USDT in, ChatGPT credit out. Took six minutes. I cried a little.",
    name: "Reza K.",
    role: "Student",
    region: "Tehran",
    flag: "🇮🇷",
    tools: ["ChatGPT"],
  },
  {
    quote:
      "Replaced our $40/seat AI stipend with NeuralGift cards. People only spend what they need, the leftover stays on the card. Finance loves the audit trail.",
    name: "Priya S.",
    role: "Head of People, Loom-stage SaaS",
    region: "Bangalore",
    flag: "🇮🇳",
    tools: ["Notion AI", "Claude"],
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--indigo) 22%, transparent), transparent)" }} />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold mb-2">Heard from the inbox</div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight max-w-2xl">
              Real cards. Real currencies. <br className="hidden sm:block" />
              <span className="text-foreground/60">From people the AI industry forgot.</span>
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">5 of 1,200+ early users</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          {VOICES.map((v, i) => (
            <motion.figure
              key={v.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={`relative bg-surface border border-border rounded-2xl p-6 sm:p-7 flex flex-col ${
                i === 0 ? "lg:row-span-2 lg:col-start-1" : ""
              } ${i === 2 ? "lg:col-start-3 lg:row-start-1" : ""}`}
            >
              <Quote
                size={22}
                className="text-gold/60 shrink-0 mb-3"
                strokeWidth={1.5}
              />
              <blockquote className={`font-display leading-snug text-foreground ${i === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>
                "{v.quote}"
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-medium text-foreground">{v.name}</div>
                  <div className="text-muted-foreground">{v.role} · {v.flag} {v.region}</div>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {v.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-background border border-border text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}