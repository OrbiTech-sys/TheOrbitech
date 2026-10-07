"use client";

import { useRef, useState } from "react";
import BookingLink from "@/components/BookingLink";
import ContactForm, { type ContactPrefill } from "@/components/ContactForm";
import { Pending } from "@/components/Pending";
import ProjectEstimator, { type EstimateSummary } from "@/components/ProjectEstimator";
import { nextSteps, site } from "@/content/site";

/** The whole contact page body: details, booking, the form, and an optional estimator. */
export default function ContactSection() {
  const [prefill, setPrefill] = useState<ContactPrefill | undefined>();
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  const applyEstimate = (summary: EstimateSummary) => {
    setPrefill({
      key: `${Date.now()}`,
      projectType: summary.projectType,
      estimate: summary.estimateRange,
      message: `Features from the estimator:\n- ${summary.features.join("\n- ")}\n\nPace: ${summary.timeline}\n\nAbout the project:\n`,
    });
    if (disclosureRef.current) disclosureRef.current.open = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact-form")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("contact-name")?.focus({ preventScroll: true }), reduce ? 0 : 500);
  };

  return (
    <section className="section section--tight" aria-label="Contact">
      <div className="wrap contact">
        <div className="contact__side">
          <dl className="contact__details">
            <div>
              <dt>Email</dt>
              <dd>
                {site.email ? (
                  <a href={`mailto:${site.email}`} className="ulink">
                    {site.email}
                  </a>
                ) : (
                  <Pending>Email address</Pending>
                )}
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{site.location ?? <Pending>City, country</Pending>}</dd>
            </div>
          </dl>

          <div id="book" className="book">
            <h2 className="h3">Prefer to talk?</h2>
            {site.booking.url && site.booking.embed ? (
              <iframe
                className="book__embed"
                src={site.booking.url}
                title="Book a 30-minute call"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <>
                <p>Thirty minutes to talk through the project. No preparation needed.</p>
                {site.booking.url ? (
                  <BookingLink className="btn btn--ink">Book a 30-minute call</BookingLink>
                ) : (
                  <p>
                    <Pending>Booking link (Cal.com or Calendly)</Pending>
                  </p>
                )}
              </>
            )}
          </div>

          <div className="next">
            <h2 className="h3">What happens next</h2>
            <ol className="next__list">
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div id="contact-form" className="contact__form">
          <h2 className="h3">Tell us about the project</h2>
          <ContactForm prefill={prefill} />
        </div>
      </div>

      <div className="wrap">
        <details ref={disclosureRef} className="disclosure">
          <summary>
            <span>Not sure about budget? Get a rough range first</span>
          </summary>
          <ProjectEstimator onApply={applyEstimate} />
        </details>
      </div>
    </section>
  );
}
