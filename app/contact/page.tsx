import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactBandArt from "@/components/ContactBandArt";
import ContactInfo from "@/components/ContactInfo";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { meta } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.contact;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.contact, path: page.path, noindex: !page.indexable });

export default function ContactPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "ContactPage",
            path: page.path,
            name: meta.contact.title,
            description: meta.contact.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
        ]}
      />

      <section className="contact-band" aria-labelledby="contact-title">
        <span className="contact-band__stripe contact-band__stripe--a" aria-hidden="true" />
        <span className="contact-band__stripe contact-band__stripe--b" aria-hidden="true" />
        <div className="wrap contact-band__inner">
          <Breadcrumbs crumbs={crumbs} />
          <span className="eyebrow">Contact</span>
          <h1 id="contact-title" className="contact-band__title">
            Have an Ambitious Idea? Let’s Engineer It.
          </h1>
          <p className="contact-band__lede">
            Tell us about your goals and challenges. We’ll help you identify the right technical solution.
          </p>
        </div>
        <ContactBandArt />
      </section>

      <section className="contact-body">
        <div className="wrap contact-grid">
          <div className="contact-grid__form" data-theme="dark">
            <ContactSection />
          </div>
          <div className="contact-grid__info">
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
