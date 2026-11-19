/** The OrbiTech mark: a small sphere with a tilted orbit, in the brand gradient. Pure SVG, no request. */
export default function LogoMark({ className = "brand__mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B2A6FF" />
          <stop offset="0.5" stopColor="#8065FF" />
          <stop offset="1" stopColor="#438BFF" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="#121826" stroke="#252C3A" />
      <ellipse cx="16" cy="16" rx="10.5" ry="4.6" transform="rotate(-28 16 16)" stroke="url(#logo-grad)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="4.4" fill="url(#logo-grad)" />
      <circle cx="24.6" cy="11.4" r="1.7" fill="#F5F6FA" />
    </svg>
  );
}
