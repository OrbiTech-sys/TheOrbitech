import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import ProcessSection from "@/components/ProcessSection";
import TeamSection from "@/components/TeamSection";
import TechStackSection from "@/components/TechStackSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { meta, site, studio, pageImages } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.studio;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Studio", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.studio, path: page.path, noindex: !page.indexable });

export default function StudioPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "AboutPage",
            path: page.path,
            name: meta.studio.title,
            description: meta.studio.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
        ]}
      />

      <PageIntro image={pageImages.studio}
        crumbs={crumbs}
        eyebrow="Studio"
        title="Engineering With Purpose. Building With Intelligence."
        lede={site.description}
      />

      <section className="section section--tight" aria-labelledby="about-title">
        <div className="wrap split">
          <SectionHeading eyebrow="Who we are" title={`About ${site.name}`} id="about-title" />
          <div className="prose">
            {studio.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="purpose-title">
        <div className="wrap">
          <SectionHeading eyebrow="Mission and vision" title="Why we exist, and where we are headed" id="purpose-title" />
          <div className="grid grid--2">
            <article className="card reveal">
              <span className="eyebrow">Mission</span>
              <p className="statement">{studio.mission}</p>
            </article>
            <article className="card reveal">
              <span className="eyebrow">Vision</span>
              <p className="statement">{studio.vision}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="philosophy-title">
        <div className="wrap">
          <SectionHeading eyebrow="Engineering philosophy" title="How we think about the work" id="philosophy-title" />
          <div className="grid grid--4">
            {studio.philosophy.map((item) => (
              <article key={item.title} className="card reveal">
                <h3 className="card__title">{item.title}</h3>
                <p className="card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection eyebrow="Development methodology" title="How a project runs" />

      <TechStackSection />

      <section className="section section--alt" aria-labelledby="choose-title">
        <div className="wrap">
          <SectionHeading eyebrow="Why clients choose us" title="What you can rely on" id="choose-title" />
          <div className="grid grid--3 differentiators">
            {studio.differentiators.map((item) => (
              <article key={item.title} className="card reveal">
                <h3 className="card__title">{item.title}</h3>
                <p className="card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />
      <ClosingCta />
    </>
  );
}
