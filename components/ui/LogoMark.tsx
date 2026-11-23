import { useId } from "react";

/**
 * The OrbiTech mark: a dark rounded tile, a tapered orbit and a sphere with its small moon.
 * Pure SVG, no request. The same artwork is public/brand/orbitech-mark.svg, which scripts/make-icons.mjs
 * turns into the favicon and app icons: change one, change the other.
 *
 * The orbit is a ring cut from one ellipse by a smaller, shifted one, so it is thick at the lower left
 * and thins to a point near the moon. The ids are made unique per use, so the header and footer can both show it.
 */
export default function LogoMark({ className = "brand__mark" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${id}`;
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={ref("bg")} cx="18%" cy="12%" r="95%">
          <stop offset="0" stopColor="#1a2058" />
          <stop offset="0.45" stopColor="#0a0d2e" />
          <stop offset="1" stopColor="#05061c" />
        </radialGradient>
        <linearGradient id={ref("orbit")} x1="0.05" y1="0.1" x2="0.8" y2="1">
          <stop offset="0" stopColor="#d2bfff" />
          <stop offset="0.38" stopColor="#9a5cff" />
          <stop offset="0.72" stopColor="#7a6aff" />
          <stop offset="1" stopColor="#6aa0ff" />
        </linearGradient>
        <radialGradient id={ref("sphere")} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#c9b6ff" />
          <stop offset="0.55" stopColor="#8f6bff" />
          <stop offset="1" stopColor="#6a42f0" />
        </radialGradient>
        <radialGradient id={ref("dot")} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#e3d9ff" />
          <stop offset="1" stopColor="#a98bff" />
        </radialGradient>
        <mask id={ref("crescent")} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <ellipse rx="35.7" ry="19" transform="translate(50 51) rotate(-32) translate(5 -3)" fill="#000" />
        </mask>
      </defs>
      <rect width="100" height="100" rx="27" fill={`url(#${ref("bg")})`} />
      <g mask={`url(#${ref("crescent")})`}>
        <ellipse rx="41" ry="24" transform="translate(50 51) rotate(-32)" fill={`url(#${ref("orbit")})`} />
      </g>
      <circle cx="51" cy="50.5" r="12" fill={`url(#${ref("sphere")})`} />
      <circle cx="81" cy="24.5" r="4.7" fill={`url(#${ref("dot")})`} />
    </svg>
  );
}
