export interface GlanceRow {
  term: string;
  detail: string;
}

/** A short definition list: easy for people to scan and for answer engines to lift. */
export default function AtAGlance({ title, id, rows }: { title: string; id: string; rows: GlanceRow[] }) {
  return (
    <section className="section section--tight" aria-labelledby={id}>
      <div className="wrap">
        <div className="glance reveal">
          <h2 id={id}>{title}</h2>
          <dl>
            {rows.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
