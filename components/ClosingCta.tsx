import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { home, privacy, site } from "@/content/site";

/** The closing call to action on inner pages. It reuses the home page's CTA panel. */
export default function ClosingCta() {
  const email = site.email ?? privacy.contactEmail;
  return (
    <section className="wrap" aria-labelledby="close-title">
      <div className="cta">
        <div>
          <h2 id="close-title">{home.closing.heading}</h2>
          <p>{home.closing.text}</p>
          {email && (
            <p className="close-mail">
              Or write to <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
        </div>
        <div className="cta-actions">
          <Link href="/contact" className="btn btn-primary">
            Start a project <span aria-hidden="true">↗</span>
          </Link>
          <BookingLink className="btn">Book a 30-minute call</BookingLink>
        </div>
      </div>
    </section>
  );
}
