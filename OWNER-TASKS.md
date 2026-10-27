# Owner tasks

Things that cannot be done in code, or that need your decision. Work top to bottom: the first four matter most.

Date of this list: 27 October 2026. Branch: `seo-aeo-geo` (not pushed, merged or deployed).

---

## 1. Set `NEXT_PUBLIC_SITE_URL` in Vercel (Production and Preview)

The code falls back to `https://theorbitechsolution.com` when the variable is missing, so this is a safety step, not a blocker.

1. Open the project in the Vercel dashboard, then **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_SITE_URL` with the value `https://theorbitechsolution.com` (no trailing slash).
3. Tick **Production** and **Preview**. Save.
4. If a variable with an `orbitech.dev` value exists anywhere in the project settings, delete it.
5. Redeploy. The variable is read at build time, so an old deployment does not pick it up.

Check after deploying:

```bash
curl -s https://theorbitechsolution.com/ | grep -o '<link rel="canonical"[^>]*>'
```

Expected: `<link rel="canonical" href="https://theorbitechsolution.com"/>`

## 2. Add `www` and redirect it to the apex domain

`www.theorbitechsolution.com` does not resolve today.

1. Vercel: **Settings → Domains → Add** `www.theorbitechsolution.com`. When asked, choose **Redirect to theorbitechsolution.com** (permanent, 308).
2. At your DNS provider, add the record Vercel shows. It is usually `CNAME www → cname.vercel-dns.com`.
3. Wait for Vercel to show the domain as valid and the certificate as issued.

Check:

```bash
curl -sI https://www.theorbitechsolution.com/ | grep -i -E "^(HTTP|location)"
```

Expected: a `308` with `location: https://theorbitechsolution.com/`.

## 3. Google Search Console

1. Go to <https://search.google.com/search-console> and add a **Domain** property for `theorbitechsolution.com`.
2. Copy the TXT record Google gives you and add it at your DNS provider (host `@`). Click **Verify**. DNS can take up to a few hours.
3. **Sitemaps** → submit `https://theorbitechsolution.com/sitemap.xml`.
4. **URL inspection** → inspect and **Request indexing** for:
   - `https://theorbitechsolution.com`
   - `https://theorbitechsolution.com/services`
   - `https://theorbitechsolution.com/work`
   - `https://theorbitechsolution.com/studio`
   - `https://theorbitechsolution.com/contact`
5. In URL inspection, check that **User-declared canonical** and **Google-selected canonical** both show our own URL. Before this change they pointed at `orbitech.dev`. Google may take days or weeks to recrawl.
6. Record a baseline now (see the measurement plan in `OFFPAGE-PLAYBOOK.md`).

## 4. Bing Webmaster Tools and IndexNow

Copilot draws on the Bing index, and some other AI search products rely on it too.

1. Go to <https://www.bing.com/webmasters>. Choose **Import from Google Search Console** (fastest), or add the site and verify with a DNS CNAME or TXT record.
2. Submit `https://theorbitechsolution.com/sitemap.xml`.
3. Optional: **IndexNow**. Bing Webmaster Tools can generate a key. Using it means adding a key file to `public/` and pinging after each deploy. Ask for this as a separate change if you want it; it is not in this branch.

## 5. Decide the AI training-crawler policy

Today `robots.txt` has one open rule for all crawlers. Nothing changes until you decide.

- **Answer and search crawlers** stay allowed in every option: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot and Claude-SearchBot. They decide whether assistants can find and cite the site.
- **Training-only crawlers** are the open question: GPTBot (OpenAI), Google-Extended (Gemini training), CCBot (Common Crawl).
  - **Allow** (current default): no change.
  - **Block**: tell me, and I will add `Disallow: /` groups for those three user agents in `app/robots.ts`. Blocking them does not remove you from Google Search or from assistants' live search.

## 6. Email and domain alignment

- The site now uses only `nova@theorbitechsolution.com`. The old placeholder `hello@orbitechsolutions.com` is gone.
- If `orbitechsolutions.com` (no "the") is a domain you own, redirect it to `https://theorbitechsolution.com`. Do not publish it anywhere else, so search engines and AI systems see one domain.
- Make sure `nova@theorbitechsolution.com` actually receives mail. Its MX records need to be set at your DNS provider.
- The contact form sends nothing until `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set in Vercel (see `.env.example`). Until then it tells visitors to email instead.

## 7. Inputs still missing

None of these are guessed. The pages leave them out until you supply them.

| Missing | Where it goes | Effect today |
|---|---|---|
| Enquiry **retention period**, e.g. "12 months" | `privacy.retention` in `content/site.ts` | `/privacy` is **noindex** and left out of the sitemap. The retention paragraph is hidden. Once you add a value, the page becomes indexable automatically. |
| **Booking link** (Cal.com or Calendly) | `site.booking.url` | The "Book a call" buttons and the booking box are hidden. |
| **Legal entity name**, if different from the brand | `site.legalName` | The privacy page names "The OrbiTech Solutions". |
| **Team members**: real names, roles and short bios | `team` | Nobody is shown and there is no Person schema. Three stock portraits in `public/team/` are unused; delete them or replace them with real photos. |
| **Real logo file**, if you have one | replace `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` | The icons are drawn from the header's brand mark by `scripts/make-icons.mjs`. Please confirm they are acceptable. |
| **Case-study facts**: client, year, role, stack, real results | each project in `projects` | The rows are hidden. Add only what is true. Results need a source. |
| **X (Twitter) profile**, if any | `site.social` with `id: "x"` | No `twitter:site` tag, and no X link. |
| **Street address**, only if you want a Google Business Profile | `site.location` | Schema publishes only "New York, US". |

## 8. Things to confirm (already on the site)

These were on the site before this change, or written from what the site states. Please confirm they are true.

- **LinkedIn URL.** You gave `https://www.linkedin.com/in/theorbitechsolution/`. `/in/` is the path for a **personal** profile; company pages use `/company/<name>/`. If a company page exists, send its URL and it will replace this one in the footer, the contact page and `sameAs`.
- **Location spelling.** You wrote "NewYork, US". The site uses "New York, US".
- **Founding date.** 26 October 2025 is published in schema (`foundingDate: 2025-10-26`) and on `/studio` as "October 2025".
- **Estimator figures.** The prices and week counts in `estimator` were marked as placeholders, so the estimator is **hidden**. Once every figure is checked, set `estimator.confirmed` to `true` to show it again.
- **Carried-over claims.** Two-week build cycles and fixed prices per milestone (`studio.workingAgreements`, `nextSteps`). The security practices (`securityPractices`). The skills list (`skills`).
- **Default social image.** `public/og/default.png` still reads "OrbiTech: Websites and software, built layer by layer". That is the old brand and positioning. It was only compressed, not redesigned. Replace it with a 1200×630 image showing "The OrbiTech Solutions" and "AI Automation & Web Development", keeping the same file name.
- **"How we help" pills on the home page.** These say Discover, Design, Build, Improve, while the process says Discover, Define, Prototype, Build and integrate, Validate. They were left as designed. Say if you want them aligned.

## 9. Optional: move the demos to your own domain

The demos live on `*.vercel.app`, so links to them do not strengthen your domain.

1. In each demo's Vercel project: **Settings → Domains → Add**, for example `demo-crm.theorbitechsolution.com` or `aidochat.theorbitechsolution.com`.
2. Add the CNAME records Vercel shows.
3. Update each `liveUrl` in `content/site.ts`, and the allowed hosts in `scripts/verify-seo.mjs`.

## 10. Tidy-up you may want (not done, needs your say)

- `.next-audit/` is a full build output committed to git (586 files, including old `orbitech.dev` URLs). It is not served by the site. Consider `git rm -r --cached .next-audit` and adding it to `.gitignore`.
- `components/Hero.tsx`, `ProjectsSection.tsx`, `ServicesSection.tsx`, `Wordmark.tsx`, `components/hero/` and `components/scenes/` belong to the previous design and are unused.
- The Playwright specs in `tests/e2e/` still describe the previous design: old titles, `/work/project-3`, `header.nav`. They were already out of date before this branch, and were not run.

## 11. Next.js security advisory

Every `next build` on this project, on `main` too, first stops with **"Your version of Next.js is affected by a known security vulnerability. We strongly recommend you upgrade Next.js."** It continues when the command is run again. The project is on Next.js 16.4.0. The advisory is listed at <https://registry.npmjs.org/-/npm/v1/security/advisories/bulk>. Upgrading is a separate change to test on its own branch; it was not done here.

## After deployment: repeat the checks against the live site

```bash
node scripts/verify-seo.mjs https://theorbitechsolution.com
```

```bash
curl -s https://theorbitechsolution.com/robots.txt
```

```bash
curl -s https://theorbitechsolution.com/sitemap.xml
```

```bash
curl -s https://theorbitechsolution.com/ | grep -c "orbitech\.dev"
```

The last command should print `0`. Then paste a few URLs into <https://search.google.com/test/rich-results> and <https://validator.schema.org/>, and check the social previews with LinkedIn Post Inspector (<https://www.linkedin.com/post-inspector/>) and the Facebook Sharing Debugger (<https://developers.facebook.com/tools/debug/>).
