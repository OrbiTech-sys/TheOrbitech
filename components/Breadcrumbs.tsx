import Link from "next/link";
import type { Crumb } from "@/lib/schema";

/** A visible trail that matches the BreadcrumbList in the page's structured data. */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path}>
              {last ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path}>{crumb.name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
