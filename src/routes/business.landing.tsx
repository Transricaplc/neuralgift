import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/business/landing")({
  component: BizLanding,
  head: () => ({
    meta: [
      { title: "For business — NeuralGift" },
      { name: "description", content: "Replace coffee cards with capability. Bulk AI gift cards for teams." },
    ],
  }),
});

const TIERS = [
  { name: "Starter", price: "$0", desc: "Up to 25 employees", features: ["Bulk purchasing", "Basic dashboard", "Email support"], cta: "Start free" },
  { name: "Growth", price: "$49/mo", desc: "Up to 200 employees", features: ["Everything in Starter", "Team allocation", "Usage reports", "CSV upload"], cta: "Start trial", highlight: true },
  { name: "Enterprise", price: "Custom", desc: "Unlimited", features: ["Everything in Growth", "SSO + SAML", "Webhooks & API", "Dedicated CSM"], cta: "Contact sales" },
];

const FAQS = [
  { q: "How is this different from a Visa gift card?", a: "Each redemption issues a single-use virtual card pre-loaded for one specific AI service. No weird charges. No fraud risk. Real signal on what your team actually uses." },
  { q: "Do unused funds expire?", a: "Never. Whatever's left on the card stays redeemable indefinitely." },
  { q: "Can recipients split a card across multiple tools?", a: "Yes. That's the entire point. They allocate however they want." },
  { q: "Do you support invoicing?", a: "Yes — Growth and Enterprise tiers. Net-30 by default." },
];

function BizLanding() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !company.trim() || !teamSize.trim()) {
      setErr("Name, company and team size are required."); return;
    }
    const { error } = await supabase.from("leads").insert({ name, company, team_size: teamSize, use_case: useCase || null, email: email || null });
    if (error) { setErr(error.message); return; }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gold/30 text-gold/90 mb-6">For Business</div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight">Replace Coffee Cards <br /> with <span className="text-gradient-gold">Capability.</span></h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">They pick the tool. You give the access. The cleanest way to give your team real AI runway — without managing 14 separate subscriptions.</p>
          </div>
        </section>

        {/* Tiers */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`rounded-2xl border p-7 ${t.highlight ? "border-gold/60 bg-gradient-to-b from-gold/5 to-transparent" : "border-border bg-surface"}`}
              >
                {t.highlight && <div className="text-[10px] uppercase tracking-widest text-gold mb-2">Most popular</div>}
                <div className="font-display text-xl font-semibold">{t.name}</div>
                <div className="mt-3 font-display text-4xl font-bold tabular">{t.price}</div>
                <div className="text-sm text-muted-foreground mt-1">{t.desc}</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-gold">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="#demo" className={`mt-6 inline-flex w-full justify-center h-11 items-center rounded-full font-semibold ${t.highlight ? "text-gold-foreground" : "border border-border hover:bg-elevated"}`} style={t.highlight ? { background: "var(--gradient-gold)" } : {}}>{t.cta}</a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          <h2 className="font-display text-3xl font-semibold mb-6">Compare features.</h2>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-center">Starter</th>
                  <th className="p-4 text-center">Growth</th>
                  <th className="p-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Bulk purchasing", "✓", "✓", "✓"],
                  ["Usage dashboard", "Basic", "Full", "Full"],
                  ["CSV team upload", "—", "✓", "✓"],
                  ["Webhooks & API", "—", "—", "✓"],
                  ["SSO / SAML", "—", "—", "✓"],
                  ["Dedicated CSM", "—", "—", "✓"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{row[0]}</td>
                    <td className="p-4 text-center text-muted-foreground">{row[1]}</td>
                    <td className="p-4 text-center text-muted-foreground">{row[2]}</td>
                    <td className="p-4 text-center text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-display text-3xl font-semibold mb-6">Questions.</h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-surface border border-border rounded-xl">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left p-5 flex justify-between items-center">
                  <span className="font-display font-semibold">{f.q}</span>
                  <span className="text-muted-foreground">{openIdx === i ? "−" : "+"}</span>
                </button>
                {openIdx === i && <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Demo form */}
        <section id="demo" className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
          <div className="bg-surface border border-border rounded-3xl p-8">
            <h2 className="font-display text-3xl font-bold">Book a demo.</h2>
            <p className="mt-2 text-muted-foreground">15 minutes. We'll show you the dashboard and answer anything.</p>
            {submitted ? (
              <div className="mt-6 text-center py-10">
                <div className="text-3xl">✓</div>
                <div className="mt-3 font-display font-semibold text-lg">Thanks — we'll be in touch within one business day.</div>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name" value={name} onChange={setName} />
                  <Field label="Company" value={company} onChange={setCompany} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Email" value={email} onChange={setEmail} type="email" />
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest">Team size</label>
                    <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm">
                      <option value="">Select…</option>
                      <option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">Use case</label>
                  <textarea value={useCase} onChange={(e) => setUseCase(e.target.value)} rows={3} className="mt-1 w-full rounded-xl bg-background border border-border p-3 text-sm" placeholder="What's pushing you to look at this?" />
                </div>
                {err && <div className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{err}</div>}
                <button type="submit" className="w-full h-12 rounded-full font-semibold text-gold-foreground" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}>Request demo →</button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm focus:outline-none focus:border-indigo/60" />
    </div>
  );
}
