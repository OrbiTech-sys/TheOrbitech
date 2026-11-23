import SectionHeading from "@/components/ui/SectionHeading";
import { automationTools } from "@/content/site";

/** Tools the studio uses, in groups. Defaults to the automation platforms; pass `groups` to show another list (e.g. `skills`). Only tools listed in content/site.ts appear here. */
export default function TechStackSection({
  eyebrow = "Automation tools",
  title = "The tools we reach for",
  lede = "What we use most. We choose per project and explain the choice in the proposal.",
  groups = automationTools,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  groups?: { discipline: string; tools: string[] }[];
}) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} id="skills-title" />
        <div className="grid grid--3 tech-grid">
          {groups.map((group) => (
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
