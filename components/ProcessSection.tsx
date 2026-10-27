import { process as steps } from "@/content/site";

/** How a project runs: the same five steps as the home page. They are sequential, so they are numbered. */
export default function ProcessSection() {
  return (
    <section id="process" className="wrap" aria-labelledby="process-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">Delivery approach</div>
          <h2 id="process-title">How a project runs, from discovery to launch</h2>
        </div>
        <p>Five steps, in this order. Scope decides how long each one takes.</p>
      </div>
      <ol className="process">
        {steps.map((step, index) => (
          <li key={step.title} className="step">
            <span>STEP {String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
