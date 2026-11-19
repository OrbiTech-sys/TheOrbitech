import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroVisual from "@/components/sections/HeroVisual";
import { home } from "@/content/site";

const HIGHLIGHT = "Intelligent Systems";

/** The home page hero: copy and calls to action on the left, the orbital visual on the right. */
export default function Hero() {
  const [before, after] = home.headline.includes(HIGHLIGHT) ? home.headline.split(HIGHLIGHT) : [home.headline, ""];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">{home.eyebrow}</span>
          <h1 id="hero-title" className="hero__title">
            {after ? (
              <>
                {before}
                <span className="gradient-text">{HIGHLIGHT}</span>
                {after}
              </>
            ) : (
              home.headline
            )}
          </h1>
          <p className="hero__lede">{home.lede}</p>
          <div className="hero__actions">
            <Link href="/contact" className="btn btn--primary btn--lg">
              Start a Project <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/work" className="btn btn--secondary btn--lg">
              Explore Our Work
            </Link>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
