import { home } from "@/content/site";

/** A quiet row of what the studio does. Capabilities only: no figures and no client logos. */
export default function CapabilityStrip() {
  return (
    <section className="strip" aria-label="Capabilities">
      <div className="wrap">
        <ul className="strip__list">
          {home.capabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
