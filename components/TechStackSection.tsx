import { skills } from "@/content/site";

/** Skills and tools, grouped by discipline. */
export default function TechStackSection() {
  return (
    <section id="skills" className="wrap" aria-labelledby="skills-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">Tools</div>
          <h2 id="skills-title">Skills and tools</h2>
        </div>
        <p>What we reach for most. We choose per project and explain the choice in the proposal.</p>
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
    </section>
  );
}
