import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { home } from "@/content/site";

/**
 * The home page hero: a small "new" badge that links to the demos, a bold uppercase headline, a one-line box that carries the
 * visitor's problem to the contact form, the sentence and two actions; a developer on a
 * violet shape on the right.
 */
export default function Hero() {
  const accents = new Set<string>(home.headlineAccents);
  const words = home.headline.split(" ");
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          {/* Points at the demo sites in the portfolio (they open after an email check). */}
          <Link href="/work" className="hero-badge">
            <span className="hero-badge__tag">New</span>
            <span className="hero-badge__text">Try our live demo sites</span>
            <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
          </Link>
          <h1 id="hero-title" className="hero__title">
            {words.map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                {accents.has(word) ? <span className="hero__mark">{word}</span> : word}
              </span>
            ))}
          </h1>

          {/* A plain GET to the contact page: the form there picks the text up as the project description. */}
          <form className="hero-ask" action="/contact" method="get" role="search" aria-label="Start with your problem">
            <label htmlFor="hero-brief" className="sr-only">
              Describe your problem
            </label>
            <input
              id="hero-brief"
              name="brief"
              className="hero-ask__input"
              placeholder="Enter your problem…"
              autoComplete="off"
              maxLength={400}
            />
            <button type="submit" className="hero-ask__button">
              <span className="hero-ask__label">Let’s Talk</span>
              <span className="hero-ask__icon" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </button>
          </form>

          <p className="hero__lede">{home.lede}</p>
          <div className="hero__actions">
            <Link href="/contact" className="btn btn--primary btn--lg">
              Start a Project <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/work" className="btn btn--secondary btn--lg">
              Explore Our Work <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero__media">
          <Image
            className="hero__photo"
            src="/home/hero-developer.webp"
            alt="A developer working on a laptop"
            width={752}
            height={666}
            sizes="(min-width: 960px) 45vw, 100vw"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
