/**
 * Every word, number and link on the site lives in this file.
 *
 * - `null` or `[]` means "not provided yet". The site shows a bracketed
 *   placeholder such as [Project name] and never invents a replacement.
 * - Run `npm run placeholders` to list everything still to fill in.
 * - Keep this file free of imports so scripts can read it directly.
 */

export interface Img {
  /** Path under /public, e.g. "/work/acme-desktop.webp" */
  src: string;
  alt: string;
  /** Pixel size of the file itself */
  width: number;
  height: number;
}

export const projectTypes = ["Website", "Web app", "SaaS", "AI"] as const;
export type ProjectType = (typeof projectTypes)[number];

export interface Project {
  /** URL slug: /work/<slug>. Use lowercase words and hyphens. */
  slug: string;
  name: string | null;
  client: string | null;
  type: ProjectType | null;
  year: string | null;
  /** Your part in the project, e.g. "Design, build, hosting" */
  role: string | null;
  /** One line, shown on cards and in search results */
  summary: string | null;
  /** Real, working https:// address of the finished site */
  liveUrl: string | null;
  stack: string[];
  /** Wide image for cards and the case-study hero (a real screenshot) */
  cover: Img | null;
  desktop: Img | null;
  mobile: Img | null;
  /** Paragraphs. What the client needed. */
  brief: string[];
  /** Paragraphs. What you did and why. */
  approach: string[];
  /** Only real, measured outcomes, each with where the number came from. */
  results: { label: string; value: string; source: string }[];
}

export interface TeamMember {
  slug: string;
  name: string | null;
  role: string | null;
  /** Degrees, certifications, prior roles: only what can be verified. */
  credentials: string[];
  bio: string | null;
  photo: Img | null;
  links: { label: string; url: string }[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  whoFor: string;
  howWeWork: string;
}

/* ─────────────────────────────────────────────────────────────
 * Company
 * ───────────────────────────────────────────────────────────── */

export const site = {
  name: "OrbiTech",
  /** Legal entity name for the privacy page and footer, e.g. "OrbiTech Ltd" */
  legalName: null as string | null,
  /** 1–2 lines on what you do. Used in search results and the footer. */
  description:
    "OrbiTech designs, builds and looks after websites, web apps and AI automations.",
  /** Public address of the live site, no trailing slash. Confirm before launch. */
  url: "https://orbitech.dev",
  email: null as string | null,
  /** City and country */
  location: null as string | null,
  /** Booking page, e.g. a Cal.com or Calendly link. */
  booking: {
    url: null as string | null,
    /** true when the booking page allows being shown inside an iframe */
    embed: false,
  },
  /** Company profiles that belong to you, e.g. { label: "LinkedIn", url: "…" } */
  profiles: [] as { label: string; url: string }[],
  /** Update when you publish. Fixed here because pages are prerendered. */
  copyrightYear: 2026,
};

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

/* ─────────────────────────────────────────────────────────────
 * Home page copy
 * ───────────────────────────────────────────────────────────── */

export const home = {
  headline: "Websites and software, built layer by layer.",
  lede: "OrbiTech designs the page, builds what sits behind it and looks after it once it is live. Content, structure, behaviour and hosting each get their own attention.",
  statement:
    "A website is a stack of decisions: what it says, how it is laid out, how it behaves and where it runs. We make each one on purpose, and show you the result at every step.",
  closing: {
    heading: "Have a project in mind?",
    text: "Tell us what you want to build. We reply by email and can arrange a short call.",
  },
};

/* ─────────────────────────────────────────────────────────────
 * Services (draft copy carried over and tightened from your old site)
 * ───────────────────────────────────────────────────────────── */

export const services: Service[] = [
  {
    id: "websites",
    title: "Websites",
    summary: "Marketing and brand sites you can edit yourself.",
    includes: [
      "Design and build in Next.js",
      "A content system your team can edit without a developer",
      "Performance and accessibility checks before launch",
      "Structured data and technical SEO",
    ],
    whoFor:
      "Teams that need a site that loads quickly, reads clearly and doesn’t need a developer for every change to the text.",
    howWeWork:
      "We start from the page structure and your real content, design in the browser, and send a working preview link at the end of every two-week cycle.",
  },
  {
    id: "web-apps",
    title: "Web apps and SaaS",
    summary: "Software people log into: accounts, data and the screens around them.",
    includes: [
      "Accounts, roles and permissions",
      "Subscription billing with Stripe",
      "Dashboards, reports and exports",
      "Automated tests for the parts that must not break",
    ],
    whoFor:
      "Founders and teams turning a process or a product idea into software that several people use every day.",
    howWeWork:
      "We build the smallest version that proves the idea, put it in front of real users, and grow it from what we learn.",
  },
  {
    id: "ai",
    title: "AI automation and assistants",
    summary: "Language-model tools for repetitive work, with a person checking the result.",
    includes: [
      "Extracting and sorting information from documents",
      "Assistants that answer from your own documents and cite them",
      "A review queue for anything uncertain",
      "Tracking of accuracy, usage and cost",
    ],
    whoFor:
      "Teams with repetitive, document-heavy work where a person still needs to approve the outcome.",
    howWeWork:
      "We test against your own examples first and only automate the steps that hold up. Everything the system does is logged so it can be reviewed.",
  },
  {
    id: "integrations",
    title: "Integrations and backend",
    summary: "Dependable connections between your tools, and the services behind them.",
    includes: [
      "CRM sync with HubSpot, Salesforce or your own system",
      "Payment and webhook handling that survives retries",
      "APIs, queues and scheduled jobs",
      "Database design in PostgreSQL",
    ],
    whoFor:
      "Teams whose tools don’t talk to each other, or whose data has outgrown a spreadsheet.",
    howWeWork:
      "We map what moves where before writing code, then build in small steps with tests, so each connection can be checked on its own.",
  },
  {
    id: "cloud",
    title: "Cloud and DevOps",
    summary: "Hosting, deployment and monitoring set up properly, in your own accounts.",
    includes: [
      "Infrastructure written as code",
      "Automated deployment with preview links",
      "Error tracking and alerts",
      "Secrets in a managed vault, least-privilege access",
    ],
    whoFor:
      "Teams who want releases to be routine and who need to own their infrastructure.",
    howWeWork:
      "Everything is created under accounts you own, documented as we go, and handed over with a walkthrough.",
  },
  {
    id: "care",
    title: "Care and maintenance",
    summary: "Updates, fixes and small improvements after launch.",
    includes: [
      "Dependency updates and security patches",
      "Uptime and error monitoring",
      "A monthly block of time for improvements",
      "A named person to contact",
    ],
    whoFor:
      "Anyone who has launched something and doesn’t want it to quietly fall behind.",
    howWeWork:
      "Terms, response times and what is covered are written into the proposal before work starts.",
  },
];

export const process: { title: string; text: string }[] = [
  {
    title: "Scoping call",
    text: "Thirty minutes on the problem, the constraints and the timeline. No preparation needed.",
  },
  {
    title: "Written proposal",
    text: "Fixed-scope milestones with a price for each, and a plain list of what is out of scope.",
  },
  {
    title: "Two-week build cycles",
    text: "Every cycle ends with a working preview link and a short review with the people writing the code.",
  },
  {
    title: "Handover",
    text: "Code, infrastructure accounts and documentation are yours. Ongoing support is optional.",
  },
];

export const securityPractices: string[] = [
  "Work lives in your repository and services run in your cloud accounts from the first day.",
  "Access is least-privilege and is removed when the engagement ends.",
  "Secrets are kept in a managed vault, never in source code or chat.",
  "Dependencies are audited on every release, with automated update checks.",
  "Sign-in, input validation and rate limiting are reviewed against the OWASP Top 10 before launch.",
  "Data is encrypted in transit, and at rest wherever the platform supports it.",
  "A mutual NDA is available before you share anything sensitive.",
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Who owns the code and the accounts?",
    answer:
      "You do. Work happens in your Git organisation and cloud services are set up under your own accounts. Nothing is licensed back to you, and there is no lock-in.",
  },
  {
    question: "How long does a project take?",
    answer:
      "It depends on the scope. After a scoping call, the written proposal gives a timeline for each milestone. The estimator on the contact page gives a rough range to plan with.",
  },
  {
    question: "How do you approach security?",
    answer:
      "As part of the build, not a phase at the end: least-privilege access, secrets in a vault, dependency audits on every release and a review against the OWASP Top 10 before launch. Formal compliance such as SOC 2, HIPAA or PCI DSS needs its own audit. If you need one, we scope that work with you openly.",
  },
  {
    question: "Do you support the software after launch?",
    answer:
      "Yes. Every project includes a period for post-launch fixes, and ongoing care plans are available. The terms are written into the proposal.",
  },
  {
    question: "How will we communicate?",
    answer:
      "Through a shared Slack or Discord channel, a short review at the end of each two-week cycle, and a task board you can see at any time. You talk directly to the people doing the work.",
  },
];

/* ─────────────────────────────────────────────────────────────
 * Work: add one entry per finished project.
 * Three empty slots are included so every page can be reviewed.
 * ───────────────────────────────────────────────────────────── */

const emptyProject = {
  name: null,
  client: null,
  type: null,
  year: null,
  role: null,
  summary: null,
  liveUrl: null,
  stack: [] as string[],
  cover: null,
  desktop: null,
  mobile: null,
  brief: [] as string[],
  approach: [] as string[],
  results: [] as Project["results"],
};

export const projects: Project[] = [
  {
    ...emptyProject,
    slug: "orbit-operations",
    name: "OrbitOS",
    type: "SaaS",
    summary:
      "A CRM workspace that keeps customer relationships, deals and tasks together, with an AI copilot that flags stalled deals.",
    liveUrl: "https://orbit-operations.vercel.app/",
    cover: {
      src: "/work/orbit-operations-desktop.webp",
      alt: "OrbitOS landing page showing a live deal pipeline and the AI copilot panel",
      width: 1440,
      height: 900,
    },
    desktop: {
      src: "/work/orbit-operations-desktop.webp",
      alt: "OrbitOS on desktop: pipeline value, open deals and the Kanban board",
      width: 1440,
      height: 900,
    },
    mobile: {
      src: "/work/orbit-operations-mobile.webp",
      alt: "OrbitOS on a phone: headline and sign-up buttons",
      width: 390,
      height: 844,
    },
  },
  {
    ...emptyProject,
    slug: "property-management",
    name: "Orbitech Property Management",
    type: "SaaS",
    summary:
      "A connected workspace for properties, leasing, maintenance and payments, from first inquiry to the last repair update.",
    liveUrl: "https://propertymanagementsystem-six.vercel.app/",
    cover: {
      src: "/work/property-management-desktop.webp",
      alt: "Property management workspace showing the Cedar Lane Residences property view",
      width: 1440,
      height: 900,
    },
    desktop: {
      src: "/work/property-management-desktop.webp",
      alt: "Property management workspace on desktop with property and unit overview",
      width: 1440,
      height: 900,
    },
    mobile: {
      src: "/work/property-management-mobile.webp",
      alt: "Property management workspace on a phone",
      width: 390,
      height: 844,
    },
  },
  { slug: "project-3", ...emptyProject },
  {
    ...emptyProject,
    slug: "n8n-email-marketing-workflow",
    name: "n8n Email Marketing Workflow",
    type: "AI",
    summary:
      "An n8n workflow that connects campaign inputs, audience data and email delivery into one reviewable marketing flow.",
    stack: ["n8n", "Email automation", "Webhooks"],
    cover: {
      src: "/work/n8n-logo-card.webp",
      alt: "n8n logo centered on a warm neutral background",
      width: 1597,
      height: 897,
    },
    desktop: {
      src: "/work/n8n-logo-card.webp",
      alt: "n8n logo centered on a warm neutral background",
      width: 1597,
      height: 897,
    },
    brief: [
      "Create a repeatable email-marketing workflow without moving campaign data manually between tools.",
      "Keep each automation step visible so a person can review the message and audience before delivery.",
    ],
    approach: [
      "We map the workflow as small, inspectable n8n nodes: input, audience preparation, message handling, approval and delivery.",
      "The workflow is structured so integrations can be swapped or extended without hiding the decision points inside one large automation.",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
 * Studio
 * ───────────────────────────────────────────────────────────── */

export const studio = {
  /** The story of how and why the company started. Two or three short paragraphs. */
  story: [] as string[],
  workingAgreements: [
    "You own the code, the repositories and the accounts from the first day.",
    "You see working software every two weeks, not at the end.",
    "You talk to the people doing the work, with no account manager in between.",
    "Prices are written down per milestone before work begins.",
  ],
};

export const team: TeamMember[] = [
  { slug: "member-1", name: null, role: null, credentials: [], bio: null, photo: null, links: [] },
  { slug: "member-2", name: null, role: null, credentials: [], bio: null, photo: null, links: [] },
  { slug: "member-3", name: null, role: null, credentials: [], bio: null, photo: null, links: [] },
];

export const skills: { discipline: string; tools: string[] }[] = [
  {
    discipline: "Design and front end",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "WebSockets"],
  },
  {
    discipline: "Back end and APIs",
    tools: ["Node.js", "NestJS", "Python", "FastAPI", "Go", "GraphQL", "REST", "Kafka"],
  },
  {
    discipline: "Data",
    tools: ["PostgreSQL", "Redis", "pgvector", "TimescaleDB", "Prisma", "MongoDB"],
  },
  {
    discipline: "AI",
    tools: ["OpenAI API", "Anthropic API", "LangChain", "LlamaIndex", "Hugging Face"],
  },
  {
    discipline: "Cloud and DevOps",
    tools: ["AWS", "Google Cloud", "Vercel", "Docker", "Kubernetes", "Cloudflare", "GitHub Actions", "Terraform"],
  },
];

/** Add only real testimonials, with permission. The section stays hidden while this is empty. */
export const testimonials: Testimonial[] = [];

/* ─────────────────────────────────────────────────────────────
 * Contact & estimator
 * ───────────────────────────────────────────────────────────── */

export const contactOptions = {
  projectTypes: [
    "Website",
    "Web app or SaaS",
    "AI automation or assistant",
    "Integrations and backend",
    "Cloud and DevOps",
    "Care and maintenance",
    "Something else",
  ],
  budgets: ["Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000–$100,000", "Over $100,000", "Not sure yet"],
  timelines: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Flexible"],
};

export const nextSteps = [
  "We reply by email, usually with a few questions.",
  "A thirty-minute call to agree the scope.",
  "A written proposal with a fixed price for each milestone.",
];

/** Indicative figures for the estimator. These are placeholders: confirm or replace before launch. */
export const estimator = {
  projectTypes: [
    { id: "website", name: "Website", basePrice: 5000, baseWeeks: 3, desc: "Brand or marketing site with a CMS.", enquiry: "Website" },
    { id: "saas", name: "Web app or SaaS", basePrice: 12000, baseWeeks: 6, desc: "Multi-user app with billing and teams.", enquiry: "Web app or SaaS" },
    { id: "ai-agent", name: "AI automation or assistant", basePrice: 10000, baseWeeks: 5, desc: "Retrieval, workflows and review steps.", enquiry: "AI automation or assistant" },
    { id: "backend", name: "Integrations and backend", basePrice: 15000, baseWeeks: 8, desc: "Services, data and third-party APIs.", enquiry: "Integrations and backend" },
  ],
  features: [
    { id: "auth", name: "Sign-in, roles and MFA", price: 1500, weeks: 0.5 },
    { id: "dashboard", name: "Dashboards and reporting", price: 2500, weeks: 1 },
    { id: "ai", name: "AI search over your documents", price: 3500, weeks: 1.5 },
    { id: "payments", name: "Subscription billing", price: 2000, weeks: 0.5 },
    { id: "crm", name: "CRM sync", price: 2000, weeks: 0.5 },
    { id: "devops", name: "CI/CD and cloud setup", price: 2500, weeks: 1 },
  ],
  timelines: [
    { id: "express", name: "Expedited", multiplier: 1.25, timeFactor: 0.7 },
    { id: "standard", name: "Standard", multiplier: 1.0, timeFactor: 1.0 },
    { id: "extended", name: "Phased rollout", multiplier: 1.15, timeFactor: 1.3 },
  ],
};

/* ─────────────────────────────────────────────────────────────
 * Privacy page (draft: have it reviewed before you publish)
 * ───────────────────────────────────────────────────────────── */

export const privacy = {
  /** How long you keep enquiries, e.g. "12 months". */
  retention: null as string | null,
  /** Who handles privacy questions: an email address. */
  contactEmail: null as string | null,
  /** When this page's text was last reviewed, e.g. "7 October 2026". */
  updated: null as string | null,
  /** Who delivers the contact-form email. Matches the code; change both if you switch provider. */
  emailProvider: "Resend",
  /** Where the site is hosted, e.g. "Vercel". */
  hosting: null as string | null,
};
