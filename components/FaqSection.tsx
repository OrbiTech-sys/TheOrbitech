import { faqs } from "@/content/site";

/** Plain disclosure elements: keyboard and screen-reader friendly with no script. One opens at a time. */
export default function FaqSection() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="faq-title" className="h2">
            Questions we’re asked
          </h2>
        </div>

        <div className="faq">
          {faqs.map((faq, index) => (
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
