"use client";

import { useRef, useState } from "react";
import ContactForm, { type ContactPrefill } from "@/components/ContactForm";
import ProjectEstimator, { type EstimateSummary } from "@/components/ProjectEstimator";
import SocialIcon from "@/components/SocialIcon";
import { estimator, nextSteps, privacy, site } from "@/content/site";

/** The whole contact page body: details, booking (once there is one), the form, and an optional estimator. */
export default function ContactSection() {
  const [prefill, setPrefill] = useState<ContactPrefill | undefined>();
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const email = site.email ?? privacy.contactEmail;

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
    <section className="wrap contact-wrap" aria-label="Contact">
      <div className="contact">
        <div className="contact__side">
          <dl className="contact__details">
            {email && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
            )}
            {site.location && (
              <div>
                <dt>Based in</dt>
                <dd>
                  {site.location}. Works remotely, {site.areaServed.toLowerCase()}.
                </dd>
              </div>
            )}
            {site.social.length > 0 && (
              <div>
                <dt>Find us on</dt>
                <dd>
                  <ul className="contact__social">
                    {site.social.map((profile) => (
                      <li key={profile.id}>
                        <a
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer me"
                          aria-label={`${site.name} on ${profile.label}`}
                        >
                          <SocialIcon id={profile.id} />
                          <span>{profile.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {site.booking.url && (
            <div id="book" className="book">
              <h2>Prefer to talk?</h2>
              {site.booking.embed ? (
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
                  <a href={site.booking.url} className="btn" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute call
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              )}
            </div>
          )}

          <div className="next">
            <h2>What happens next</h2>
            <ol className="next__list">
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div id="contact-form" className="contact__form">
          <h2>Tell us about the project</h2>
          <ContactForm prefill={prefill} />
        </div>
      </div>

      {estimator.confirmed && (
        <details ref={disclosureRef} className="disclosure">
          <summary>
            <span>Not sure about budget? Get a rough range first</span>
          </summary>
          <ProjectEstimator onApply={applyEstimate} />
        </details>
      )}
    </section>
  );
}
