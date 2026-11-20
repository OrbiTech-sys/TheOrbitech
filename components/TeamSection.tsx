import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { team } from "@/content/site";

/**
 * The people doing the work. Only people with a real name, role and bio are
 * shown; with nobody listed, the whole section is left out.
 */
export default function TeamSection() {
  const people = team.filter((member) => member.name && member.role && member.bio);
  if (people.length === 0) return null;

  return (
    <section className="wrap" aria-labelledby="team-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">Team</div>
          <h2 id="team-title">The people doing the work</h2>
        </div>
      </div>

      <ul className="team-grid">
        {people.map((member) => (
          <li key={member.slug} className="member">
            {member.photo && (
              <figure className="member__photo">
                <Image
                  src={member.photo.src}
                  alt={`Portrait of ${member.name}`}
                  width={member.photo.width}
                  height={member.photo.height}
                  sizes="(min-width: 60rem) 30vw, (min-width: 40rem) 50vw, 100vw"
                />
              </figure>
            )}
            <h3 className="member__name">{member.name}</h3>
            <p className="member__role">{member.role}</p>
            {member.credentials.length > 0 && (
              <ul className="member__creds" aria-label="Credentials">
                {member.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            <p className="member__bio">{member.bio}</p>
            {member.links.length > 0 && (
              <ul className="member__links">
                {member.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
