import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, Fragment } from "react";
import type { Session } from "@supabase/supabase-js";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AI_SERVICES } from "@/lib/services";

export const Route = createFileRoute("/business")({
  component: BusinessDashboard,
  head: () => ({
    meta: [{ title: "Business dashboard — NeuralGift" }],
  }),
});

type Tab = "overview" | "orders" | "leads" | "team" | "reports" | "settings";

function BusinessDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [session]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!session) return <LoginGate />;

  const tabs: Tab[] = isAdmin
    ? ["overview", "orders", "leads", "team", "reports", "settings"]
    : ["overview", "orders", "team", "reports", "settings"];

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm capitalize transition-colors flex items-center justify-between ${tab === t ? "bg-indigo/15 text-foreground border border-indigo/30" : "text-muted-foreground hover:text-foreground hover:bg-elevated"}`}>
              <span>{t}</span>
              {t === "leads" && <span className="text-[9px] uppercase tracking-widest text-gold">Admin</span>}
            </button>
          ))}
          <button onClick={() => supabase.auth.signOut()} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-amber mt-6">Sign out</button>
        </aside>
        <main>
          {tab === "overview" && <Overview />}
          {tab === "orders" && <Orders />}
          {tab === "leads" && (isAdmin ? <Leads /> : <NoAccess />)}
          {tab === "team" && <Team />}
          {tab === "reports" && <Reports />}
          {tab === "settings" && <Settings session={session} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function NoAccess() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-10 text-center text-muted-foreground">
      You don't have access to this section.
    </div>
  );
}

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  company: string;
  team_size: string;
  email: string | null;
  use_case: string | null;
  status: string;
  notes: string | null;
};

const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;

function Leads() {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("id,created_at,name,company,team_size,email,use_case,status,notes")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data) setRows(data as LeadRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const visible = rows.filter((r) => filter === "all" || r.status === filter);
  const counts = LEAD_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});

  async function updateLead(id: string, patch: Partial<LeadRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    await supabase.from("leads").update(patch).eq("id", id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">Leads</h1>
        <div className="flex gap-1 bg-surface border border-border rounded-full p-1">
          {(["all", ...LEAD_STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 h-8 rounded-full text-xs capitalize transition-colors ${filter === s ? "bg-indigo text-indigo-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s}{s !== "all" && counts[s] !== undefined ? ` · ${counts[s]}` : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No leads {filter !== "all" ? `with status "${filter}"` : "yet"}.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <th className="p-4">Date</th><th className="p-4">Name</th><th className="p-4">Company</th><th className="p-4">Team</th><th className="p-4">Email</th><th className="p-4">Status</th>
            </tr></thead>
            <tbody>
              {visible.map((r) => (
                <Fragment key={r.id}>
                  <tr onClick={() => setOpenId(openId === r.id ? null : r.id)} className="border-b border-border last:border-0 cursor-pointer hover:bg-elevated/40">
                    <td className="p-4 text-muted-foreground tabular">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{r.name}</td>
                    <td className="p-4">{r.company}</td>
                    <td className="p-4 text-muted-foreground">{r.team_size}</td>
                    <td className="p-4 text-muted-foreground">{r.email ?? "—"}</td>
                    <td className="p-4"><LeadStatus s={r.status} /></td>
                  </tr>
                  {openId === r.id && (
                    <tr className="border-b border-border bg-background/40">
                      <td colSpan={6} className="p-5">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Use case</div>
                            <div className="text-sm whitespace-pre-wrap">{r.use_case || <span className="text-muted-foreground">—</span>}</div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Status</div>
                              <select value={r.status} onChange={(e) => updateLead(r.id, { status: e.target.value })} className="h-9 rounded-lg bg-background border border-border px-2 text-sm">
                                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Internal notes</div>
                              <textarea defaultValue={r.notes ?? ""} onBlur={(e) => updateLead(r.id, { notes: e.target.value })} rows={3} className="w-full rounded-lg bg-background border border-border p-2 text-sm" placeholder="Add notes…" />
                            </div>
                            {r.email && (
                              <a href={`mailto:${r.email}?subject=Re: NeuralGift demo for ${encodeURIComponent(r.company)}`} className="inline-flex h-9 items-center px-4 rounded-full text-xs font-semibold bg-indigo text-indigo-foreground">Reply by email</a>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LeadStatus({ s }: { s: string }) {
  const map: Record<string, string> = {
    new: "text-indigo bg-indigo/15",
    contacted: "text-amber bg-amber/15",
    qualified: "text-gold bg-gold/15",
    closed: "text-muted-foreground bg-muted/40",
  };
  return <span className={`text-xs px-2 py-1 rounded-full capitalize ${map[s] ?? ""}`}>{s}</span>;
}

function LoginGate() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/business` } });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8">
          <h1 className="font-display text-3xl font-bold">Sign in to your dashboard.</h1>
          <p className="mt-2 text-muted-foreground text-sm">We'll email you a magic link. No password.</p>
          {sent ? (
            <div className="mt-6 text-center py-6">
              <div className="text-3xl">✉</div>
              <div className="mt-2 font-display font-semibold">Check your inbox at <span className="text-gold">{email}</span></div>
              <div className="mt-1 text-xs text-muted-foreground">Click the link to sign in.</div>
            </div>
          ) : (
            <form onSubmit={send} className="mt-6 space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full h-12 rounded-xl bg-background border border-border px-4 text-sm focus:outline-none focus:border-indigo/60" />
              {err && <div className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{err}</div>}
              <button disabled={loading} className="w-full h-12 rounded-full font-semibold text-gold-foreground disabled:opacity-60" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow-gold)" }}>{loading ? "Sending…" : "Email me a magic link"}</button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function KPI({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold tabular">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState({ issued: 0, value: 0, redeemed: 0 });
  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from("orders").select("amount,quantity,status");
      if (!orders) return;
      const issued = orders.reduce((a, o) => a + (o.quantity ?? 1), 0);
      const value = orders.reduce((a, o) => a + (o.amount ?? 0) * (o.quantity ?? 1), 0);
      const redeemed = orders.filter((o) => o.status === "redeemed").length;
      setStats({ issued, value, redeemed });
    })();
  }, []);
  const rate = stats.issued ? Math.round((stats.redeemed / stats.issued) * 100) : 0;
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Cards issued" value={stats.issued.toString()} />
        <KPI label="Value distributed" value={`$${stats.value.toLocaleString()}`} />
        <KPI label="Redemption rate" value={`${rate}%`} />
        <KPI label="Top tool" value="ChatGPT" hint="Across all redemptions" />
      </div>
    </div>
  );
}

function Orders() {
  const [rows, setRows] = useState<{ id: string; created_at: string; amount: number; quantity: number; status: string; buyer_email: string }[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("orders").select("id,created_at,amount,quantity,status,buyer_email").order("created_at", { ascending: false }).limit(100);
      if (data) setRows(data);
    })();
  }, []);
  const filtered = rows.filter((r) => r.buyer_email.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by buyer email" className="h-10 px-3 rounded-lg bg-surface border border-border text-sm w-64" />
      </div>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <th className="p-4">Date</th><th className="p-4">Buyer</th><th className="p-4 text-right">Qty</th><th className="p-4 text-right">Value</th><th className="p-4">Status</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">No orders yet.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-4 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-4">{r.buyer_email}</td>
                <td className="p-4 text-right tabular">{r.quantity}</td>
                <td className="p-4 text-right tabular">${(r.amount * r.quantity).toLocaleString()}</td>
                <td className="p-4"><Status s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Status({ s }: { s: string }) {
  const map: Record<string, string> = { pending: "text-muted-foreground bg-muted/40", fulfilled: "text-indigo bg-indigo/15", redeemed: "text-gold bg-gold/15" };
  return <span className={`text-xs px-2 py-1 rounded-full ${map[s] ?? ""}`}>{s}</span>;
}

function Team() {
  const [csv, setCsv] = useState("");
  const [parsed, setParsed] = useState<{ email: string; amount: number }[]>([]);
  function parse() {
    const rows = csv.split("\n").map((l) => l.trim()).filter(Boolean);
    const out: { email: string; amount: number }[] = [];
    for (const r of rows) {
      const [email, amt] = r.split(",").map((x) => x?.trim());
      if (email?.includes("@")) out.push({ email, amount: Number(amt) || 50 });
    }
    setParsed(out);
  }
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Team allocation</h1>
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="text-sm text-muted-foreground mb-3">Paste a CSV: <code className="text-foreground">email,amount</code> per line.</div>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} placeholder="alex@company.com,50&#10;sam@company.com,100" className="w-full rounded-xl bg-background border border-border p-3 text-sm font-mono" />
        <div className="mt-3 flex gap-3">
          <button onClick={parse} className="h-10 px-4 rounded-full bg-indigo text-indigo-foreground font-semibold text-sm">Parse</button>
          {parsed.length > 0 && <span className="text-sm text-muted-foreground self-center">{parsed.length} recipients · ${parsed.reduce((a, p) => a + p.amount, 0)} total</span>}
        </div>
        {parsed.length > 0 && (
          <div className="mt-4 max-h-64 overflow-auto border border-border rounded-xl">
            <table className="w-full text-sm">
              <tbody>
                {parsed.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="p-3">{p.email}</td>
                    <td className="p-3 text-right tabular text-gold">${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Reports() {
  const data = AI_SERVICES.map((s) => ({ name: s.name.split(" ")[0], pct: Math.floor(Math.random() * 40) + 10 }));
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">AI tool distribution</h1>
      <div className="bg-surface border border-border rounded-2xl p-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Bar dataKey="pct" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Sample data — wire to live redemptions when team has activity.</p>
    </div>
  );
}

function Settings({ session }: { session: Session }) {
  const [companyName, setCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState(session.user.email ?? "");
  const [webhook, setWebhook] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("business_accounts").select("*").eq("id", session.user.id).maybeSingle();
      if (data) {
        setCompanyName(data.company_name ?? "");
        setBillingEmail(data.billing_email ?? "");
        setWebhook(data.webhook_url ?? "");
      }
    })();
  }, [session.user.id]);

  async function save() {
    setSaved(false);
    await supabase.from("business_accounts").upsert({ id: session.user.id, company_name: companyName, billing_email: billingEmail, webhook_url: webhook, updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 max-w-xl">
        <Field label="Company name" value={companyName} onChange={setCompanyName} />
        <Field label="Billing email" value={billingEmail} onChange={setBillingEmail} type="email" />
        <Field label="Webhook URL" value={webhook} onChange={setWebhook} placeholder="https://yourapp.com/hooks/neuralgift" />
        <div className="flex items-center gap-3">
          <button onClick={save} className="h-11 px-5 rounded-full bg-indigo text-indigo-foreground font-semibold text-sm">Save</button>
          {saved && <span className="text-sm text-gold">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full h-11 rounded-xl bg-background border border-border px-3 text-sm focus:outline-none focus:border-indigo/60" />
    </div>
  );
}
