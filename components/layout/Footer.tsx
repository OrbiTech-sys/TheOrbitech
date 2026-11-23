import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import LogoMark from "@/components/ui/LogoMark";
import { industryPages } from "@/content/industries";
import { servicePages } from "@/content/offerings";
import { privacy, site } from "@/content/site";

const companyLinks = [
  { label: "Studio", href: "/studio" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/** Where the studio is based and where it works, from the details the owner supplied. */
const placeLine = [
  site.location ? `Based in ${site.location}.` : null,
  site.areaServed ? `Works remotely, ${site.areaServed.toLowerCase()}.` : null,
]
  .filter(Boolean)
  .join(" ");

export default function Footer() {
  const email = privacy.contactEmail ?? site.email;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="tab-panel site-footer__panel">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <Link className="brand" href="/" aria-label={`${site.name} home`}>
              <LogoMark />
              <span>{site.name}</span>
            </Link>
            <p>{site.description}</p>
            {placeLine && <p>{placeLine}</p>}
            {email && (
              <p>
                <a className="text-link" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            )}
            {site.social.length > 0 && (
              <ul className="social" aria-label="Social profiles">
                {site.social.map((profile) => (
                  <li key={profile.id}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`${site.name} on ${profile.label}`}
                    >
                      <SocialIcon id={profile.id} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className="site-footer__heading">
              Services
            </h2>
            <ul className="site-footer__list">
              {servicePages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/services/${page.slug}`}>{page.navLabel}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-industries">
            <h2 id="footer-industries" className="site-footer__heading">
              Industries
            </h2>
            <ul className="site-footer__list">
              {industryPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/industries/${page.slug}`}>{page.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="site-footer__heading">
              Company
            </h2>
            <ul className="site-footer__list">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        </div>

        <div className="site-footer__bar">
          <span>
            © {site.copyrightYear} {site.name}. Capability examples may include demos, POCs and MVPs.
          </span>
          <ul>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms and Conditions</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
