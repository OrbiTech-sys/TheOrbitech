import Link from "next/link";
import type { CSSProperties } from "react";
import BookingLink from "@/components/BookingLink";
import HeroScene from "@/components/hero/HeroScene";
import { home } from "@/content/site";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const poster = {
  src: "/hero/layers-poster.webp",
  width: 1800,
  height: 1500,
  alt: "Five sheets standing in steel clips on a dark slab. The back sheet is a finished web page; each glass sheet in front shows one layer of how it was made: a column grid, spacing measurements, keyboard focus rings and print marks.",
};

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title reveal" style={step(0)}>
            {home.headline}
          </h1>
          <p className="hero__lede reveal" style={step(1)}>
            {home.lede}
          </p>
          <div className="hero__actions reveal" style={step(2)}>
            <Link href="/contact" className="btn btn--accent">
              Start a project
            </Link>
            <BookingLink className="btn btn--outline">Book a 30-minute call</BookingLink>
          </div>
        </div>

        <div className="hero__stage reveal" style={step(1)}>
          <HeroScene poster={poster} />
        </div>
      </div>
    </section>
  );
}
