# SEO, AEO and GEO changelog

Branch `seo-aeo-geo`, 27 October 2026. Not pushed, merged or deployed.

Every change below was checked against a local production build (`next build` + `next start`). The live site has not been checked yet; the commands for that are at the end of `OWNER-TASKS.md`.

## Summary

- **Domain.** Every URL now comes from one place (`lib/site-config.ts`). It reads `NEXT_PUBLIC_SITE_URL` and falls back to `https://theorbitechsolution.com`. There are no `orbitech.dev` references left in the source or the build output.
- **Indexing.** Canonicals are self-referencing, absolute and without a trailing slash. `robots.txt` and `sitemap.xml` are generated from code. The sitemap lists 11 indexable URLs, including all six case studies, with real dates.
- **Pages.** Every page has a unique title and description, one H1 that says what the page is about, and working Open Graph and Twitter tags. No bracketed placeholder is visible anywhere.
- **Structured data.** One JSON-LD `@graph` per page with stable `@id`s: Organization and ProfessionalService, WebSite, WebPage types, BreadcrumbList, one Service per area, and CreativeWork per case study.
- **Links.** The header links to real routes, there is a footer with links, email, location and social profiles, and home-page cards link to the case studies. Every indexable page is within two clicks of the home page.
- **Answers.** The home page has a plain definition and an at-a-glance block. `/services` has eight questions with 40 to 60 word answers in visible HTML. `/llms.txt` is generated from the same content.
- **Found along the way.** The inner pages had been rendering unstyled, with invisible H1s, since the last redesign commit. They now use the home page's dark theme (see "Inner-page styling" below).

## Changes by area

Each entry gives the file, what was wrong, what is true now, and how it was verified.

### Phase 1: domain, canonicals, robots, sitemap

| File | What was wrong | What is true now | Verified by |
|---|---|---|---|
| `content/site.ts` (`site.url`) | `https://orbitech.dev`, another company's domain | `https://theorbitechsolution.com` | unit test `site address`; `verify-seo` canonical checks |
| `lib/site-config.ts` (new) | URL logic lived in `lib/seo.ts`, with the wrong fallback | One `siteUrl` and `absoluteUrl()`. The env var must be a valid https origin or it is ignored. The home page has no trailing slash. | unit tests |
| `.env.example` | Variable documented as optional, no value | `NEXT_PUBLIC_SITE_URL=https://theorbitechsolution.com`, with instructions | read |
| `app/layout.tsx` | Root metadata set a canonical of `/`, Open Graph, Twitter and a `keywords` tag, inherited by every route including the 404 | Root keeps only `metadataBase`, the title template, `applicationName` and `authors`. Pages set their own tags. No keywords tag. | `curl` of `/does-not-exist`: noindex, no canonical, no `og:` tags |
| `lib/seo.ts` | Relative canonical and social URLs, `follow: false` on noindex | Absolute canonical, `og:url`, `og:image` (width, height, alt), `twitter:card=summary_large_image`. Noindex pages keep `follow`. `twitter:site` only if an X profile is supplied (none is). | unit test; `verify-seo` |
| `app/robots.ts` | Sitemap line on `orbitech.dev` | `Allow: /`, `Disallow: /contact/thanks`, `Sitemap: https://theorbitechsolution.com/sitemap.xml`. No crawler blocked; training crawlers untouched pending your decision. | `curl /robots.txt` |
| `app/sitemap.ts`, `lib/pages.ts` (new) | Fixed date, `changefreq` and `priority`, the two private case studies missing, wrong host | Built from the same page list that sets each robots tag. Real `lastModified` from content data. `/privacy` stays out while it is noindex. | unit tests; `verify-seo` (11 URLs, six case studies, each 200 and indexable) |
| `public/og/default.png` | 295 KB, and referenced on `orbitech.dev` (404) | 69 KB, same 1200×630, absolute URL on our domain | `verify-seo`: `og:image` and `twitter:image` load as `image/png` |
| `app/not-found.tsx` | Inherited a canonical to the home page and social tags | Only a title and noindex | `curl` |

### Phase 2: on-page

| File | What was wrong | What is true now | Verified by |
|---|---|---|---|
| `content/site.ts` (`meta`, project `seoTitle` and `seoDescription`) | Generic titles ("Services \| The OrbiTech Solutions") and descriptions copied from cards | Hand-written titles of 46 to 59 characters and descriptions of 150 to 160, all unique | unit tests enforce lengths and uniqueness; `verify-seo` |
| `components/PortfolioHome.tsx` | H1 was the slogan, with no topic words | H1 "AI automation and web development for growing businesses". The slogan moved to the small eyebrow line above it. The first paragraph is the company definition. | screenshot; `verify-seo` (one H1) |
| `components/PortfolioHome.tsx`, `content/site.ts` | AidoChat card, case page, meta description and JSON-LD said "confirm current features before a client walkthrough" | Removed everywhere. A neutral note reads "Live demo. The first load can take a few seconds." | unit test (no "walkthrough" in content); grep |
| `components/PortfolioHome.tsx` | Visible note "Replace the example email address…", and `mailto:hello@orbitechsolutions.com` | Removed. The call to action links to `/contact`; the email is `nova@theorbitechsolution.com`. | grep |
| `components/PortfolioHome.tsx` | Private cards showed made-up addresses (`internal.orbitech.sys/…`) in the fake browser bar | "Private project, link withheld" | screenshot |
| All pages | Several H1s were invisible (inner pages) or not topical | One H1 per page, in plain words, with H2 and H3 in order | `verify-seo`; screenshots |

### Phase 3: structured data

| File | What was wrong | What is true now | Verified by |
|---|---|---|---|
| `lib/schema.ts` (new), `components/JsonLd.tsx` | A bare Organization with the wrong URL. Case studies used `sameAs` for the demo link. | Organization and ProfessionalService with name, alternateName, url, logo (512×512), image, the definition as description, slogan, email, contactPoint, foundingDate 2025-10-26, address (New York, US only), areaServed, knowsAbout, and sameAs listing only your three profiles. Plus WebSite, a WebPage type per page with `isPartOf` and a real `dateModified`, and BreadcrumbList on inner pages. `/services` has six `Service` nodes with no offers or prices. Each case study is a CreativeWork whose `url` is the case-study URL; live demos are a `WebApplication` inside `workExample`. `<` is escaped. | unit tests (ids resolve, no foreign domains, no `sameAs` on projects); `verify-seo` parses every block on every page |
| (not added) | n/a | Person (no team supplied), Review or aggregateRating, HowTo, FAQPage, telephone and street address are deliberately absent | unit test: no telephone |

### Phase 4: links, navigation, footer, social

| File | What was wrong | What is true now | Verified by |
|---|---|---|---|
| `components/Navbar.tsx` | Only `#` anchors with plain `<a>` | `next/link` to Services, Work, Studio and Contact, plus the home anchors. `aria-current="page"`, including on case studies under Work. | screenshot; `verify-seo` |
| `components/Footer.tsx`, `components/SocialIcon.tsx` (new) | A one-line footer with no links | Brand, definition, location line, email, Services, Work, Studio, Contact and Privacy links, and inline-SVG LinkedIn, Instagram and Facebook links with `aria-label="The OrbiTech Solutions on …"`, `target="_blank"` and `rel="noopener noreferrer me"` | screenshot; `verify-seo` (home links to all five routes) |
| `components/PortfolioHome.tsx` | Cards linked only to external demos, all labelled "Explore live demo" | "Read the case study" (`/work/<slug>`) first, then "Open the live demo" with `rel="noopener"`. Both carry the project name for screen readers and crawlers. | screenshot |
| `components/PortfolioHome.tsx`, `app/services/page.tsx` | Capability modules did not link anywhere | Each module links to `/services#<area>`, and each area on `/services` has that id. | `verify-seo` internal-link check |
| `app/work/[slug]/page.tsx`, `components/Breadcrumbs.tsx` (new) | No way back, no breadcrumb | A visible breadcrumb matching the BreadcrumbList, plus links to all projects, the related service, Contact and the next project | `verify-seo`: every sitemap URL is at most 2 clicks from home |
| `components/ContactSection.tsx` | Placeholders for email, location and booking | Real `mailto:`, the location line and the same three social links. The booking box is hidden until a link exists. | screenshot |

### Phase 5 and 6: answers and citability

| File | What is true now |
|---|---|
| `content/site.ts` (`faqs`), `components/QuestionsSection.tsx` | Eight questions on `/services`, each an H3, each answered in 40 to 60 words (enforced by a unit test), as plain visible HTML. They are based on what the site states and the five-step process, with no prices, timelines or guarantees. |
| `lib/glance.ts`, `components/AtAGlance.tsx` | One "at a glance" definition list, shared by the home page and `/services`: services, who we work with, how we start, where we work, selected work. |
| `content/site.ts` (`site.description`) | One two-sentence definition: who, what, for whom, and where. It is the home page's first paragraph, the Organization description, the footer text, the `/studio` lede and the `llms.txt` summary. |
| `app/work/page.tsx` | A self-contained passage of about 100 words, "What our demos show", naming each demo and what it is. |
| `content/site.ts` (`projects[].features`) | What each live demo shows, restated from the demo pages themselves (checked on 27 October 2026). Marketing claims on the demo pages, such as accuracy figures or SOC 2, were **not** repeated. |
| `components/LastUpdated.tsx` | `/services`, `/work` and each case study show "Last updated 27 October 2026", the same date as `dateModified` and the sitemap. |
| `app/llms.txt/route.ts` | `/llms.txt`, generated from the same content: name, definition, contact, main pages, service areas, case studies and profiles. It is a route rather than a file in `public/`, so it cannot drift from the site. |

### Phase 7: technical, assets, accessibility

| File | What was wrong | What is true now |
|---|---|---|
| `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `scripts/make-icons.mjs` | The favicon was the stock Create Next App icon; there was no apple-touch-icon | 512 and 180 PNG icons and a 32/48 favicon, drawn from the header's existing brand mark (cyan ring, violet and gold orbits, "O"). Please confirm or replace them. |
| `app/manifest.ts` | No manifest | `/manifest.webmanifest` with name, short name, colours and icons |
| `public/og/work/*.jpg`, `scripts/make-og.mjs` | Case studies used WebP covers, which some networks do not read | A 1200×630 JPEG per case study (15 to 89 KB), cut from the existing screenshots |
| `app/layout.tsx` | No `<main>` on inner pages, no skip link | One `<main id="main">` per page and a "Skip to content" link |
| `components/PortfolioHome.tsx` | `aria-expanded` on `<article>`, focusable hidden links in closed modules, a nested button inside `role="button"` | `aria-expanded` and `aria-controls` on the toggle button only. Closed panels are `visibility: hidden`. No nested interactive roles. |
| `components/WorkIndex.tsx`, `PortfolioHome.tsx` | Two `priority` images on `/work`; `priority` on a modal image | Only the first card is `priority`; the modal image loads normally |
| `components/Navbar.tsx`, `PortfolioHome.tsx`, `WorkIndex.tsx`, `lib/paths.ts` (new) | Midway through this work, the client components imported `content/site.ts`, which put all the copy into a 38 KB client chunk | Content is passed as props from server components. A grep of `.next/static/chunks` finds none of the site copy. |
| `app/portfolio.css` | With seven header links the nav measured 969 px and was clipped between 561 px and about 1000 px | The menu button takes over below 1024 px. Checked at 375, 683 and 1024 px: no horizontal overflow, and the menu marks the current section. |

### Phase 8: unfinished pages

| Page | Status |
|---|---|
| `/studio` | Indexable. Describes the studio in the third person from facts on the site. The empty story and the three stock-photo team placeholders are gone. |
| `/contact` | Indexable. Real email, location and profiles. The booking box is hidden (no link supplied). The estimator is hidden, because its prices were marked as placeholders. |
| `/privacy` | **Noindex and out of the sitemap.** Email, "Vercel" and the review date are filled. The retention paragraph is hidden until `privacy.retention` is supplied; the page then becomes indexable on its own. |
| `/work/*` (six) | All indexable. Client, year, role and stack rows are hidden while empty. Demos say "Live demo"; the two private projects say "Private project" and that the link is withheld. |

### Inner-page styling (not a redesign, but please review)

Commit `13e3f7e` ("Update project") switched the layout from `site.css` and `pages.css` to `portfolio.css`. That left `/services`, `/work`, the case studies, `/studio`, `/contact` and `/privacy` without styles for their own classes, and their H1s at `opacity: 0` (the `.reveal` class waits for a script that only the home page runs). Crawlers still read the text, but people saw plain, cramped text and no heading.

`app/inner.css` styles these pages using only the variables in `portfolio.css`: navy background, cyan and violet accents, the same panels, radii and buttons. The closing call to action reuses the home page's `.cta` panel. The H1s are visible. The 3D scene on `/services` (three.js) was dropped with the old process section, which also removed a large script from that page. Please look at the pages; this is the one place where the visible design changed beyond copy.

## Before and after: titles, descriptions, canonicals, H1s

Before is the current `main` (commit `13e3f7e`), built locally. After is this branch.

| Page | | Title | Description | Canonical | H1 | Robots |
|---|---|---|---|---|---|---|
| `/` | Before | The OrbiTech Solutions \| AI, Software & Business Growth | The OrbiTech Solutions delivers AI integration, intelligent automation, software engineering, data analytics, and business growth technology. | https://orbitech.dev | Make work smarter. Make growth real. | index |
| | After | AI Automation & Web Development \| The OrbiTech Solutions | The OrbiTech Solutions is a small studio that builds AI automation, chatbots and websites for businesses. See live demos and get in touch to scope a project. | https://theorbitechsolution.com | AI automation and web development for growing businesses | index |
| `/services` | Before | Services \| The OrbiTech Solutions | Websites, web apps, AI automation, integrations, cloud and ongoing care: what is included, who each is for and how we work. | https://orbitech.dev/services | What we do, and how we do it | index |
| | After | AI Automation, Web & Data Services \| The OrbiTech Solutions | Six service areas: AI automation and chatbots, data analytics, custom web and SaaS, digital strategy, CRM and workflow automation, and AI e-commerce search. | https://theorbitechsolution.com/services | AI automation, web development and data services | index |
| `/work` | Before | Work \| The OrbiTech Solutions | Websites, web apps and AI tools we have built, each with the brief, our approach and a link to the live site. | https://orbitech.dev/work | Selected work | index |
| | After | AI & Web Projects with Live Demos \| The OrbiTech Solutions | Browse four live demos and two private projects from The OrbiTech Solutions: a CRM copilot, property management, AI document chat, AI e-commerce and chatbots. | https://theorbitechsolution.com/work | AI and web projects with live demos | index |
| `/studio` | Before | Studio \| The OrbiTech Solutions | Who is behind OrbiTech, how we work together, and the skills and tools we use. | https://orbitech.dev/studio | About OrbiTech | index |
| | After | About The OrbiTech Solutions \| AI & Web Studio | The OrbiTech Solutions is a small AI automation and web development studio in New York, US, working remotely worldwide. See how it works and the tools it uses. | https://theorbitechsolution.com/studio | About The OrbiTech Solutions | index |
| `/contact` | Before | Contact \| The OrbiTech Solutions | Start a project or book a 30-minute call. We reply by email. | https://orbitech.dev/contact | Start a project | index |
| | After | Contact The OrbiTech Solutions \| Start a Project | Contact The OrbiTech Solutions to start an AI automation, chatbot or web project. Send a message or email nova@theorbitechsolution.com and we reply by email. | https://theorbitechsolution.com/contact | Contact The OrbiTech Solutions to start a project | index |
| `/privacy` | Before | Privacy \| The OrbiTech Solutions | What this website collects when you contact us, why, and how to ask us to delete it. | https://orbitech.dev/privacy | Privacy | index |
| | After | Privacy Policy \| The OrbiTech Solutions | What The OrbiTech Solutions collects when you use the contact form on this website, why it is collected, and how to ask for your details to be deleted. | https://theorbitechsolution.com/privacy | Privacy policy | noindex, follow |
| `/work/orbit-operations` | Before | Orbit Operations Copilot \| The OrbiTech Solutions | A CRM and operations-copilot concept that brings customer relationships, deal pipelines, tasks, analytics, and AI-assisted follow-through into one workspace. | https://orbitech.dev/work/orbit-operations | Orbit Operations Copilot | index |
| | After | Orbit Operations Copilot: CRM Demo \| The OrbiTech Solutions | Orbit Operations Copilot is a live demo of a CRM with an AI copilot. It tracks deals and tasks, flags stalled deals and drafts follow-ups for approval. | https://theorbitechsolution.com/work/orbit-operations | Orbit Operations Copilot | index |
| `/work/property-management` | Before | Property Management System \| The OrbiTech Solutions | A property-operations workspace concept for property/unit information, leasing activity, maintenance requests, payment records, and portfolio visibility. | https://orbitech.dev/work/property-management | Property Management System | index |
| | After | Property Management System Demo \| The OrbiTech Solutions | A live demo of a property operations workspace. It brings property and unit details, leasing, maintenance requests and payment records into one dashboard view. | https://theorbitechsolution.com/work/property-management | Property Management System | index |
| `/work/aidochat` | Before | AidoChat / DocuMind AI \| The OrbiTech Solutions | An AI document-intelligence experience. The public demo may take a moment to initialize; confirm current features before a client walkthrough. | https://orbitech.dev/work/aidochat | AidoChat / DocuMind AI | index |
| | After | AidoChat: AI Document Chat Demo \| The OrbiTech Solutions | AidoChat is a live demo of AI document chat. Upload PDFs, scans and Word files, ask questions and get answers that cite the page and passage they came from. | https://theorbitechsolution.com/work/aidochat | AidoChat / DocuMind AI | index |
| `/work/ecommerce-experience` | Before | AI E-commerce Experience \| The OrbiTech Solutions | An AI-oriented commerce demo featuring natural-language product discovery, product collections, product details, and a luxury storefront experience. | https://orbitech.dev/work/ecommerce-experience | AI E-commerce Experience | index |
| | After | AI E-commerce Product Search Demo \| The OrbiTech Solutions | A live demo of an AI e-commerce storefront. Visitors search in plain language by occasion, need or budget, and browse collections, filters and product details. | https://theorbitechsolution.com/work/ecommerce-experience | AI E-commerce Experience | index |
| `/work/whatsapp-chatbot` | Before | WhatsApp Business Chatbot \| The OrbiTech Solutions | Custom WhatsApp chatbot concept for business and e-commerce customer service, FAQs, lead capture, and customer hand-off. Link withheld due to client/company privacy. | https://orbitech.dev/work/whatsapp-chatbot | WhatsApp Business Chatbot | noindex, nofollow |
| | After | WhatsApp Business Chatbot Concept \| The OrbiTech Solutions | A private concept for a WhatsApp business chatbot that handles customer service questions, FAQs and lead capture, then hands customers to a person when needed. | https://theorbitechsolution.com/work/whatsapp-chatbot | WhatsApp Business Chatbot | index |
| `/work/bulk-email-agent` | Before | Bulk Email Agent / Sender \| The OrbiTech Solutions | Bulk email workflow tool concept for sending and managing outreach campaigns. Link withheld due to client/company privacy; present only with approved screenshots or a controlled demo. | https://orbitech.dev/work/bulk-email-agent | Bulk Email Agent / Sender | noindex, nofollow |
| | After | Bulk Email Agent Outreach Concept \| The OrbiTech Solutions | A private concept for a bulk email workflow tool that sends and manages outreach campaigns. There is no public link, and details are shared on request. | https://theorbitechsolution.com/work/bulk-email-agent | Bulk Email Agent / Sender | index |

## Verification results

All results are from local runs on 27 October 2026.

| Check | Result |
|---|---|
| `npm run build` | Pass. 23 routes generated. Like `main`, the first run stops with Next.js's security-advisory notice and the second run continues; see `OWNER-TASKS.md` §11. |
| `npm run lint` | Pass, 0 problems. The lint config now ignores every `.next-*` build folder, including the committed `.next-audit`. |
| `npm run typecheck` | Pass |
| `npm test` (vitest) | 55 of 55 pass, including new SEO tests: title and description lengths and uniqueness, Q&A word counts, sitemap contents, robots, schema `@id` resolution, no foreign domains, no placeholders, no em dashes in content |
| `node scripts/verify-seo.mjs http://localhost:3300` | **All 150 checks passed.** Every page returns 200 with a unique title and description, one H1, one `<main>`, and a canonical equal to its own `https://theorbitechsolution.com/...` URL. `og:image` and `twitter:image` are on our domain and load as images. One JSON-LD block per page parses and every `@id` resolves. No visible `[ … ]` placeholder. robots.txt and sitemap.xml are correct. All 12 internal link targets return 200 with no redirects. Every sitemap URL is within 2 clicks of home. |
| Old-domain search over the source (excluding `node_modules`, `.git` and the archived `audit/` and `.next-audit/` folders) and over `.next` | 0 hits |
| No-JavaScript check (`curl`) | The definition, "at a glance", all Q&A questions and the case-study text are in the server HTML |
| Visual check (browser screenshots) | Home, services, a case study and contact match the dark theme; the footer icons render. At 375 px there is no horizontal scroll and the menu opens with "Work" marked as current on a case study. |
| Client bundle check | None of the site copy (service lists, Q&A, security text) appears in `.next/static/chunks` |

## Lighthouse (mobile emulation, local production build)

**Method.** Lighthouse 13.5.0, mobile form factor, simulated throttling, run against `next start` on this machine. "Before" is `main` (commit `13e3f7e`), built in a separate worktree. "After" is this branch. Before and after runs were alternated so they share machine conditions. The table shows the last two rounds, on the final build of the branch.

| Page | Metric | Before (run A / run B) | After (run A / run B) |
|---|---|---|---|
| `/` | Performance | 59 / 60 | 69 / 51 |
|  | Accessibility | 100 / 100 | 100 / 100 |
|  | SEO | 100 / 100 | 100 / 100 |
|  | LCP (ms) | 3931 / 3897 | 3335 / 4404 |
|  | TBT (ms) | 1032 / 994 | 828 / 1518 |
|  | CLS | 0 / 0 | 0 / 0 |
| `/services` | Performance | 79 / 79 | 58 / 76 |
|  | Accessibility | 98 / 98 | 100 / 100 |
|  | SEO | 100 / 100 | 100 / 100 |
|  | LCP (ms) | 2931 / 3000 | 3940 / 3054 |
|  | TBT (ms) | 540 / 616 | 1089 / 741 |
|  | CLS | 0 / 0 | 0 / 0 |
| `/work` | Performance | 80 / 82 | 79 / 80 |
|  | Accessibility | 93 / 93 | 100 / 100 |
|  | SEO | 100 / 100 | 100 / 100 |
|  | LCP (ms) | 3495 / 3505 | 3266 / 3180 |
|  | TBT (ms) | 439 / 356 | 539 / 506 |
|  | CLS | 0 / 0 | 0 / 0 |
| `/work/orbit-operations` | Performance | 80 / 81 | 68 / 65 |
|  | Accessibility | 98 / 98 | 100 / 100 |
|  | SEO | 100 / 100 | 100 / 100 |
|  | LCP (ms) | 3138 / 3237 | 3573 / 3715 |
|  | TBT (ms) | 438 / 476 | 786 / 875 |
|  | CLS | 0 / 0 | 0 / 0 |

**What the numbers say.**

- **Accessibility** rose to 100 on all four pages, from 93 on `/work` and 98 on `/services` and the case study. This held in every round.
- **SEO category** was 100 before and after. Lighthouse's SEO audit accepted the old canonical to `orbitech.dev` as valid, so this score does not reflect the domain fix.
- **CLS** was 0 before and after.
- **Performance on `/` and `/work`** shows no clear change. Over all five rounds the median performance was 64 → 65 on `/` and 78 → 75 on `/work`.
- **Performance on the case study is lower**, consistently in all five rounds: median 81 → 70, TBT about 490 → 860 ms, LCP about 3.2 → 3.6 s. **`/services`** dropped from a median of 75 to 68, with wide spread. The JavaScript transferred is about the same (around 170 KB). The difference is mostly **Style & Layout** time, about 480 → 890 ms on the case study. Before this change those pages were effectively unstyled, so the browser had little to lay out. They now render the full dark theme, with the same gradients and shadows as the home page. This is the measured cost of making the pages look like the rest of the site. It is not an improvement and is not reported as one.
- Single runs vary widely here (home TBT 511 to 1,091 ms on the same `main` build), so differences under about 10 points are noise. Field data from Search Console's Core Web Vitals report, once the site has traffic, will say more than these lab runs.

## What was not verified

- **The live site.** Nothing was deployed. Run the checks in `OWNER-TASKS.md` after deploying.
- **Google's or Bing's view.** Rich Results Test, the Schema Markup Validator, Search Console and URL inspection need the live URL.
- **Social previews.** The tags and images were checked over HTTP, but not in LinkedIn Post Inspector or the Facebook debugger.
- **The Playwright end-to-end tests.** They were already out of date before this branch (old titles, `/work/project-3`) and were not run or updated.
- **The contact form.** Email delivery was not tested; it needs the Resend variables.
- **Field data.** Lighthouse figures are single lab runs on a busy local machine, not Core Web Vitals from real users.
- **Rankings.** No claim is made about rankings or traffic. The keyword targets are hypotheses based on what the site offers; no search volumes were measured.

## Commits

```
a3df9e5 fix(seo): derive every URL from one site config
56684d1 feat(content): confirmed company details, six service areas, Q&A and case-study copy
975e976 feat(schema): one JSON-LD graph per page with stable ids
52ac296 feat(nav): real routes in the header, a footer with links and social profiles
833ca2c feat(pages): unique metadata, one H1 and no placeholders on every page
9cb44a0 style: dark-theme styles for inner pages and the new blocks
f33435e feat(assets): brand icons, manifest, lighter OG image, case-study previews, llms.txt
9ebaea7 test: SEO unit tests and an HTTP verification script
a075cb4 perf: keep site content out of client bundles
daa124e fix(nav): use the menu button below 1024px so seven links never overflow
70b8d4d chore(lint): allow condition ? ok : fail checks in the verify script
```

Plus one commit adding this changelog, `OWNER-TASKS.md` and `OFFPAGE-PLAYBOOK.md`.

The commits are grouped by concern, so an intermediate commit may not build on its own. The tip of the branch builds and passes every check above.
