import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import type { CoreCategory } from "@/content/offerings";

/** One of the four core service categories. The whole card links to the service page. */
export default function ServiceCard({ category }: { category: CoreCategory }) {
  return (
    <article className="card card--link reveal">
      <span className="icon-box">
        <Icon name={category.icon} />
      </span>
      <h3 className="card__title">
        <Link href={`/services/${category.slug}`} className="card__stretch">
          {category.title}
        </Link>
      </h3>
      <p className="card__text">{category.summary}</p>
      <ul className="mini-list">
        {category.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span className="card__foot link-arrow">
        Explore service <ArrowRight size={16} aria-hidden="true" />
      </span>
    </article>
  );
}
