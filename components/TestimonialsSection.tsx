import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/content/site";

/** Real, approved testimonials only. With none listed, nothing is rendered. */
export default function TestimonialsSection() {
  if (testimonials.length === 0) return null;
  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="wrap">
        <SectionHeading eyebrow="Testimonials" title="What clients say" id="testimonials-title" />
        <div className="grid grid--3">
          {testimonials.map((t) => (
            <figure key={`${t.name}-${t.company}`} className="card reveal">
              <blockquote className="card__text">“{t.quote}”</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span className="card__text">
                  {" "}
                  {t.role}, {t.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
