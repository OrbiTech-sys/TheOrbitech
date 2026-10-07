import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { Pending } from "@/components/Pending";
import SceneCanvas from "@/components/scenes/SceneCanvas";
import { home, site } from "@/content/site";

export default function ClosingCta() {
  return (
    <section className="section section--close" aria-labelledby="close-title">
      <SceneCanvas scene="shapes" />
      <div className="wrap close">
        <h2 id="close-title" className="close__title">
          {home.closing.heading}
        </h2>
        <div className="close__side">
          <p className="close__text">{home.closing.text}</p>
          <div className="close__actions">
            <Link href="/contact" className="btn btn--kiln">
              Start a project
            </Link>
            <BookingLink className="btn btn--outline">Book a 30-minute call</BookingLink>
          </div>
          <p className="close__mail">
            Or write to{" "}
            {site.email ? (
              <a href={`mailto:${site.email}`} className="ulink">
                {site.email}
              </a>
            ) : (
              <Pending>Email address</Pending>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
