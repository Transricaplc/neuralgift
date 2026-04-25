export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" fill="url(#g)" />
        <circle cx="4" cy="6" r="1.6" fill="#F5C542" />
        <circle cx="20" cy="6" r="1.6" fill="#F5C542" />
        <circle cx="4" cy="18" r="1.6" fill="#F5C542" />
        <circle cx="20" cy="18" r="1.6" fill="#F5C542" />
        <path d="M5.4 6.6 L10 11 M18.6 6.6 L14 11 M5.4 17.4 L10 13 M18.6 17.4 L14 13" stroke="#6366F1" strokeWidth="1.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="#F5C542" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display font-bold tracking-tight text-foreground">NeuralGift</span>
    </div>
  );
}
