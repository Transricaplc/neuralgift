import { useState } from "react";
import { Copy, CheckCircle2, MessageCircle, Twitter, Mail } from "lucide-react";
import { track } from "@/lib/analytics";

type Props = {
  /** Short headline above the buttons. */
  title?: string;
  /** One-line copy used in share payloads. */
  message: string;
  /** Absolute or relative URL recipients land on. */
  url: string;
  /** Analytics surface — e.g. "buy_success", "redeem_done". */
  surface: string;
};

/**
 * Compact 4-up share row: Copy, WhatsApp, X, Email.
 * Uses native intents — no SDKs, works on every device.
 */
export function ShareInvite({ title = "Pass it forward", message, url, surface }: Props) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith("http") ? url : `https://neuralgift.app${url}`;
  const text = `${message} ${fullUrl}`;

  function copy() {
    void navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    void track("share_invite_copy", { surface });
    setTimeout(() => setCopied(false), 1600);
  }

  const intents = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(text)}`,
    },
    {
      key: "twitter",
      label: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(fullUrl)}`,
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent("A gift from NeuralGift")}&body=${encodeURIComponent(text)}`,
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{title}</div>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={copy}
          className="h-11 rounded-xl border border-border bg-background hover:border-indigo/40 flex flex-col items-center justify-center gap-0.5 text-[10px]"
        >
          {copied ? <CheckCircle2 size={14} className="text-indigo" /> : <Copy size={14} />}
          <span className="text-muted-foreground">{copied ? "Copied" : "Copy"}</span>
        </button>
        {intents.map((i) => (
          <a
            key={i.key}
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void track("share_invite_click", { surface, channel: i.key })}
            className="h-11 rounded-xl border border-border bg-background hover:border-indigo/40 flex flex-col items-center justify-center gap-0.5 text-[10px]"
          >
            <i.icon size={14} />
            <span className="text-muted-foreground">{i.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}