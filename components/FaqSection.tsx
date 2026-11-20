import { faqs } from "@/content/site";

interface FaqSectionProps {
  items?: { question: string; answer: string }[];
  title?: string;
}

/** Plain disclosure elements: keyboard and screen-reader friendly with no script. One opens at a time. */
export default function FaqSection({ items = faqs, title = "Questions we’re asked" }: FaqSectionProps) {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="faq-title" className="h2">
            {title}
          </h2>
        </div>

        <div className="faq">
          {items.map((faq, index) => (
            <details key={faq.question} name="faq" open={index === 0}>
              <summary>{faq.question}</summary>
              <p className="faq__answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
