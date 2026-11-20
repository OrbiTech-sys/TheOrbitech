import type { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/schema";

/** Opening block of an inner page: breadcrumbs, the one H1, and a short paragraph. */
export default function PageIntro({
  title,
  lede,
  crumbs,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="wrap page-intro">
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <h1 className="page-intro__title">{title}</h1>
      {lede && <p className="page-intro__lede">{lede}</p>}
      {children}
    </header>
  );
}
