import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import FaqSection from "@/components/FaqSection";
import PageIntro from "@/components/PageIntro";
import ProcessSection from "@/components/ProcessSection";
import SecuritySection from "@/components/SecuritySection";
import { services } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Websites, web apps, AI automation, integrations, cloud and ongoing care: what is included, who each is for and how we work.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="What we do, and how we do it"
        lede="Six kinds of work. For each: what is included, who it suits, and how a project runs."
      />

      <section className="section section--tight" aria-label="Services">
        <div className="wrap">
          {services.map((service) => (
            <article key={service.id} id={service.id} className="service">
              <div className="split">
                <div className="split__head">
                  <h2 className="h2">{service.title}</h2>
                  <p className="split__text">{service.summary}</p>
                </div>

                <div className="service__body">
                  <div className="service__block">
                    <h3 className="h4">What’s included</h3>
                    <ul className="checks">
                      {service.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="service__pair">
                    <div className="service__block">
                      <h3 className="h4">Who it’s for</h3>
                      <p>{service.whoFor}</p>
                    </div>
                    <div className="service__block">
                      <h3 className="h4">How we work</h3>
                      <p>{service.howWeWork}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProcessSection />
      <SecuritySection />
      <FaqSection />
      <ClosingCta />
    </>
  );
}
