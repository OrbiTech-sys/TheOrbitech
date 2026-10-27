import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { meta, privacy, site } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.privacy;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: page.path },
];

// Until a retention period is supplied the page is incomplete, so it stays out of search results.
export const metadata: Metadata = pageMetadata({ ...meta.privacy, path: page.path, noindex: !page.indexable });

export default function PrivacyPage() {
  const owner = site.legalName ?? site.name;
  const contact = privacy.contactEmail ?? site.email;

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path: page.path,
            name: meta.privacy.title,
            description: meta.privacy.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
        ]}
      />

      <PageIntro
        crumbs={crumbs}
        title="Privacy policy"
        lede="This site collects very little. This page says exactly what, why, and how to have it removed."
      />

      <section className="wrap" aria-label="Privacy policy">
        <div className="prose prose--narrow">
          <h2>Who we are</h2>
          <p>
            This website is run by {owner}
            {site.location ? `, ${site.location}` : null}.
            {contact && (
              <>
                {" "}
                For privacy questions, write to <a href={`mailto:${contact}`}>{contact}</a>.
              </>
            )}
          </p>

          <h2>What we collect</h2>
          <p>
            <strong>The contact form.</strong> When you send a message we receive the details you type: your name, email
            address and message, and, if you choose to give them, your company, project type, budget and timing. We use them to
            reply to you and to scope any work you ask about.
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
            <strong>Server logs.</strong> Our hosting provider{privacy.hosting ? ` (${privacy.hosting})` : ""} may keep standard
            request logs, such as your network address and browser type, for security and reliability.
          </p>

          <h2>What we don’t do</h2>
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

          {privacy.retention && (
            <>
              <h2>How long we keep it</h2>
              <p>
                We keep enquiries for {privacy.retention}, or until you ask us to delete them. If we work together, project
                records are kept as the contract says.
              </p>
            </>
          )}

          <h2>Your choices</h2>
          <p>
            You can ask what we hold about you, ask us to correct it, or ask us to delete it, by emailing the address
            above. Depending on where you live, you may have further rights under local law.
          </p>

          <h2>Changes</h2>
          <p>
            {privacy.updated && <>Last updated: {privacy.updated}. </>}
            If we change what the site collects, we change this page first.
          </p>
        </div>
      </section>
    </>
  );
}
