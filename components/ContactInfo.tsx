import { Globe, Mail, MapPin, Share2 } from "lucide-react";
import SocialIcon from "@/components/SocialIcon";
import { nextSteps, privacy, site } from "@/content/site";

/** The left column of the contact page: verified details, remote working, and what happens next. */
export default function ContactInfo() {
  const email = site.email ?? privacy.contactEmail;
  return (
    <div className="contact-info">
      <dl className="contact-info__details">
        {email && (
          <div>
            <span className="contact-info__icon" aria-hidden="true">
              <Mail size={18} strokeWidth={1.75} />
            </span>
            <dt>Email</dt>
            <dd>
              <a className="text-link" href={`mailto:${email}`}>
                {email}
              </a>
            </dd>
          </div>
        )}
        {site.location && (
          <div>
            <span className="contact-info__icon" aria-hidden="true">
              <MapPin size={18} strokeWidth={1.75} />
            </span>
            <dt>Based in</dt>
            <dd>{site.location}</dd>
          </div>
        )}
        <div>
          <span className="contact-info__icon" aria-hidden="true">
              <Globe size={18} strokeWidth={1.75} />
            </span>
            <dt>Working remotely</dt>
          <dd>We collaborate with businesses {site.areaServed.toLowerCase()}, by email and video call.</dd>
        </div>
        {site.social.length > 0 && (
          <div>
            <span className="contact-info__icon" aria-hidden="true">
              <Share2 size={18} strokeWidth={1.75} />
            </span>
            <dt>Find us on</dt>
            <dd>
              <ul className="contact-info__social">
                {site.social.map((profile) => (
                  <li key={profile.id}>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer me" aria-label={`${site.name} on ${profile.label}`}>
                      <SocialIcon id={profile.id} />
                      <span>{profile.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>

      {site.booking.url && (
        <div className="contact-info__book">
          <h2>Prefer to talk?</h2>
          <p className="card__text">Thirty minutes to talk through the project. No preparation needed.</p>
          <a href={site.booking.url} className="btn btn--secondary" target="_blank" rel="noopener noreferrer">
            Book a 30-minute call
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      <div className="contact-info__next">
        <h2>What happens next</h2>
        <ol className="steps">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
