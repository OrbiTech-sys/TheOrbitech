import FaqList from "@/components/ui/FaqList";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/content/site";

/**
 * Questions buyers ask, each with a direct answer that stands on its own. Plain
 * visible text, so it is in the server HTML and never hidden behind script.
 */
export default function QuestionsSection({
  items = faqs.map((faq) => ({ q: faq.question, a: faq.answer })),
  title = "Questions we get asked",
  lede = "Short answers to what buyers ask before a project starts.",
}: {
  items?: { q: string; a: string }[];
  title?: string;
  lede?: string;
}) {
  return (
    <section id="questions" className="section" aria-labelledby="questions-title">
      <div className="wrap wrap--narrow">
        <SectionHeading eyebrow="FAQ" title={title} lede={lede} id="questions-title" />
        <FaqList items={items} />
      </div>
    </section>
  );
}
