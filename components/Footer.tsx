import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import { nav, privacy, site } from "@/content/site";

const footerLinks = [...nav, { label: "Privacy", href: "/privacy" }];

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
    <footer className="wrap site-footer">
      <div className="footer-about">
        <strong style={{ color: "var(--text)" }}>{site.name.toUpperCase()}</strong>
        <p>{site.description}</p>
        {placeLine && <p>{placeLine}</p>}
        {email && (
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
        {site.social.length > 0 && (
          <ul className="footer-social" aria-label="Social profiles">
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

      <nav className="footer-nav" aria-label="Footer">
        <ul>
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <span className="footer-legal">
        © {site.copyrightYear} {site.name} · Capability examples may include demos, POCs, and MVPs.
      </span>
    </footer>
  );
}
