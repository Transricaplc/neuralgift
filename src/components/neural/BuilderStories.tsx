import { motion } from "framer-motion";

const STORIES = [
  {
    quote: "I couldn't pay for Claude with my Tanzanian bank card. NeuralGift took M-Pesa and I was inside Claude ten minutes later.",
    name: "Asha M.",
    role: "CS student",
    location: "Dar es Salaam",
    emoji: "🇹🇿",
  },
  {
    quote: "Every Stripe checkout failed. USDT on Tron went through on the first try. I shipped my first app this month.",
    name: "Layla K.",
    role: "Self-taught dev",
    location: "Gaza",
    emoji: "🇵🇸",
  },
  {
    quote: "Yape isn't on most foreign sites. Here it just worked — I gifted my brother a card and he picked ChatGPT himself.",
    name: "Mateo R.",
    role: "16, building his first SaaS",
    location: "Lima",
    emoji: "🇵🇪",
  },
];

export function BuilderStories() {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <div className="max-w-2xl mb-10">
        <div className="text-xs uppercase tracking-widest text-gold mb-2">Builders, unblocked</div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
          A student in Dar es Salaam shouldn't need a Visa card to use Claude.
        </h2>
        <p className="mt-3 text-muted-foreground text-sm">
          We exist for everyone the global payment system forgot.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {STORIES.map((s, i) => (
          <motion.figure
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-surface border border-border rounded-2xl p-6 flex flex-col"
          >
            <div className="text-3xl mb-3 leading-none">{s.emoji}</div>
            <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
              "{s.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-4 border-t border-border">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.role} · {s.location}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}