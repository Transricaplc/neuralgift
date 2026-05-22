import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Lock, ExternalLink, TrendingUp, Gift, Plus, Power } from "lucide-react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { REGIONS, CRISIS_REGIONS } from "@/data/regions";
import { PSP_COVERAGE, type PspKey } from "@/data/providers";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/coverage")({
  component: AdminCoveragePage,
  head: () => ({
    meta: [
      { title: "Coverage console — NeuralGift admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type OrderRow = { id: string; country_code: string | null; amount: number; psp: string; status: string; created_at: string };
type RequestRow = { id: string; request_type: string; requested_value: string; vote_count: number; requester_country: string | null; created_at: string };

function AdminCoveragePage() {
  const [authState, setAuthState] = useState<"loading" | "anon" | "denied" | "ok">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [filter, setFilter] = useState("");
  const [pspFilter, setPspFilter] = useState<PspKey | "all">("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session?.user) {
        setAuthState("anon");
        return;
      }
      setEmail(session.user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (!mounted) return;
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      if (!isAdmin) {
        setAuthState("denied");
        return;
      }
      setAuthState("ok");
      const [ordersRes, requestsRes] = await Promise.all([
        supabase.from("orders").select("id,country_code,amount,psp,status,created_at").order("created_at", { ascending: false }).limit(500),
        supabase.from("platform_requests").select("id,request_type,requested_value,vote_count,requester_country,created_at").order("vote_count", { ascending: false }).limit(100),
      ]);
      if (!mounted) return;
      setOrders(ordersRes.data ?? []);
      setRequests(requestsRes.data ?? []);
    })();
    return () => { mounted = false; };
  }, []);

  const ordersByCountry = useMemo(() => {
    const map = new Map<string, { count: number; usd: number }>();
    for (const o of orders) {
      const k = (o.country_code ?? "??").toUpperCase();
      const prev = map.get(k) ?? { count: 0, usd: 0 };
      map.set(k, { count: prev.count + 1, usd: prev.usd + o.amount / 100 });
    }
    return map;
  }, [orders]);

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return REGIONS
      .filter((r) => pspFilter === "all" || r.psp === pspFilter)
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.currency.toLowerCase().includes(q))
      .map((r) => {
        const psp = PSP_COVERAGE[r.psp];
        const stats = ordersByCountry.get(r.code) ?? { count: 0, usd: 0 };
        return { region: r, psp, stats, isCrisis: CRISIS_REGIONS.has(r.code) };
      });
  }, [filter, pspFilter, ordersByCountry]);

  const totals = useMemo(() => {
    let live = 0, soon = 0, crisis = 0;
    for (const r of REGIONS) {
      if (PSP_COVERAGE[r.psp].status === "live") live++; else soon++;
      if (CRISIS_REGIONS.has(r.code)) crisis++;
    }
    return { live, soon, crisis, total: REGIONS.length };
  }, []);

  if (authState === "loading") {
    return <ShellMessage title="Checking access…" icon={<Lock size={32} />} />;
  }
  if (authState === "anon") {
    return (
      <ShellMessage
        title="Admin only."
        body="Sign in with an admin account to view the coverage console."
        icon={<Lock size={32} />}
        cta={<Link to="/account" className="inline-flex items-center h-10 px-4 rounded-full bg-indigo text-indigo-foreground text-sm font-semibold">Sign in</Link>}
      />
    );
  }
  if (authState === "denied") {
    return (
      <ShellMessage
        title="No admin role."
        body={`Signed in as ${email ?? "—"}. Ask an existing admin to grant your account the admin role.`}
        icon={<Lock size={32} />}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 py-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold mb-2">
          <ShieldCheck size={14} /> Admin · Coverage console
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Where the world is paying us.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Live PSP map, order volume by country, and the most-requested unsupported regions.</p>

        {/* KPI strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Kpi label="Total regions" value={totals.total} />
          <Kpi label="Live PSPs" value={totals.live} accent="success" />
          <Kpi label="Coming soon" value={totals.soon} />
          <Kpi label="Crisis fallback" value={totals.crisis} accent="crypto" />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-surface border border-border w-full sm:w-72">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by country, code, or currency…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "stripe", "flutterwave", "dlocal", "xendit", "razorpay", "crypto"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPspFilter(p as PspKey | "all")}
                className={`px-3 h-8 rounded-full text-xs border transition-colors ${
                  pspFilter === p ? "border-indigo bg-indigo/10 text-foreground" : "border-border text-muted-foreground hover:border-indigo/40"
                }`}
              >
                {p === "all" ? "All PSPs" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage table */}
        <div className="mt-6 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
            <div className="col-span-4">Region</div>
            <div className="col-span-3">PSP · status</div>
            <div className="col-span-2 text-right">Orders</div>
            <div className="col-span-2 text-right">USD volume</div>
            <div className="col-span-1 text-right">Flag</div>
          </div>
          <div className="max-h-[520px] overflow-auto divide-y divide-border">
            {rows.map(({ region, psp, stats, isCrisis }) => (
              <div key={region.code} className="grid grid-cols-12 gap-3 px-4 py-2.5 text-sm items-center hover:bg-background/40">
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{region.emoji}</span>
                  <div className="min-w-0">
                    <div className="truncate">{region.name}</div>
                    <div className="text-[10px] text-muted-foreground tabular">{region.code} · {region.currency}</div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="text-xs">{psp.name}</div>
                  <div className={`text-[10px] ${psp.status === "live" ? "text-[color-mix(in_oklab,var(--success-green)_85%,white)]" : "text-amber-400"}`}>
                    {psp.status === "live" ? "● live" : "○ coming soon"}
                  </div>
                </div>
                <div className="col-span-2 text-right tabular text-sm">{stats.count || "—"}</div>
                <div className="col-span-2 text-right tabular text-sm">{stats.usd ? `$${stats.usd.toFixed(0)}` : "—"}</div>
                <div className="col-span-1 text-right">
                  {isCrisis && (
                    <span className="inline-block text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-[color-mix(in_oklab,var(--crypto-teal)_45%,transparent)] text-[color-mix(in_oklab,var(--crypto-teal)_85%,white)]">
                      crisis
                    </span>
                  )}
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">No regions match this filter.</div>
            )}
          </div>
        </div>

        {/* Requests */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                <TrendingUp size={12} /> Most requested
              </div>
              <h2 className="font-display text-2xl font-semibold">What the world is asking for.</h2>
            </div>
            <Link to="/global-access" className="text-xs text-indigo inline-flex items-center gap-1 hover:text-foreground">
              View public page <ExternalLink size={12} />
            </Link>
          </div>
          <div className="bg-surface border border-border rounded-2xl divide-y divide-border max-h-[420px] overflow-auto">
            {requests.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">No requests yet. Surface the form on /global-access.</div>
            )}
            {requests.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-12 gap-3 px-4 py-3 text-sm items-center"
              >
                <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground">{r.request_type}</div>
                <div className="col-span-6 truncate">{r.requested_value}</div>
                <div className="col-span-2 text-[10px] text-muted-foreground tabular">{r.requester_country ?? "—"}</div>
                <div className="col-span-2 text-right tabular text-xs">{r.vote_count} vote{r.vote_count !== 1 ? "s" : ""}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <ReferralAdminPanel />
      </main>
      <Footer />
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent?: "success" | "crypto" }) {
  const color =
    accent === "success" ? "color-mix(in oklab, var(--success-green) 85%, white)"
      : accent === "crypto" ? "color-mix(in oklab, var(--crypto-teal) 85%, white)"
      : "var(--foreground)";
  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl tabular" style={{ color }}>{value}</div>
    </div>
  );
}

function ShellMessage({
  title, body, icon, cta,
}: { title: string; body?: string; icon: React.ReactNode; cta?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 grid place-items-center px-5">
        <div className="bg-surface border border-border rounded-2xl p-10 max-w-md text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-elevated grid place-items-center text-muted-foreground mb-4">{icon}</div>
          <div className="font-display text-xl font-semibold">{title}</div>
          {body && <p className="text-sm text-muted-foreground mt-2">{body}</p>}
          {cta && <div className="mt-5">{cta}</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}

type ReferralRow = {
  id: string;
  code: string;
  owner_email: string | null;
  is_active: boolean;
  uses_count: number;
  max_uses: number;
  discount_cents: number;
  credit_cents: number;
  expires_at: string | null;
  created_at: string;
};

function ReferralAdminPanel() {
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    owner_email: "",
    discount_cents: 500,
    credit_cents: 500,
    max_uses: 100,
  });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("referral_codes")
      .select("id,code,owner_email,is_active,uses_count,max_uses,discount_cents,credit_cents,expires_at,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setErr(error.message);
    else setRows((data ?? []) as ReferralRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy("create");
    const code = form.code.trim().toUpperCase();
    if (!code) { setErr("Code required"); setBusy(null); return; }
    const { error } = await supabase.from("referral_codes").insert({
      code,
      owner_email: form.owner_email.trim() || null,
      discount_cents: Math.max(0, form.discount_cents | 0),
      credit_cents: Math.max(0, form.credit_cents | 0),
      max_uses: Math.max(1, form.max_uses | 0),
      is_active: true,
    });
    setBusy(null);
    if (error) { setErr(error.message); return; }
    setForm({ code: "", owner_email: "", discount_cents: 500, credit_cents: 500, max_uses: 100 });
    load();
  }

  async function toggle(row: ReferralRow) {
    setBusy(row.id);
    const { error } = await supabase
      .from("referral_codes")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    setBusy(null);
    if (error) setErr(error.message);
    else setRows((rs) => rs.map((r) => r.id === row.id ? { ...r, is_active: !row.is_active } : r));
  }

  async function updateField(row: ReferralRow, patch: Partial<ReferralRow>) {
    setBusy(row.id);
    const { error } = await supabase.from("referral_codes").update(patch).eq("id", row.id);
    setBusy(null);
    if (error) setErr(error.message);
    else setRows((rs) => rs.map((r) => r.id === row.id ? { ...r, ...patch } : r));
  }

  return (
    <div className="mt-12">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
            <Gift size={12} /> Referral codes
          </div>
          <h2 className="font-display text-2xl font-semibold">Create, tune, pause.</h2>
        </div>
      </div>

      {err && (
        <div className="mb-4 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg p-3">{err}</div>
      )}

      <form onSubmit={create} className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-6 bg-surface border border-border rounded-2xl p-4">
        <input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="CODE"
          className="col-span-2 sm:col-span-1 h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono uppercase tracking-widest"
        />
        <input
          value={form.owner_email}
          onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
          placeholder="owner@email (optional)"
          className="col-span-2 h-10 px-3 rounded-lg bg-background border border-border text-sm"
        />
        <input
          type="number" min={0}
          value={form.discount_cents}
          onChange={(e) => setForm({ ...form, discount_cents: Number(e.target.value) })}
          placeholder="Discount ¢"
          className="h-10 px-3 rounded-lg bg-background border border-border text-sm tabular"
          title="Discount in cents"
        />
        <input
          type="number" min={0}
          value={form.credit_cents}
          onChange={(e) => setForm({ ...form, credit_cents: Number(e.target.value) })}
          placeholder="Credit ¢"
          className="h-10 px-3 rounded-lg bg-background border border-border text-sm tabular"
          title="Credit per use in cents"
        />
        <input
          type="number" min={1}
          value={form.max_uses}
          onChange={(e) => setForm({ ...form, max_uses: Number(e.target.value) })}
          placeholder="Max uses"
          className="h-10 px-3 rounded-lg bg-background border border-border text-sm tabular"
        />
        <button
          type="submit"
          disabled={busy === "create"}
          className="col-span-2 sm:col-span-6 h-10 rounded-full bg-indigo text-indigo-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Plus size={14} /> {busy === "create" ? "Creating…" : "Create code"}
        </button>
      </form>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-2">Code</div>
          <div className="col-span-3">Owner</div>
          <div className="col-span-2 text-right">Uses</div>
          <div className="col-span-2 text-right">Discount ¢</div>
          <div className="col-span-2 text-right">Credit ¢</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        <div className="max-h-[480px] overflow-auto divide-y divide-border">
          {loading && <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading…</div>}
          {!loading && rows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">No referral codes yet. Create one above.</div>
          )}
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-4 py-2.5 text-sm items-center">
              <div className="col-span-2 font-mono text-xs text-gold tabular tracking-widest truncate">{r.code}</div>
              <div className="col-span-3 truncate text-xs text-muted-foreground">{r.owner_email ?? "—"}</div>
              <div className="col-span-2 text-right tabular text-xs">{r.uses_count}/{r.max_uses}</div>
              <NumberCell
                value={r.discount_cents}
                onCommit={(v) => updateField(r, { discount_cents: v })}
                disabled={busy === r.id}
              />
              <NumberCell
                value={r.credit_cents}
                onCommit={(v) => updateField(r, { credit_cents: v })}
                disabled={busy === r.id}
              />
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => toggle(r)}
                  disabled={busy === r.id}
                  title={r.is_active ? "Deactivate" : "Activate"}
                  className={`h-7 px-2 rounded-full text-[10px] uppercase tracking-widest border inline-flex items-center gap-1 disabled:opacity-60 ${
                    r.is_active
                      ? "border-[color-mix(in_oklab,var(--success-green)_45%,transparent)] text-[color-mix(in_oklab,var(--success-green)_85%,white)] bg-[color-mix(in_oklab,var(--success-green)_10%,transparent)]"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <Power size={10} /> {r.is_active ? "On" : "Off"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NumberCell({ value, onCommit, disabled }: { value: number; onCommit: (v: number) => void; disabled?: boolean }) {
  const [v, setV] = useState(String(value));
  useEffect(() => { setV(String(value)); }, [value]);
  return (
    <div className="col-span-2 text-right">
      <input
        type="number"
        min={0}
        value={v}
        disabled={disabled}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const n = Math.max(0, Number(v) | 0);
          if (n !== value) onCommit(n);
        }}
        className="w-24 h-8 px-2 rounded-md bg-background border border-border text-xs tabular text-right"
      />
    </div>
  );
}