import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/ui/SectionHeading";
import { getInsight, insights, isPublishedInsight } from "@/content/insights";
import { site } from "@/content/site";
import { formatDate } from "@/lib/pages";
import { articleNode, breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

// Pages for every known slug are built ahead of time. They may block on a client navigation.
export const instant = false;

export function generateStaticParams() {
  return insights.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return pageMetadata({
    title: `${article.seoTitle} | ${site.name}`,
    description: article.seoDescription,
    path: `/insights/${article.slug}`,
    // A draft is not an article yet: keep it out of search results.
    noindex: !isPublishedInsight(article),
  });
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const published = isPublishedInsight(article);
  const path = `/insights/${article.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: article.title, path },
  ];
  const related = insights.filter((a) => a.slug !== article.slug).sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 3);

  return (
    <article>
      <JsonLd
        nodes={[
          webPageNode({
            path,
            name: article.seoTitle,
            description: article.seoDescription,
            dateModified: article.published ?? site.contentUpdated,
            breadcrumbs: crumbs,
            ...(published ? { mainEntity: { "@id": `${absoluteUrl(path)}#article` } } : {}),
          }),
          breadcrumbNode(path, crumbs),
          ...(published ? [articleNode(article)] : []),
        ]}
      />

      <PageIntro crumbs={crumbs} eyebrow={article.category} title={article.title} lede={article.summary}>
        <div className="badge-row">
          {published ? (
            <>
              {article.published && <time className="badge" dateTime={article.published}>{formatDate(article.published)}</time>}
              {article.readingMinutes && <span className="badge">{article.readingMinutes} min read</span>}
            </>
          ) : (
            <span className="badge badge--draft">Draft: not published</span>
          )}
        </div>
      </PageIntro>

      {published ? (
        <section className="section section--tight">
          <div className="wrap wrap--narrow">
            <div className="prose">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
            {article.author && <p className="byline">By {article.author}</p>}
          </div>
        </section>
      ) : (
        <section className="section section--tight" aria-labelledby="outline-title">
          <div className="wrap wrap--narrow">
            <div className="notice notice--draft">
              <p className="notice__title">This article is a draft.</p>
              <p>It is a planned topic, not yet written or published. This page shows what it will cover.</p>
            </div>
            <SectionHeading eyebrow="Planned outline" title="What this article will cover" id="outline-title" />
            <ol className="outline">
              {article.outline.map((heading) => (
                <li key={heading}>{heading}</li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section section--alt" aria-labelledby="related-title">
        <div className="wrap">
          <SectionHeading eyebrow="Related" title="More from Insights" id="related-title" />
          <div className="grid grid--3">
            {related.map((item) => (
              <article key={item.slug} className="card card--link">
                <div className="badge-row">
                  <span className="badge badge--accent">{item.category}</span>
                  {!isPublishedInsight(item) && <span className="badge badge--draft">Draft</span>}
                </div>
                <h3 className="card__title">
                  <Link href={`/insights/${item.slug}`} className="card__stretch">
                    {item.title}
                  </Link>
                </h3>
                <span className="card__foot link-arrow">
                  {isPublishedInsight(item) ? "Read article" : "See the outline"} <ArrowRight size={16} aria-hidden="true" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </article>
  );
}
