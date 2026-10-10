import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="wrap">
      <div>
        <strong style={{ color: "var(--text)" }}>THE ORBITECH SOLUTIONS</strong>
        <br />
        AI, software, data, and business growth.
      </div>
      <span>
        © {site.copyrightYear} The OrbiTech Solutions · Capability examples may include demos, POCs, and MVPs.
      </span>
    </footer>
  );
}
