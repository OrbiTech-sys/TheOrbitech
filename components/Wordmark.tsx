/** The OrbiTech mark: layered surfaces in a blue tile, set beside the name. */
export default function Wordmark() {
  return (
    <>
      <svg className="wordmark__mark" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="var(--color-kiln)" />
        <g fill="none" stroke="var(--color-paper)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.35">
          <path d="m13 19 11-6 11 6-11 6-11-6Z" />
          <path d="m13 26 11 6 11-6" />
          <path d="m13 32 11 6 11-6" />
        </g>
      </svg>
      <span>OrbiTech</span>
    </>
  );
}
