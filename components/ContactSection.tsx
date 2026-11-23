"use client";

import { useEffect, useRef, useState } from "react";
import ContactForm, { type ContactPrefill } from "@/components/ContactForm";
import ProjectEstimator, { type EstimateSummary } from "@/components/ProjectEstimator";
import { estimator } from "@/content/site";

/** The right column of the contact page: the project inquiry form, and the estimator when the owner has confirmed its figures. */
export default function ContactSection() {
  const [prefill, setPrefill] = useState<ContactPrefill | undefined>();
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  // A problem typed into the home page box arrives as ?brief= and becomes the project description.
  useEffect(() => {
    const brief = new URLSearchParams(window.location.search).get("brief")?.trim();
    if (!brief) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once after hydration; the server render has no query
    setPrefill({ key: "brief", message: brief.slice(0, 400) });
  }, []);

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
    <div id="contact-form" className="contact-card">
      <h2>Tell us about the project</h2>
      <ContactForm prefill={prefill} />

      {estimator.confirmed && (
        <details ref={disclosureRef} className="disclosure">
          <summary>Not sure about budget? Get a rough range first</summary>
          <ProjectEstimator onApply={applyEstimate} />
        </details>
      )}
    </div>
  );
}
