import { motion } from "framer-motion";
import { AI_SERVICES } from "@/lib/services";
import { ServiceIcon } from "./ServiceIcon";

export function Marquee() {
  const row = [...AI_SERVICES, ...AI_SERVICES];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {row.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className="flex items-center gap-2.5 px-4 h-11 rounded-full bg-surface border border-border whitespace-nowrap"
          >
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-display font-bold"
              style={{ background: `${s.color}22`, color: s.color }}
            >
              <ServiceIcon id={s.id} size={14} />
            </span>
            <span className="text-sm font-medium">{s.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.category}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}