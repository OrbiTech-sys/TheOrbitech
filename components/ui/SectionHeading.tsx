import type { ReactNode } from "react";

/** Eyebrow, title and lede for a section. The title is an h2 unless `as` says otherwise. */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  center = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "section-head section-head--center" : "section-head"}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag id={id}>{title}</Tag>
      {lede && <p className="section-head__lede">{lede}</p>}
    </div>
  );
}
