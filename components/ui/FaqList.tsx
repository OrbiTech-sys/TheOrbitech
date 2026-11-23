/** Questions and answers as plain disclosure elements: keyboard and screen-reader friendly, and the answers are in the server HTML. */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((item, index) => (
        <details key={item.q} name="faq" open={index === 0}>
          <summary>{item.q}</summary>
          <p className="faq__answer">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
