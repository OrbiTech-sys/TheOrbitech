import type { CSSProperties, ReactNode } from "react";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** Opening block of an inner page: a large heading and one short paragraph. */
export default function PageIntro({
  title,
  lede,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="wrap page-intro">
      <h1 className="page-intro__title reveal" style={step(0)}>
        {title}
      </h1>
      {lede && (
        <p className="page-intro__lede reveal" style={step(1)}>
          {lede}
        </p>
      )}
      {children}
    </header>
  );
}
