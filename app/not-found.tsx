import type { Metadata } from "next";
import Link from "next/link";

// Next.js adds <meta name="robots" content="noindex"> to not-found pages itself, so no second tag is set here.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="wrap lost" aria-labelledby="lost-title">
      <span className="eyebrow">404</span>
      <h1 id="lost-title" className="lost__title">
        This page isn’t here.
      </h1>
      <p className="lost__text">The address may have changed, or it may never have existed. Here are the places that do.</p>
      <ul className="lost__links">
        <li>
          <Link href="/" className="btn btn--primary">
            Home
          </Link>
        </li>
        <li>
          <Link href="/work" className="btn btn--secondary">
            Work
          </Link>
        </li>
        <li>
          <Link href="/contact" className="btn btn--secondary">
            Contact
          </Link>
        </li>
      </ul>
    </section>
  );
}
