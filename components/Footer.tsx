import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { Pending } from "@/components/Pending";
import { nav, projects, site } from "@/content/site";
import { isRealProject, projectHref } from "@/lib/projects";
import BookingLink from "@/components/BookingLink";

export default function Footer() {
  const caseStudies = projects.filter(isRealProject);

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__mast">
          <Link href="/" className="wordmark wordmark--large" aria-label="OrbiTech, home">
            <Wordmark />
          </Link>
          <p className="footer__line">{site.description}</p>
        </div>

        <nav className="footer__col" aria-label="Pages">
          <h2 className="footer__head">Pages</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ulink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="ulink">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        {caseStudies.length > 0 && (
          <nav className="footer__col" aria-label="Case studies">
            <h2 className="footer__head">Case studies</h2>
            <ul>
              {caseStudies.map((project) => (
                <li key={project.slug}>
                  <Link href={projectHref(project)} className="ulink">
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="footer__col">
          <h2 className="footer__head">Contact</h2>
          <ul>
            <li>
              {site.email ? (
                <a href={`mailto:${site.email}`} className="ulink">
                  {site.email}
                </a>
              ) : (
                <Pending>Email address</Pending>
              )}
            </li>
            <li>{site.location ?? <Pending>City, country</Pending>}</li>
            <li>
              <BookingLink className="ulink">Book a 30-minute call</BookingLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__end">
        <div className="footer__legal">
          <p>
            © {site.copyrightYear} {site.legalName ?? site.name}
          </p>
          <Link href="#top" className="ulink">
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
