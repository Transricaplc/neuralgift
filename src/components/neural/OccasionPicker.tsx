import { Cake, Briefcase, Sparkles, HeartHandshake, PartyPopper, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Occasion = {
  id: string;
  label: string;
  icon: LucideIcon;
  amount: number;
  message: string;
  accent: string;
};

export const OCCASIONS: Occasion[] = [
  {
    id: "birthday",
    label: "Birthday",
    icon: Cake,
    amount: 50,
    message: "Happy birthday — go build something only you could dream up.",
    accent: "var(--gold)",
  },
  {
    id: "new-job",
    label: "New job",
    icon: Briefcase,
    amount: 100,
    message: "Congrats on the new gig. Stack your AI tools — you've earned the runway.",
    accent: "var(--indigo)",
  },
  {
    id: "welcome-ai",
    label: "Welcome to AI",
    icon: Sparkles,
    amount: 25,
    message: "Your first AI toolkit. Pick what fits — no subscriptions, no lock-in.",
    accent: "var(--crypto-teal)",
  },
  {
    id: "thank-you",
    label: "Thank you",
    icon: HeartHandshake,
    amount: 50,
    message: "Just a small thank you. Spend it on something that saves you an hour.",
    accent: "var(--success-green)",
  },
  {
    id: "just-because",
    label: "Just because",
    icon: PartyPopper,
    amount: 25,
    message: "No reason. Go play with the future.",
    accent: "var(--amber)",
  },
  {
    id: "custom",
    label: "Custom",
    icon: Plus,
    amount: 0,
    message: "",
    accent: "var(--muted-foreground)",
  },
];

type Props = {
  selectedId: string | null;
  onSelect: (o: Occasion) => void;
};

export function OccasionPicker({ selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {OCCASIONS.map((o) => {
        const Icon = o.icon;
        const active = selectedId === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o)}
            className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-all ${
              active
                ? "border-gold/60 bg-gold/5 -translate-y-0.5"
                : "border-border bg-background hover:border-indigo/40 hover:-translate-y-0.5"
            }`}
            aria-pressed={active}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: active ? `color-mix(in oklab, ${o.accent} 18%, transparent)` : "transparent",
                color: o.accent,
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
            </div>
            <span className={`text-[11px] font-medium leading-tight text-center ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {o.label}
            </span>
            {active && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold" />}
          </button>
        );
      })}
    </div>
  );
}