import SectionHeading from "@/components/ui/SectionHeading";
import Timeline from "@/components/ui/Timeline";
import { process as steps } from "@/content/site";

/** How a project runs: five steps, the same on the home page and /services. */
export default function ProcessSection({
  eyebrow = "Development process",
  title = "From first conversation to launch, in five steps",
  lede = "Every project follows the same path. Scope decides how long each step takes.",
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
}) {
  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} id="process-title" />
        <Timeline steps={steps} />
      </div>
    </section>
  );
}
