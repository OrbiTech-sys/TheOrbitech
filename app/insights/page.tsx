import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import InsightsIndex, { type InsightCardData } from "@/components/InsightsIndex";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import { insightCategories, insights, isPublishedInsight } from "@/content/insights";
import { meta } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, insightListNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

const page = staticPages.insights;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Insights", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.insights, path: page.path });

export default function InsightsPage() {
  const published = insights.filter(isPublishedInsight);
  const cards: InsightCardData[] = insights.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    summary: a.summary,
    draft: !isPublishedInsight(a),
    published: a.published,
    readingMinutes: a.readingMinutes,
  }));
  // The featured slot goes to the first published article. Until there is one, it says so honestly.
  const featured = published[0] ?? null;

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "CollectionPage",
            path: page.path,
            name: meta.insights.title,
            description: meta.insights.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
            mainEntity: { "@id": `${absoluteUrl(page.path)}#articles` },
          }),
          breadcrumbNode(page.path, crumbs),
          insightListNode(published.map((a) => ({ slug: a.slug, title: a.title }))),
        ]}
      />

      <PageIntro
        crumbs={crumbs}
        eyebrow="Insights"
        title="Insights on AI engineering, automation and software"
        lede="Plain-language articles on how AI agents, RAG, voice AI, automation and SaaS products work in a real business."
      >
        <LastUpdated date={page.updated} />
      </PageIntro>

      <section className="section section--tight" aria-labelledby="featured-title">
        <div className="wrap">
          <div className="featured card reveal">
            <span className="eyebrow">Featured</span>
            {featured ? (
              <>
                <h2 id="featured-title">{featured.title}</h2>
                <p className="card__text">{featured.summary}</p>
                <Link href={`/insights/${featured.slug}`} className="link-arrow">
                  Read article <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <h2 id="featured-title">Our first articles are in progress</h2>
                <p className="card__text">
                  Nothing is published yet. The topics below are planned and marked as drafts, and each one shows its outline. We will
                  publish an article only when it is written and reviewed.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label="Articles">
        <div className="wrap">
          <InsightsIndex items={cards} categories={insightCategories} />
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
