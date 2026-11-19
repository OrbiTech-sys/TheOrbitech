import SectionHeading from "@/components/ui/SectionHeading";
import { skills } from "@/content/site";

/** Technology the studio uses, grouped into five areas. Only tools listed in content/site.ts appear here. */
export default function TechStackSection({
  eyebrow = "Technical expertise",
  title = "The tools we reach for",
  lede = "What we use most. We choose per project and explain the choice in the proposal.",
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
}) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} id="skills-title" />
        <div className="grid grid--3 tech-grid">
          {skills.map((group) => (
            <section key={group.discipline} className="card reveal" aria-label={group.discipline}>
              <h3 className="card__title">{group.discipline}</h3>
              <ul className="tags">
                {group.tools.map((tool) => (
                  <li key={tool} className="tag">
                    {tool}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
