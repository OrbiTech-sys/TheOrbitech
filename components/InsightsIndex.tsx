"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** What a card needs, so the browser never receives article bodies. */
export interface InsightCardData {
  slug: string;
  title: string;
  category: string;
  summary: string;
  draft: boolean;
  published: string | null;
  readingMinutes: number | null;
}

/** The article list with category filters. */
export default function InsightsIndex({ items, categories }: { items: InsightCardData[]; categories: readonly string[] }) {
  const [filter, setFilter] = useState<string>("all");
  const count = (category: string) => items.filter((i) => i.category === category).length;
  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <div className="filter" role="group" aria-label="Filter articles by category">
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All
          <span className="chip__count">{items.length}</span>
        </button>
        {categories
          .filter((c) => count(c) > 0)
          .map((category) => (
            <button key={category} type="button" className="chip" aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {category}
              <span className="chip__count">{count(category)}</span>
            </button>
          ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "article" : "articles"}
      </p>

      <div key={filter} className="grid grid--3 filter-grid">
        {visible.map((item) => (
          <article key={item.slug} className="card card--link">
            <div className="badge-row">
              <span className="badge badge--accent">{item.category}</span>
              {item.draft && <span className="badge badge--draft">Draft</span>}
            </div>
            <h3 className="card__title">
              <Link href={`/insights/${item.slug}`} className="card__stretch">
                {item.title}
              </Link>
            </h3>
            <p className="card__text">{item.summary}</p>
            <span className="card__foot link-arrow">
              {item.draft ? "See the planned outline" : "Read article"} <ArrowRight size={16} aria-hidden="true" />
            </span>
          </article>
        ))}
      </div>
    </>
  );
}
