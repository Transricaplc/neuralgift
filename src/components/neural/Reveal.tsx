import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,   y: 18 },
  down:  { x: 0,   y: -18 },
  left:  { x: 18,  y: 0 },
  right: { x: -18, y: 0 },
  none:  { x: 0,   y: 0 },
};

/**
 * Reveal — small wrapper that DRYs up the
 * `motion.div initial/whileInView/viewport` blocks repeated across sections.
 * Keeps the same easing + thresholds we've been using by hand.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  once?: boolean;
  className?: string;
  as?: ElementType;
}) {
  const { x, y } = OFFSETS[direction];
  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    show:   { opacity: 1, x: 0, y: 0 },
  };
  const MotionTag = motion(Tag as any);
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}