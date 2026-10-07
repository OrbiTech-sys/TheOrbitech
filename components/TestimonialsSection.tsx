import { testimonials } from "@/content/site";

/** Real testimonials only. With none provided, the whole section is left out. */
export default function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="wrap">
        <h2 id="testimonials-title" className="h2 section-head">
          What clients say
        </h2>
        <div className="quotes">
          {testimonials.map((t) => (
            <figure key={`${t.name}-${t.company}`} className="quote">
              <blockquote className="quote__text">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="quote__by">
                <span className="quote__name">{t.name}</span>
                <span>
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
