import { securityPractices } from "@/content/site";

/** What we do on every project, in plain words. No badges for audits we haven't been through. */
export default function SecuritySection() {
  return (
    <section id="security" className="wrap" aria-labelledby="security-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">Security</div>
          <h2 id="security-title">How we handle security</h2>
        </div>
        <p>
          What we do on every project, written plainly. Formal compliance such as SOC 2, HIPAA or PCI DSS needs its own
          audit; if you need one, we scope that work with you openly.
        </p>
      </div>
      <ul className="practices">
        {securityPractices.map((practice) => (
          <li key={practice}>{practice}</li>
        ))}
      </ul>
    </section>
  );
}
