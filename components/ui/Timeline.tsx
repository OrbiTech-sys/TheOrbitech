/** Ordered steps: a horizontal line on desktop, a vertical one on phones. The numbers come from CSS counters. */
export default function Timeline({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="timeline">
      {steps.map((step) => (
        <li key={step.title} className="timeline__step reveal">
          <h3 className="timeline__title">{step.title}</h3>
          <p className="timeline__text">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
