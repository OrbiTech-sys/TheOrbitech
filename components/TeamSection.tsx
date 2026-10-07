import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Pending, PendingMedia } from "@/components/Pending";
import { team } from "@/content/site";

interface TeamSectionProps {
  /** "preview" for the home page, "full" for the studio page */
  variant?: "preview" | "full";
}

export default function TeamSection({ variant = "preview" }: TeamSectionProps) {
  const full = variant === "full";

  return (
    <section className="section" aria-labelledby="team-title">
      <div className="wrap">
        <div className="section-head section-head--row">
          <h2 id="team-title" className="h2">
            The people doing the work
          </h2>
          {!full && (
            <Link href="/studio" className="ulink">
              Meet the studio
            </Link>
          )}
        </div>

        <ul className="team-grid">
          {team.map((member) => (
            <li key={member.slug} className="member">
              <figure className="member__photo">
                {member.photo && member.name ? (
                  <Image
                    src={member.photo.src}
                    alt={`Portrait of ${member.name}`}
                    width={member.photo.width}
                    height={member.photo.height}
                    sizes="(min-width: 60rem) 30vw, (min-width: 40rem) 50vw, 100vw"
                  />
                ) : (
                  <PendingMedia label="Team photo" hint="Add a real photo in content/site.ts" />
                )}
              </figure>

              <h3 className="member__name">{member.name ?? <Pending>Full name</Pending>}</h3>
              <p className="member__role">{member.role ?? <Pending>Role</Pending>}</p>

              {full && (
                <>
                  {member.credentials.length > 0 ? (
                    <ul className="member__creds" aria-label="Credentials">
                      {member.credentials.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="member__creds">
                      <Pending>Credentials and experience</Pending>
                    </p>
                  )}
                  {member.bio ? <p className="member__bio">{member.bio}</p> : <p className="member__bio"><Pending>Two-sentence bio</Pending></p>}
                  {member.links.length > 0 && (
                    <ul className="member__links">
                      {member.links.map((link) => (
                        <li key={link.url}>
                          <a href={link.url} className="ulink" target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
