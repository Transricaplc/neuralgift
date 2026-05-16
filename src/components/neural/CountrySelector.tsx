import { useMemo, useState } from "react";
import { Search, MapPin, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CountrySelector() {
  const { region, setRegion, allRegions, selectorOpen, closeSelector } = useRegion();
  const [query, setQuery] = useState("");
  const [requestMode, setRequestMode] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allRegions.filter((r) => r.code !== "XX");
    if (!q) return list;
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.methods.some((m) => m.toLowerCase().includes(q)),
    );
  }, [query, allRegions]);

  async function submitRequest() {
    if (!requestName.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("platform_requests").insert([
        {
          request_type: "country",
          requested_value: requestName.trim().slice(0, 120),
          requester_email: requestEmail.trim() || null,
        },
      ]);
      if (error) throw error;
      toast.success("Got it — we'll email you when your country goes live.");
      setRequestMode(false);
      setRequestName("");
      setRequestEmail("");
    } catch {
      toast.error("Couldn't submit right now — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={selectorOpen} onOpenChange={(o) => !o && closeSelector()}>
      <DialogContent className="max-w-[560px] sm:max-w-[560px] p-0 gap-0 max-h-[85vh] overflow-hidden flex flex-col bg-surface border-border">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg">Choose your region</DialogTitle>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin size={12} /> Currently: {region.emoji} {region.name} · {region.currency}
          </p>
        </DialogHeader>

        {!requestMode ? (
          <>
            <div className="px-5 py-3 border-b border-border sticky top-0 bg-surface z-10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search countries, currencies, or payment methods…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 bg-elevated border-border"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-2 py-2">
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matches. <button onClick={() => setRequestMode(true)} className="text-indigo hover:underline">Request a country →</button>
                </div>
              )}
              {filtered.map((r) => (
                <button
                  key={r.code}
                  onClick={() => { setRegion(r.code); closeSelector(); }}
                  className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-elevated transition-colors text-left ${region.code === r.code ? "bg-elevated" : ""}`}
                >
                  <span className="text-2xl leading-none w-8 shrink-0">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{r.methods[0]}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground tabular shrink-0">
                    {r.currency}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-border">
              <button
                onClick={() => setRequestMode(true)}
                className="w-full text-sm text-indigo hover:underline text-left"
              >
                + My country isn't listed — request it
              </button>
            </div>
          </>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Country name</label>
              <Input
                autoFocus
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="e.g. Madagascar"
                className="mt-1 bg-elevated border-border"
                maxLength={120}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email (optional)</label>
              <Input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 bg-elevated border-border"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                We'll email you once payment support is live in your region.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRequestMode(false)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={submitRequest}
                disabled={!requestName.trim() || submitting}
                className="flex-1 bg-indigo text-indigo-foreground hover:opacity-90"
              >
                <Send size={14} className="mr-1.5" />
                {submitting ? "Sending…" : "Request"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}