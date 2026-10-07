import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import PageIntro from "@/components/PageIntro";
import { Pending } from "@/components/Pending";
import TeamSection from "@/components/TeamSection";
import TechStackSection from "@/components/TechStackSection";
import { site, studio } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Studio",
  description: "Who is behind OrbiTech, how we work together, and the skills and tools we use.",
  path: "/studio",
});

export default function StudioPage() {
  return (
    <>
      <PageIntro title={`About ${site.name}`} lede={site.description} />

      <section className="section section--tight" aria-labelledby="story-title">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="story-title" className="h2">
              How it started
            </h2>
          </div>
          <div className="prose">
            {studio.story.length > 0 ? (
              studio.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>
                <Pending>The studio’s story: how and why it started, in two or three short paragraphs</Pending>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="agreements-title">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="agreements-title" className="h2">
              How we work together
            </h2>
          </div>
          <ul className="practices">
            {studio.workingAgreements.map((agreement) => (
              <li key={agreement}>{agreement}</li>
            ))}
          </ul>
        </div>
      </section>

      <TeamSection variant="full" />
      <TechStackSection />
      <ClosingCta />
    </>
  );
}
