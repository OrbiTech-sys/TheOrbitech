"use client";

import { useState } from "react";
import { estimator } from "@/content/site";

export interface EstimateSummary {
  projectType: string;
  timeline: string;
  features: string[];
  estimateRange: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** A rough range for planning. Not a quote, and the figures in content/site.ts are placeholders to confirm. */
export default function ProjectEstimator({ onApply }: { onApply: (summary: EstimateSummary) => void }) {
  const [projectType, setProjectType] = useState("saas");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["auth", "dashboard"]);
  const [timeline, setTimeline] = useState("standard");

  const toggleFeature = (id: string) =>
    setSelectedFeatures((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));

  const currentType = estimator.projectTypes.find((p) => p.id === projectType) ?? estimator.projectTypes[1];
  const currentTimeline = estimator.timelines.find((t) => t.id === timeline) ?? estimator.timelines[1];
  const chosen = estimator.features.filter((f) => selectedFeatures.includes(f.id));

  const featuresTotal = chosen.reduce((sum, f) => sum + f.price, 0);
  const featuresWeeks = chosen.reduce((sum, f) => sum + f.weeks, 0);
  const rawTotal = (currentType.basePrice + featuresTotal) * currentTimeline.multiplier;
  const weeks = Math.max(2, Math.round((currentType.baseWeeks + featuresWeeks) * currentTimeline.timeFactor));
  const low = Math.round((rawTotal * 0.95) / 100) * 100;
  const high = Math.round((rawTotal * 1.15) / 100) * 100;
  const estimateRange = `${currency.format(low)}–${currency.format(high)}`;

  return (
    <div className="estimator">
      <div className="estimator__controls">
        <fieldset className="est-group">
          <legend>What are you building?</legend>
          <div className="option-grid">
            {estimator.projectTypes.map((type) => (
              <label key={type.id} className="option">
                <input
                  type="radio"
                  name="est-type"
                  value={type.id}
                  checked={projectType === type.id}
                  onChange={() => setProjectType(type.id)}
                />
                <span>
                  <span className="option__title">{type.name}</span>
                  <span className="option__desc">{type.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="est-group">
          <legend>Which features do you need?</legend>
          <div className="option-grid">
            {estimator.features.map((feature) => (
              <label key={feature.id} className="option option--compact">
                <input type="checkbox" checked={selectedFeatures.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
                <span className="option__title">{feature.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="est-group">
          <legend>Pace</legend>
          <div className="segmented">
            {estimator.timelines.map((option) => (
              <label key={option.id} className="segmented__item">
                <input
                  type="radio"
                  name="est-pace"
                  value={option.id}
                  checked={timeline === option.id}
                  onChange={() => setTimeline(option.id)}
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="est-result" aria-live="polite">
        <p className="est-result__label">Indicative range</p>
        <p className="est-result__range">{estimateRange}</p>
        <dl className="est-result__facts">
          <div>
            <dt>Timeline</dt>
            <dd>About {weeks} weeks</dd>
          </div>
          <div>
            <dt>Covers</dt>
            <dd>Scoping, design, build, testing and handover</dd>
          </div>
        </dl>
        <button
          type="button"
          className="btn btn--ink est-result__cta"
          onClick={() =>
            onApply({
              projectType: currentType.enquiry,
              timeline: currentTimeline.name,
              features: chosen.map((f) => f.name),
              estimateRange,
            })
          }
        >
          Use this estimate in the form
        </button>
        <p className="est-result__note">Not a quote. Nothing is agreed until you approve a written proposal.</p>
      </div>
    </div>
  );
}
