import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import type { IndustryPage } from "@/content/industries";

export default function IndustryCard({ industry }: { industry: Pick<IndustryPage, "slug" | "name" | "icon" | "summary"> }) {
  return (
    <article className="card card--link reveal">
      <span className="icon-box">
        <Icon name={industry.icon} />
      </span>
      <h3 className="card__title">
        <Link href={`/industries/${industry.slug}`} className="card__stretch">
          {industry.name}
        </Link>
      </h3>
      <p className="card__text">{industry.summary}</p>
      <span className="card__foot link-arrow">
        See how we help <ArrowRight size={16} aria-hidden="true" />
      </span>
    </article>
  );
}
