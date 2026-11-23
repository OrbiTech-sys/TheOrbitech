import Link from "next/link";
import { Sparkle } from "lucide-react";
import { coreCategories } from "@/content/offerings";
import { home } from "@/content/site";

/**
 * A violet band where the four capabilities slide past in bold uppercase, with a sparkle
 * between each. The first copy is the real list of links; the second only fills the loop
 * and is hidden from screen readers and keyboard. With reduced motion the band stands still.
 * Capabilities only: no figures and no client logos.
 */
export default function CapabilityStrip() {
  const items = home.capabilities.map((label, index) => ({
    label,
    href: coreCategories[index] ? `/services/${coreCategories[index].slug}` : "/services",
  }));

  const row = (copy: number) => (
    <ul className="marquee__row" aria-hidden={copy > 0 ? true : undefined} key={copy}>
      {items.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className="marquee__item" tabIndex={copy > 0 ? -1 : undefined}>
            {item.label}
          </Link>
          <Sparkle className="marquee__star" size={22} strokeWidth={1.75} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="marquee" aria-label="Capabilities">
      <div className="marquee__track">{[0, 1].map(row)}</div>
    </section>
  );
}
