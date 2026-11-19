import type { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/schema";

/** Opening block of an inner page: breadcrumbs, an eyebrow, the one H1 and a short paragraph. */
export default function PageIntro({
  title,
  lede,
  crumbs,
  eyebrow,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="wrap">
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="page-hero__title">{title}</h1>
        {lede && <p className="page-hero__lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
