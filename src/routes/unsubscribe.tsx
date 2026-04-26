import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/neural/Nav";
import { Footer } from "@/components/neural/Footer";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const search = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: zodValidator(search),
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Unsubscribe — NeuralGift" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return setState({ kind: "invalid" });
        if (data.valid) return setState({ kind: "ready" });
        if (data.reason === "already_unsubscribed") return setState({ kind: "already" });
        setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "invalid" }));
  }, [token]);

  async function confirm() {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return setState({ kind: "error", message: data.error ?? "Failed" });
      if (data.success) return setState({ kind: "done" });
      if (data.reason === "already_unsubscribed") return setState({ kind: "already" });
      setState({ kind: "error", message: "Unexpected response" });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Network error" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center bg-surface border border-border rounded-3xl p-10">
          {state.kind === "loading" && <p className="text-muted-foreground">Checking your link…</p>}

          {state.kind === "ready" && (
            <>
              <h1 className="font-display text-3xl font-bold">Unsubscribe?</h1>
              <p className="mt-3 text-muted-foreground">
                You'll stop receiving NeuralGift emails. You can still buy and redeem cards.
              </p>
              <button
                onClick={confirm}
                className="mt-6 h-11 px-6 rounded-full bg-foreground text-background font-semibold"
              >
                Confirm unsubscribe
              </button>
            </>
          )}

          {state.kind === "submitting" && <p className="text-muted-foreground">Updating…</p>}

          {state.kind === "done" && (
            <>
              <div className="mx-auto w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-xl">✓</div>
              <h1 className="mt-5 font-display text-3xl font-bold">You're unsubscribed.</h1>
              <p className="mt-3 text-muted-foreground">We won't email you again.</p>
            </>
          )}

          {state.kind === "already" && (
            <>
              <h1 className="font-display text-3xl font-bold">Already unsubscribed.</h1>
              <p className="mt-3 text-muted-foreground">No further action needed.</p>
            </>
          )}

          {state.kind === "invalid" && (
            <>
              <h1 className="font-display text-3xl font-bold">Invalid link.</h1>
              <p className="mt-3 text-muted-foreground">This unsubscribe link is invalid or expired.</p>
            </>
          )}

          {state.kind === "error" && (
            <p className="text-amber">Error: {state.message}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}