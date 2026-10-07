import { skills } from "@/content/site";

/** Skills and tools, grouped by discipline. */
export default function TechStackSection() {
  return (
    <section className="section" aria-labelledby="skills-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="skills-title" className="h2">
            Skills and tools
          </h2>
          <p className="split__text">
            What we reach for most. We choose per project and explain the choice in the proposal.
          </p>
        </div>

        <dl className="skills">
          {skills.map((group) => (
            <div key={group.discipline} className="skills__row">
              <dt>{group.discipline}</dt>
              <dd>
                <ul className="skills__tools">
                  {group.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
