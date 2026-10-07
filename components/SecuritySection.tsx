import { securityPractices } from "@/content/site";

/** What we do on every project, in plain words. No badges for audits we haven't been through. */
export default function SecuritySection() {
  return (
    <section className="section" aria-labelledby="security-title">
      <div className="wrap split">
        <div className="split__head">
          <h2 id="security-title" className="h2">
            How we handle security
          </h2>
          <p className="split__text">
            What we do on every project, written plainly. Formal compliance such as SOC 2, HIPAA or PCI DSS needs its own
            audit; if you need one, we scope that work with you openly.
          </p>
        </div>

        <ul className="practices">
          {securityPractices.map((practice) => (
            <li key={practice}>{practice}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
