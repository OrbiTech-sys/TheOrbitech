import type { ReactNode } from "react";

/**
 * Marks content the site owner still has to supply.
 * Renders as a bracketed, dashed-underlined label, e.g. [Project name].
 */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="ph" data-placeholder="">
      [{children}]
    </span>
  );
}

/** Hatched stand-in for a missing photo or screenshot. */
export function PendingMedia({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="ph-media" role="img" aria-label={`Placeholder: ${label}`} data-placeholder="">
      <span className="ph-media__label">[{label}]</span>
      {hint && <span className="ph-media__hint">{hint}</span>}
    </div>
  );
}
