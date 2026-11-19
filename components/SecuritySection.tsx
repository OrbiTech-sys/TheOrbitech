import SectionHeading from "@/components/ui/SectionHeading";
import { securityPractices } from "@/content/site";

/** What we do on every project, in plain words. No badges for audits we haven't been through. */
export default function SecuritySection() {
  return (
    <section id="security" className="section" aria-labelledby="security-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="Security"
          title="How we handle security"
          lede="What we do on every project, written plainly. Formal compliance such as SOC 2, HIPAA or PCI DSS needs its own audit; if you need one, we scope that work with you openly."
          id="security-title"
        />
        <ul className="checks checks--cols">
          {securityPractices.map((practice) => (
            <li key={practice}>{practice}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
