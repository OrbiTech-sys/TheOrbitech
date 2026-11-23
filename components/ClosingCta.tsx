import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { home, privacy, site } from "@/content/site";

/** The closing call to action, used at the bottom of the home page and every inner page. */
export default function ClosingCta({
  heading = home.closing.heading,
  text = home.closing.text,
  cta = home.closing.cta,
}: {
  heading?: string;
  text?: string;
  cta?: string;
}) {
  const email = site.email ?? privacy.contactEmail;
  return (
    <section className="section section--tight" aria-labelledby="close-title">
      <div className="wrap">
        <div className="cta-band reveal">
          <h2 id="close-title">{heading}</h2>
          <p>{text}</p>
          <div className="cta-band__actions">
            <Link href="/contact" className="btn btn--primary btn--lg">
              {cta}
            </Link>
            <BookingLink className="btn btn--secondary btn--lg">Book a 30-minute call</BookingLink>
          </div>
          {email && (
            <p className="cta-band__mail">
              Or write to{" "}
              <a className="text-link" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
