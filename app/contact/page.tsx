import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { meta, site } from "@/content/site";
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
      <PageIntro
        crumbs={crumbs}
        title={`Contact ${site.name} to start a project`}
        lede="Tell us what you want to build. A person reads every message and replies by email."
      />
      <ContactSection />
    </>
  );
}
