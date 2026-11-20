import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { meta, privacy, site, pageImages } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.terms;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Terms", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.terms, path: page.path, noindex: !page.indexable });

/**
 * Terms for using this website, written only from facts the site already states. Terms for project work are
 * not set here: the site says they are agreed in a written proposal. Have this reviewed before relying on it.
 */
export default function TermsPage() {
  const owner = site.legalName ?? site.name;
  const contact = privacy.contactEmail ?? site.email;

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path: page.path,
            name: meta.terms.title,
            description: meta.terms.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
        ]}
      />

      <PageIntro image={pageImages.legal}
        crumbs={crumbs}
        eyebrow="Legal"
        title="Terms of use for this website"
        lede="These terms cover using this website. Terms for project work are agreed separately, in writing."
      />

      <section className="section section--tight legal" aria-label="Terms of use">
        <div className="wrap wrap--narrow">
          <div className="prose">
            <h2>Who runs this website</h2>
            <p>
              This website is run by {owner}
              {site.location ? `, ${site.location}` : null}.
              {contact && (
                <>
                  {" "}
                  Questions about these terms can be sent to <a href={`mailto:${contact}`}>{contact}</a>.
                </>
              )}
            </p>

            <h2>Using the website</h2>
            <p>
              You may browse this website and use its contact form for genuine project enquiries. Please do not misuse it: do not try
              to disrupt it, to gain access to parts of it you are not meant to reach, or to submit spam or automated requests.
            </p>

            <h2>Demos and examples</h2>
            <p>
              The demos, prototypes and concepts shown here are examples of our work. They are provided as they are, for demonstration,
              and are not client work. Names, prices, reviews and figures shown in a demo are illustrative unless the demo says
              otherwise. Some demos open only after you confirm an email address, as described in our{" "}
              <Link href="/privacy">privacy policy</Link>.
            </p>

            <h2>Project work</h2>
            <p>
              These terms do not set the terms of any project. If we work together, scope, milestones, prices and ownership are
              agreed in a written proposal before work begins.
            </p>

            <h2>Content on this website</h2>
            <p>
              The text, design and code of this website belong to {owner}, and the screenshots show our own demonstration work. You
              may link to this website. Please ask before copying or republishing its content.
            </p>

            <h2>Links to other sites</h2>
            <p>
              Some pages link to other websites, such as the live demos and our social profiles. We do not control those sites and
              are not responsible for their content or how they handle your information.
            </p>

            <h2>No guarantee</h2>
            <p>
              We take care to keep this website accurate and available, but we do not promise that it is always up to date, complete
              or free of interruption. Information here is general and is not professional advice for your situation.
            </p>

            <h2>Changes</h2>
            <p>If we change these terms, we change this page first.</p>
          </div>
        </div>
      </section>
    </>
  );
}
