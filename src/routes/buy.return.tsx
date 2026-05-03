import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';
import { Nav } from '@/components/neural/Nav';
import { Footer } from '@/components/neural/Footer';
import { getOrderBySession } from '@/utils/orders.functions';

const search = z.object({ session_id: z.string() });

export const Route = createFileRoute('/buy/return')({
  validateSearch: zodValidator(search),
  component: ReturnPage,
});

function ReturnPage() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      try {
        const res = await getOrderBySession({ data: { sessionId: session_id } });
        if (cancelled) return;
        if (res.redemptionCode) {
          navigate({ to: '/buy/success', search: { code: res.redemptionCode }, replace: true });
          return;
        }
      } catch (e: any) {
        setError(e?.message || 'Could not load order');
        return;
      }
      attempts++;
      if (attempts < 30) setTimeout(tick, 1000);
      else setError('Payment is taking longer than expected. Check your email shortly.');
    };
    tick();
    return () => { cancelled = true; };
  }, [session_id, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-5 py-16 text-center">
        <div className="max-w-md">
          <div className="mx-auto w-12 h-12 rounded-full border-2 border-gold/40 border-t-gold animate-spin" />
          <h1 className="mt-6 font-display text-2xl font-bold">Finalizing your order…</h1>
          <p className="mt-2 text-muted-foreground text-sm">We're confirming the payment with Stripe. This usually takes a couple of seconds.</p>
          {error && <p className="mt-4 text-sm text-amber">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
