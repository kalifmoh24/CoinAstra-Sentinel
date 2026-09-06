/** Decorative Sentinel shield for dashboard hero — cosmetic only. */
export function HeroShield({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden>
      <div className="absolute h-28 w-28 rounded-full bg-accent/20 blur-2xl sm:h-36 sm:w-36" />
      <div className="absolute h-16 w-16 rounded-full bg-accent-violet/30 blur-xl" />
      <svg
        viewBox="0 0 120 140"
        className="relative h-28 w-24 drop-shadow-[0_0_28px_rgba(168,85,247,0.55)] sm:h-40 sm:w-32"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="shieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0b1220" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M60 8 L104 28 V68 C104 98 84 122 60 132 C36 122 16 98 16 68 V28 Z"
          fill="url(#shieldGrad)"
          opacity="0.95"
        />
        <path
          d="M60 18 L94 34 V66 C94 90 78 110 60 118 C42 110 26 90 26 66 V34 Z"
          fill="url(#shieldInner)"
        />
        <path
          d="M48 70 L56 78 L76 54"
          fill="none"
          stroke="#c084fc"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute -bottom-1 h-3 w-16 rounded-full bg-accent/40 blur-md sm:w-20" />
    </div>
  );
}
