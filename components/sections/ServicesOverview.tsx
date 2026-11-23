import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { coreCategories } from "@/content/offerings";

/**
 * The four core services: a violet tab panel with the heading and intro, and dark cards
 * that sit across its lower edge. The first card is larger and lists what it includes.
 */
export default function ServicesOverview() {
  return (
    <section className="section services-pin" aria-labelledby="services-title">
      <div className="wrap">
        <span className="eyebrow">What we build</span>
        <div className="tab-panel services-pin__panel">
          <h2 id="services-title" className="services-pin__title">
            Four ways we turn complexity into working software
          </h2>
          <div className="services-pin__intro">
            <p>
              From AI agents to analytics dashboards, each service is scoped around your goals and the tools you already
              use.
            </p>
            <Link href="/services" className="pill-btn pill-btn--peach">
              Get started <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="services-pin__cards" data-theme="dark">
          {coreCategories.map((category, index) => (
            <article key={category.slug} className={index === 0 ? "pin-card pin-card--lead" : "pin-card"}>
              <span className="pin-card__icon">
                <Icon name={category.icon} />
              </span>
              <h3 className="pin-card__title">{category.title}</h3>
              {index === 0 && (
                <>
                  <p className="pin-card__text">{category.summary}</p>
                  <p className="pin-card__subhead">Including</p>
                  <ul className="pin-card__list">
                    {category.items.slice(0, 3).map((item) => (
                      <li key={item}>
                        <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Link
                href={`/services/${category.slug}`}
                className="pill-btn pill-btn--violet"
                aria-label={`Get started with ${category.title}`}
              >
                Get started <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <p className="section-more">
          <Link href="/services" className="link-arrow">
            See all six service areas <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
