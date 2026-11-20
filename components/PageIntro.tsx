import Image from "next/image";
import type { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Img } from "@/content/site";
import type { Crumb } from "@/lib/schema";

/**
 * Opening block of an inner page: breadcrumbs, an eyebrow, the one H1 and a short paragraph,
 * set in the violet tab panel. An optional picture sits on the right of the panel.
 */
export default function PageIntro({
  title,
  lede,
  crumbs,
  eyebrow,
  image,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  eyebrow?: string;
  image?: Img | null;
  children?: ReactNode;
}) {
  return (
    <header className={image ? "page-hero page-hero--media" : "page-hero"}>
      <div className="wrap">
        <div className="page-hero__copy">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="page-hero__title">{title}</h1>
          {lede && <p className="page-hero__lede">{lede}</p>}
          {children}
        </div>
        {image && (
          <div className="page-hero__media">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1000px) 40vw, 100vw"
              priority
            />
          </div>
        )}
      </div>
    </header>
  );
}
