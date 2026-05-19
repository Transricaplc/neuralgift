import { motion } from "framer-motion";

export function GiftCard({
  amount,
  className = "",
  delay = 0,
  rotate = 0,
  float = false,
}: { amount: number; className?: string; delay?: number; rotate?: number; float?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotate - 6 }}
      animate={
        float
          ? { opacity: 1, y: [0, -8, 0], rotate: [rotate, rotate + 0.6, rotate] }
          : { opacity: 1, y: 0, rotate }
      }
      transition={
        float
          ? { delay, duration: 6, ease: "easeInOut", repeat: Infinity, opacity: { duration: 0.7 } }
          : { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      }
      whileHover={{ y: -8, rotate: rotate * 0.5, transition: { duration: 0.3 } }}
      className={`ng-shimmer relative aspect-[1.6/1] w-full max-w-[320px] rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "var(--gradient-card-face)",
        boxShadow: "var(--shadow-card), var(--shadow-glow-indigo)",
        border: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      {/* Neural pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 320 200" aria-hidden>
        <defs>
          <radialGradient id="np" cx="70%" cy="40%" r="60%">
            <stop offset="0" stopColor="#6366F1" stopOpacity="0.6" />
            <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="url(#np)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 30 + (i * 21) % 280;
          const y = 30 + ((i * 47) % 140);
          return <circle key={i} cx={x} cy={y} r="2" fill="#6366F1" opacity="0.7" />;
        })}
        <path d="M40 50 L120 90 M120 90 L80 150 M120 90 L220 70 M220 70 L260 130 M260 130 L180 160" stroke="#6366F1" strokeWidth="0.8" opacity="0.5" fill="none" />
      </svg>

      {/* Logo top-left */}
      <div className="absolute top-4 left-5 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" fill="#F5C542" />
          <circle cx="4" cy="6" r="1.4" fill="#F5C542" />
          <circle cx="20" cy="6" r="1.4" fill="#F5C542" />
          <circle cx="4" cy="18" r="1.4" fill="#F5C542" />
          <circle cx="20" cy="18" r="1.4" fill="#F5C542" />
        </svg>
        <span className="text-[10px] font-display font-bold tracking-widest text-gradient-gold uppercase">NeuralGift</span>
      </div>

      {/* Chip */}
      <div className="absolute top-12 left-5 w-9 h-7 rounded-md" style={{ background: "linear-gradient(135deg, #d4af37, #f5c542 50%, #8a6d1a)" }} />

      {/* Denomination */}
      <div className="absolute bottom-5 right-5 text-right">
        <div className="text-[10px] uppercase tracking-widest text-gold/70 font-display">Value</div>
        <div className="text-4xl font-display font-bold tabular text-gradient-gold leading-none">${amount}</div>
      </div>

      {/* Tiny code line */}
      <div className="absolute bottom-5 left-5 font-mono tabular text-[10px] text-foreground/40">
        •••• •••• •••• {amount.toString().padStart(4, "0")}
      </div>
    </motion.div>
  );
}
