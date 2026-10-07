import Link from "next/link";
import { services } from "@/content/site";

/** Home page: the services as a ruled index beside a sticky heading. */
export default function ServicesSection() {
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="services-title" className="h2">
            What we do
          </h2>
          <p className="split__text">Six kinds of work, each with a page that says what is included and how we run it.</p>
          <Link href="/services" className="ulink">
            All services
          </Link>
        </div>

        <ul className="index">
          {services.map((service) => (
            <li key={service.id}>
              <Link href={`/services#${service.id}`} className="index__row">
                <h3 className="index__title">{service.title}</h3>
                <p className="index__text">{service.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
