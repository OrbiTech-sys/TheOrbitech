import Image from "next/image";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Demo } from "@/content/site";
import ProjectFrame from "@/components/ProjectFrame";
import { demoOpenHref } from "@/lib/demos";

/**
 * One live sample. The button goes to /demo/<id>/open, which sends the visitor to
 * the email check unless they have already passed it. The demo's own address is never here.
 */
export default function DemoCard({
  demo,
  priority = false,
  phone = false,
}: {
  demo: Demo;
  priority?: boolean;
  /** Adds the phone screenshot beside the desktop one. For a demo shown on its own. */
  phone?: boolean;
}) {
  return (
    <li className="demo-card">
      <div className={phone ? "demo-card__media demo-card__media--phone" : "demo-card__media"}>
        <ProjectFrame
          image={demo.cover}
          sizes={phone ? "(min-width: 48rem) 56vw, 100vw" : "(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 100vw"}
          priority={priority}
        />
        {phone && (
          <div className="demo-card__phone">
            <Image src={demo.mobile.src} alt={demo.mobile.alt} width={demo.mobile.width} height={demo.mobile.height} sizes="12rem" />
          </div>
        )}
      </div>
      <div className="demo-card__body">
        <h3 className="demo-card__name">{demo.name}</h3>
        <p className="demo-card__place">{demo.place}</p>
        <p className="demo-card__summary">{demo.summary}</p>
        <ul className="demo-card__list">
          {demo.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {/* A plain link on purpose: next/link would prefetch the redirect. */}
        <a href={demoOpenHref(demo.id)} className="btn btn-primary demo-card__open" target="_blank" rel="noopener noreferrer">
          Open live demo
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only"> of {demo.name} (opens in a new tab after an email check)</span>
        </a>
        <p className="demo-card__note">
          <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
          Email check, about 20 seconds
        </p>
      </div>
    </li>
  );
}
