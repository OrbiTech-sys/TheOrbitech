/**
 * The hero illustration: a glowing sphere with orbits and floating interface chips.
 * Pure SVG and CSS, so it adds no script and no image request. It is decorative,
 * hidden from assistive technology, and its slow motion stops for reduced-motion users.
 */
export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__glow" />
      <svg className="hero-visual__svg" viewBox="0 0 560 560" fill="none" focusable="false">
        <defs>
          <radialGradient id="hv-core" cx="34%" cy="28%" r="80%">
            <stop offset="0" stopColor="#E4DEFF" />
            <stop offset="0.38" stopColor="#8065FF" />
            <stop offset="1" stopColor="#1E1650" />
          </radialGradient>
          <radialGradient id="hv-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#8065FF" stopOpacity="0.34" />
            <stop offset="0.6" stopColor="#438BFF" stopOpacity="0.08" />
            <stop offset="1" stopColor="#438BFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hv-orbit" x1="40" y1="280" x2="520" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#438BFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8065FF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#438BFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <circle cx="280" cy="280" r="270" fill="url(#hv-halo)" />
        <circle cx="280" cy="280" r="262" stroke="#252C3A" strokeWidth="1" />
        <circle cx="280" cy="280" r="196" stroke="#252C3A" strokeWidth="1" strokeDasharray="2 7" />

        <g className="hv-spin hv-spin--a">
          <g transform="rotate(-24 280 280)">
            <ellipse cx="280" cy="280" rx="240" ry="92" stroke="url(#hv-orbit)" strokeWidth="1.5" />
            <circle cx="520" cy="280" r="9" fill="#F5F6FA" />
            <circle cx="520" cy="280" r="18" fill="#8065FF" fillOpacity="0.28" />
          </g>
        </g>
        <g className="hv-spin hv-spin--b">
          <g transform="rotate(38 280 280)">
            <ellipse cx="280" cy="280" rx="205" ry="70" stroke="url(#hv-orbit)" strokeWidth="1.2" strokeOpacity="0.8" />
            <circle cx="75" cy="280" r="6" fill="#438BFF" />
            <circle cx="75" cy="280" r="14" fill="#438BFF" fillOpacity="0.25" />
          </g>
        </g>
        <g className="hv-spin hv-spin--c">
          <circle cx="280" cy="280" r="132" stroke="#8065FF" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="1 9" />
          <circle cx="280" cy="148" r="5" fill="#A99BFF" />
        </g>

        <circle cx="280" cy="280" r="86" fill="url(#hv-core)" />
        <ellipse cx="280" cy="280" rx="86" ry="28" stroke="#fff" strokeOpacity="0.1" />
        <ellipse cx="280" cy="280" rx="28" ry="86" stroke="#fff" strokeOpacity="0.1" />
        <circle cx="280" cy="280" r="86" stroke="#fff" strokeOpacity="0.16" />

        <g fill="#A99BFF" fillOpacity="0.55">
          <circle cx="92" cy="150" r="2" />
          <circle cx="470" cy="108" r="2.5" />
          <circle cx="508" cy="392" r="2" />
          <circle cx="132" cy="470" r="2.5" />
          <circle cx="360" cy="520" r="2" />
          <circle cx="40" cy="300" r="1.8" />
        </g>
      </svg>

      <span className="hv-chip hv-chip--1">
        <i />
        AI Agents
      </span>
      <span className="hv-chip hv-chip--2">
        <i />
        Voice AI
      </span>
      <span className="hv-chip hv-chip--3">
        <i />
        RAG
      </span>
      <span className="hv-chip hv-chip--4">
        <i />
        Automation
      </span>

      <div className="hv-panel">
        <span className="hv-panel__title">workflow</span>
        <span>
          <b>→</b> enquiry received
        </span>
        <span>
          <b>→</b> details qualified
        </span>
        <span>
          <b>→</b> follow-up drafted
        </span>
      </div>
    </div>
  );
}
