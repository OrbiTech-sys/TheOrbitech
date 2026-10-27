import { faqs } from "@/content/site";

/**
 * Questions buyers ask, each with a direct answer that stands on its own. Plain
 * visible text, so it is in the server HTML and never hidden behind script.
 */
export default function QuestionsSection() {
  return (
    <section id="questions" className="wrap" aria-labelledby="questions-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">Questions</div>
          <h2 id="questions-title">Questions we get asked</h2>
        </div>
        <p>Short answers to what buyers ask before a project starts.</p>
      </div>
      <div className="qa">
        {faqs.map((faq) => (
          <div key={faq.question} className="qa__item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
