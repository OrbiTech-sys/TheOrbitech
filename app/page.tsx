import ClosingCta from "@/components/ClosingCta";
import Hero from "@/components/Hero";
import ProcessSection from "@/components/ProcessSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { home } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section section--statement" aria-label="What we believe">
        <div className="wrap statement">
          <p className="statement__text">{home.statement}</p>
        </div>
      </section>

      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TeamSection variant="preview" />
      <TestimonialsSection />
      <ClosingCta />
    </>
  );
}
