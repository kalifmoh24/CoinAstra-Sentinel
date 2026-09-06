/** CoinAstra Sentinel hex/shield mark — matches mockup branding. */
export function BrandLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="caHex" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="55%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 L27.5 9 V23 L16 29.5 L4.5 23 V9 Z"
        fill="url(#caHex)"
      />
      <path
        d="M16 7 L23.5 11.2 V20.8 L16 25 L8.5 20.8 V11.2 Z"
        fill="#0A1222"
        fillOpacity="0.55"
      />
      <path
        d="M16 9.5 L14.2 14.2 H10.8 L13.6 17.1 L12.5 21.5 L16 19 L19.5 21.5 L18.4 17.1 L21.2 14.2 H17.8 Z"
        fill="#f5f3ff"
      />
    </svg>
  );
}
