import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { Pending } from "@/components/Pending";
import { privacy, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "What this website collects when you contact us, why, and how to ask us to delete it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const owner = site.legalName ?? site.name;
  const contact = privacy.contactEmail ?? site.email;

  return (
    <>
      <PageIntro
        title="Privacy"
        lede="This site collects very little. This page says exactly what, why, and how to have it removed."
      />

      <section className="section section--tight" aria-label="Privacy policy">
        <div className="wrap prose prose--narrow">
          <h2 className="h3">Who we are</h2>
          <p>
            This website is run by {owner}
            {site.location ? `, ${site.location}` : null}. For privacy questions, write to{" "}
            {contact ? (
              <a href={`mailto:${contact}`} className="ulink">
                {contact}
              </a>
            ) : (
              <Pending>Privacy contact email</Pending>
            )}
            .
          </p>

          <h2 className="h3">What we collect</h2>
          <p>
            <strong>The contact form.</strong> When you send a message we receive the details you type: your name, email
            address and message, and, if you choose to give them, your company, project type, budget, timing and a budget
            estimate from the estimator. We use them to reply to you and to scope any work you ask about.
          </p>
          <p>
            <strong>How the message reaches us.</strong> The form sends your message by email through {privacy.emailProvider}, an
            email delivery service. It is not stored in a database on this website.
          </p>
          <p>
            <strong>Spam protection.</strong> To limit repeated submissions, the server briefly remembers your network
            address in memory for ten minutes. It is not written to disk or shared.
          </p>
          <p>
            <strong>Server logs.</strong> Our hosting provider{" "}
            {privacy.hosting ? <>({privacy.hosting}) </> : <Pending>Hosting provider</Pending>} may keep standard request
            logs, such as your network address and browser type, for security and reliability.
          </p>

          <h2 className="h3">What we don’t do</h2>
          <p>
            This site sets no cookies, runs no analytics or advertising trackers, and loads its fonts from its own
            server, so your browser makes no requests to font or analytics companies.
          </p>
          {site.booking.url && (
            <p>
              If you use the booking link, you leave this site and the booking provider’s own privacy policy applies to
              what you enter there.
            </p>
          )}

          <h2 className="h3">How long we keep it</h2>
          <p>
            We keep enquiries for{" "}
            {privacy.retention ?? <Pending>Retention period, e.g. 12 months</Pending>}, or until you ask us to delete them.
            If we work together, project records are kept as the contract says.
          </p>

          <h2 className="h3">Your choices</h2>
          <p>
            You can ask what we hold about you, ask us to correct it, or ask us to delete it, by emailing the address
            above. Depending on where you live, you may have further rights under local law.
          </p>

          <h2 className="h3">Changes</h2>
          <p>
            Last updated: {privacy.updated ?? <Pending>Date this page was last reviewed</Pending>}. If we change what the
            site collects, we change this page first.
          </p>
        </div>
      </section>
    </>
  );
}
