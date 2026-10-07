import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="wrap lost" aria-labelledby="lost-title">
      <div className="lost__copy">
        <h1 id="lost-title" className="lost__title">
          This page isn’t here.
        </h1>
        <p className="lost__text">
          The address may have changed, or it may never have existed. Here are the places that do.
        </p>
        <ul className="lost__links">
          <li>
            <Link href="/" className="btn btn--ink">
              Home
            </Link>
          </li>
          <li>
            <Link href="/work" className="btn btn--outline">
              Work
            </Link>
          </li>
          <li>
            <Link href="/contact" className="btn btn--outline">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Five layers, one missing: a page that isn't there. */}
      <svg className="lost__art" viewBox="0 0 320 260" role="img" aria-label="Four stacked outlines of a page, with the fifth missing">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <rect x="40" y="150" width="190" height="104" rx="6" opacity="0.35" />
          <rect x="52" y="124" width="190" height="104" rx="6" opacity="0.5" />
          <rect x="64" y="98" width="190" height="104" rx="6" opacity="0.7" />
          <rect x="76" y="72" width="190" height="104" rx="6" />
          <rect x="88" y="46" width="190" height="104" rx="6" strokeDasharray="5 6" opacity="0.55" />
        </g>
        <circle cx="266" cy="72" r="7" className="lost__dot" />
      </svg>
    </section>
  );
}
