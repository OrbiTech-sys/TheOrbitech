import SceneCanvas from "@/components/scenes/SceneCanvas";
import { process } from "@/content/site";

/** The one dark section: how a project runs. The steps are genuinely sequential, so they are numbered. */
export default function ProcessSection() {
  return (
    <section className="section section--night" aria-labelledby="process-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="process-title" className="h2">
            How a project runs
          </h2>
          <p className="split__text">Four steps, in this order, on every engagement.</p>
          <SceneCanvas scene="orbit" />
        </div>

        <ol className="steps">
          {process.map((step) => (
            <li key={step.title} className="step">
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
