import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { SmartBanner } from "@/components/neural/SmartBanner";
import { GiftCard } from "@/components/neural/GiftCard";
import { Marquee } from "@/components/neural/Marquee";
import { AI_SERVICES } from "@/lib/services";
import { ServiceIcon } from "@/components/neural/ServiceIcon";
import { FlagPills } from "@/components/neural/FlagPills";
import { PayYourWay } from "@/components/neural/PayYourWay";
import { BuilderStories } from "@/components/neural/BuilderStories";
import { TransparencyStrip } from "@/components/neural/TransparencyStrip";
import { CrisisAccess } from "@/components/neural/CrisisAccess";

export const Route = createFileRoute("/")({
  component: Index,
});

const STEPS = [
  { n: "01", title: "Buy", desc: "Pick a denomination. Send digitally or ship a physical card." },
  { n: "02", title: "Redeem", desc: "Enter the code. See your balance and the full menu of AI tools." },
  { n: "03", title: "Choose your AI", desc: "Split how you like. We provision a single-use card per service." },
];

const B2B = [
  { title: "Bulk Purchasing", desc: "Order 1–500 cards in a single checkout. Volume pricing baked in." },
  { title: "Usage Dashboard", desc: "See exactly which AI tools your team picks. Real signal, no guesswork." },
  { title: "Zero Recurring Hassle", desc: "No subscription sprawl. No cancelled trials. Spend exactly what you intend." },
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <SmartBanner />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gold/30 text-gold/90 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Now in early access
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              Gift the Future <br /> of <span className="text-gradient-gold">Thinking.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-lg text-muted-foreground max-w-lg"
            >
              One card. Every AI tool. Every currency.
              <br className="hidden sm:block" />
              Pay in <span className="text-foreground font-medium">your money</span>, your way — M-Pesa, UPI, PIX, USDT, or card — and redeem across ChatGPT, Claude, Midjourney and more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <FlagPills />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/buy"
                className="inline-flex items-center h-12 px-6 rounded-full font-semibold text-gold-foreground"
                style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
              >
                Buy a card →
              </Link>
              <Link
                to="/redeem"
                className="inline-flex items-center h-12 px-6 rounded-full font-semibold border border-border text-foreground hover:bg-elevated transition-colors"
              >
                Redeem code
              </Link>
            </motion.div>
            <p className="mt-5 text-xs text-muted-foreground">No subscriptions. No expiry. They pick the tool — in any currency.</p>
          </div>

          <CardStack />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border bg-surface/40">
        <Marquee />
      </section>

      {/* TRANSPARENCY */}
      <TransparencyStrip />

      {/* PAY YOUR WAY */}
      <PayYourWay />

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-10">How it works.</h2>
        <div className="grid md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-border" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full border border-indigo/40 bg-indigo/10 flex items-center justify-center text-indigo font-display font-bold">
                  {s.n}
                </div>
                <div className="font-display text-2xl text-foreground/30 tabular">{`0${i + 1}`}</div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI TOOL GRID */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Works with every tool worth having.</h2>
          <span className="text-sm text-muted-foreground">More added every month</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {AI_SERVICES.map((s) => (
            <div
              key={s.id}
              className="bg-surface border border-border rounded-xl p-4 hover:border-indigo/40 transition-colors flex flex-col items-center text-center gap-2"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm"
                style={{ background: `${s.color}22`, color: s.color }}
              >
                <ServiceIcon id={s.id} size={22} />
              </div>
              <div className="text-xs font-medium leading-tight">{s.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BUILDER STORIES */}
      <BuilderStories />

      {/* CRISIS REGION ACCESS */}
      <CrisisAccess />

      {/* B2B BAND */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div
            className="rounded-3xl border border-border p-8 sm:p-12 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--surface), var(--elevated))" }}
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20" style={{ background: "var(--gradient-indigo)", filter: "blur(80px)" }} />
            <div className="relative grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-xs uppercase tracking-widest text-gold mb-3">For Business</div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
                  Replace coffee cards with capability.
                </h2>
                <p className="mt-4 text-muted-foreground max-w-md">
                  They pick the tool. You give the access. The cleanest way to give your team real AI runway.
                </p>
                <Link
                  to="/business/landing"
                  className="mt-6 inline-flex items-center h-11 px-5 rounded-full font-semibold bg-indigo text-indigo-foreground hover:opacity-90"
                >
                  Explore for business →
                </Link>
              </div>
              <div className="grid gap-3">
                {B2B.map((b) => (
                  <div key={b.title} className="bg-background/40 border border-border rounded-xl p-5">
                    <div className="font-display font-semibold mb-1">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
          The smartest gift you can give <br /> in <span className="text-gradient-gold">2026.</span>
        </h2>
        <p className="mt-5 text-muted-foreground">Pick a denomination. They pick the tool. Everyone wins.</p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            to="/buy"
            className="inline-flex items-center h-12 px-7 rounded-full font-semibold text-gold-foreground"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}
          >
            Buy a card
          </Link>
          <Link
            to="/business/landing"
            className="inline-flex items-center h-12 px-7 rounded-full font-semibold border border-border hover:bg-elevated"
          >
            Talk to sales
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CardStack() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-12, 12]);
  const rotX = useTransform(sy, [-1, 1], [8, -8]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="relative h-[420px] sm:h-[480px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute" style={{ transform: "translate(-90px, 30px)" }}>
          <GiftCard amount={25} delay={0.2} rotate={-10} float />
        </div>
        <div className="absolute z-10" style={{ transform: "translate(0, -10px) scale(1.05)" }}>
          <GiftCard amount={50} delay={0.05} rotate={0} float />
        </div>
        <div className="absolute" style={{ transform: "translate(90px, 30px)" }}>
          <GiftCard amount={100} delay={0.35} rotate={10} float />
        </div>
      </motion.div>
    </div>
  );
}
