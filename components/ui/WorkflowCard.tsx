import { ArrowDown } from "lucide-react";

/** An example workflow, drawn as a short chain of steps. Always labelled as an example, never as delivered work. */
export default function WorkflowCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <article className="card workflow reveal">
      <h3 className="card__title">{title}</h3>
      <ol className="workflow__steps">
        {steps.map((step, index) => (
          <li key={step}>
            <span className="workflow__step">{step}</span>
            {index < steps.length - 1 && <ArrowDown size={14} className="workflow__arrow" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </article>
  );
}
