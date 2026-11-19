import type { Metadata } from "next";
import AtAGlance from "@/components/AtAGlance";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import ProcessSection from "@/components/ProcessSection";
import CapabilityStrip from "@/components/sections/CapabilityStrip";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Hero from "@/components/sections/Hero";
import IndustriesGrid from "@/components/sections/IndustriesGrid";
import ServicesOverview from "@/components/sections/ServicesOverview";
import WhyOrbitech from "@/components/sections/WhyOrbitech";
import TechStackSection from "@/components/TechStackSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { meta, testimonials } from "@/content/site";
import { glanceRows } from "@/lib/glance";
import { staticPages } from "@/lib/pages";
import { webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.home;

export const metadata: Metadata = pageMetadata({ ...meta.home, path: page.path });

export default function Home() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path: page.path,
            name: meta.home.title,
            description: meta.home.description,
            dateModified: page.updated,
          }),
        ]}
      />
      <Hero />
      <CapabilityStrip />
      <ServicesOverview />
      <FeaturedProjects />
      <IndustriesGrid />
      <ProcessSection />
      <WhyOrbitech />
      {/* Approved testimonials when there are any; until then, the technology the studio genuinely uses. */}
      {testimonials.length > 0 ? <TestimonialsSection /> : <TechStackSection />}
      <AtAGlance id="glance-title" title="At a glance" rows={glanceRows} />
      <ClosingCta />
    </>
  );
}
