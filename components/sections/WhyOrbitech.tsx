import SectionHeading from "@/components/ui/SectionHeading";
import { home } from "@/content/site";

export default function WhyOrbitech() {
  return (
    <section className="section section--alt" aria-labelledby="why-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="Why The OrbiTech Solutions"
          title="Engineering that starts with your business, not our toolbox"
          id="why-title"
        />
        <div className="grid grid--4">
          {home.whyOrbitech.map((point, index) => (
            <article key={point.title} className="card reveal">
              <span className="why__index">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="card__title">{point.title}</h3>
              <p className="card__text">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
