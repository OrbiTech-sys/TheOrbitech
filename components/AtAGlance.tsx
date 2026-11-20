import { FolderKanban, Layers, MapPin, Rocket, Sparkle, Users, type LucideIcon } from "lucide-react";

export interface GlanceRow {
  term: string;
  detail: string;
}

/** An icon for each known term; anything else gets a sparkle. */
const ICONS: Record<string, LucideIcon> = {
  Services: Layers,
  "Who we work with": Users,
  "How we start": Rocket,
  "Where we work": MapPin,
  "Selected work": FolderKanban,
};

/** Tiles that take a wider slot or the violet highlight in the bento grid. */
const WIDE = new Set(["Services"]);
const HIGHLIGHT = new Set(["Selected work"]);

/**
 * A short definition list set as a bento grid of tiles: easy for people to scan and,
 * because it is still a <dl>, easy for answer engines to lift.
 */
export default function AtAGlance({ title, id, rows }: { title: string; id: string; rows: GlanceRow[] }) {
  return (
    <section className="section section--tight" aria-labelledby={id}>
      <div className="wrap glance">
        <h2 id={id} className="glance__title">
          {title}
        </h2>
        <dl className="glance__grid">
          {rows.map((row) => {
            const Glyph = ICONS[row.term] ?? Sparkle;
            const classes = ["glance__tile"];
            if (WIDE.has(row.term)) classes.push("glance__tile--wide");
            if (HIGHLIGHT.has(row.term)) classes.push("glance__tile--highlight");
            return (
              <div key={row.term} className={classes.join(" ")}>
                <dt>
                  <span className="glance__icon" aria-hidden="true">
                    <Glyph size={20} strokeWidth={1.75} />
                  </span>
                  {row.term}
                </dt>
                <dd>{row.detail}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
