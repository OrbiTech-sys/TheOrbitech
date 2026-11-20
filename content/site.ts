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

export const projectTypes = ["Restaurant", "Salon", "AI", "SaaS", "Website", "Web app"] as const;
export type ProjectType = (typeof projectTypes)[number];

/** One live sample inside a project. Its real address lives in lib/demo-targets.ts, on the server only. */
export interface Demo {
  /** Used in /demo/<id>. Lowercase words and hyphens. */
  id: string;
  name: string;
  /** Where the demo business is set */
  place: string;
  summary: string;
  /** Short and factual: what a visitor can try in the demo */
  highlights: string[];
  cover: Img;
  mobile: Img;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Project {
  /** URL slug: /work/<slug>. Use lowercase words and hyphens. */
  slug: string;
  name: string | null;
  /** Shorter name for the footer and "next project" links. Falls back to `name`. */
  shortName?: string;
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
  /** Gated live samples. Visitors confirm their email before one opens. */
  demos: Demo[];
  /** Plain questions and answers: shown on the page and in search results. */
  faqs: Faq[];
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
  demos: [] as Demo[],
  faqs: [] as Faq[],
};

const DEMO_NOTE =
  "Open any demo, confirm your email with a 6-digit code, and it opens. The code works for 10 minutes, and one confirmation opens every demo for 24 hours.";

export const projects: Project[] = [
  {
    ...emptyProject,
    slug: "restaurant-website-demos",
    shortName: "Restaurant website demos",
    name: "Restaurant Website Design: 3 Custom Food Ordering Demos",
    client: "Self-initiated demos",
    type: "Restaurant",
    year: "2026",
    role: "Design and build",
    summary:
      "Three custom restaurant website demos with menus, delivery-area checks and a cart: a smash-burger shop, a pizza and shawarma kitchen, and a three-branch burger brand.",
    cover: {
      src: "/work/curly-co-desktop.webp",
      alt: "Curly Co. restaurant website demo with a smash burger, delivery and pickup choice",
      width: 1440,
      height: 900,
    },
    brief: [
      "Restaurant owners tend to ask the same thing before they commit to a website: what would it look like for my menu, my area and the way my customers order? These three demos answer that with working examples instead of mock-ups.",
      "They are demo businesses, not clients. Each is set in Lahore and has its own menu, brand and delivery rules, so you can compare three different directions side by side.",
    ],
    approach: [
      "Every demo shares the same foundation: a menu you can browse by category, deals and combos, a choice between delivery and pickup, a check for the delivery area and a cart. Each is then styled for its own brand: light with a red accent for a smash-burger shop, dark with a red accent for a pizza and shawarma kitchen, and black with orange for a multi-branch burger brand.",
      "Open each demo and try the ordering flow yourself. If one is close to what you need, we adapt it to your menu, prices, locations and delivery area.",
    ],
    demos: [
      {
        id: "curly-co",
        name: "Curly Co.",
        place: "Model Town, Lahore",
        summary: "Smash burgers and curly fries, with best sellers, combos and a choice of delivery or pickup.",
        highlights: ["Menu categories and best sellers", "Featured combos and deals", "Delivery within 5 km, or pickup"],
        cover: {
          src: "/work/curly-co-desktop.webp",
          alt: "Curly Co. demo: a smash burger and curly fries with an order-method choice",
          width: 1440,
          height: 900,
        },
        mobile: { src: "/work/curly-co-mobile.webp", alt: "Curly Co. demo on a phone", width: 390, height: 844 },
      },
      {
        id: "food-chain",
        name: "Food Chain",
        place: "Iqbal Park, Lahore",
        summary: "Pizza, burgers and shawarma until 5:00 am, with an address check for delivery and a cart.",
        highlights: ["Seven menu sections", "Delivery or pickup chosen up front", "Address check for the 5 km delivery area"],
        cover: {
          src: "/work/food-chains-desktop.webp",
          alt: "Food Chain demo: pizza, burger and shawarma with a delivery or pickup choice",
          width: 1440,
          height: 900,
        },
        mobile: { src: "/work/food-chains-mobile.webp", alt: "Food Chain demo on a phone", width: 390, height: 844 },
      },
      {
        id: "mad-mighty",
        name: "MAD: Mighty & Delicious",
        place: "Three branches, Lahore",
        summary: "A bold burger, wrap and pizza brand with a filterable menu and a pick-your-branch flow.",
        highlights: ["Menu filtered by category", "Deals and combos", "Three branches to collect from"],
        cover: {
          src: "/work/mad-mighty-desktop.webp",
          alt: "MAD Mighty & Delicious demo: a large burger beside the headline Big Cravings, Bigger Bites",
          width: 1440,
          height: 900,
        },
        mobile: { src: "/work/mad-mighty-mobile.webp", alt: "MAD Mighty & Delicious demo on a phone", width: 390, height: 844 },
      },
    ],
    faqs: [
      {
        q: "What are these restaurant website demos?",
        a: "They are three sample websites OrbiTech built to show restaurant owners what a custom ordering site can look like: a smash-burger shop, a pizza and shawarma kitchen and a three-branch burger brand. The businesses shown are examples.",
      },
      {
        q: "What can a restaurant website include?",
        a: "In these demos: a menu you can browse by category, deals and combos, a choice between delivery and pickup, a delivery-area check and a cart. Each one is styled for its own brand.",
      },
      { q: "How do I open the live demos?", a: DEMO_NOTE },
      {
        q: "Can OrbiTech build a site like this for my restaurant?",
        a: "Yes. Tell us about your menu, location and how customers order, and we reply by email with what is possible and a written proposal.",
      },
    ],
  },
  {
    ...emptyProject,
    slug: "salon-website-demo",
    shortName: "Salon website demo",
    name: "Hair Salon Website Design: Custom Booking Demo",
    client: "Self-initiated demo",
    type: "Salon",
    year: "2026",
    role: "Design and build",
    summary:
      "A custom hair salon website demo with a day-and-time request picker, a service price list, featured transformations and artist profiles.",
    cover: {
      src: "/work/salon-desktop.webp",
      alt: "Maison Muse Hair Atelier demo: a salon interior with the headline Beautiful Hair, Unmistakably You",
      width: 1440,
      height: 900,
    },
    desktop: { src: "/work/salon-desktop.webp", alt: "Maison Muse Hair Atelier demo on desktop", width: 1440, height: 900 },
    mobile: { src: "/work/salon-mobile.webp", alt: "Maison Muse Hair Atelier demo on a phone", width: 390, height: 844 },
    brief: [
      "A salon website has two jobs: show the quality of the work and make it easy to ask for a time. This demo, Maison Muse Hair Atelier, is a sample for a hair salon.",
      "Names, prices and reviews in the demo are illustrative, and nothing a visitor requests is actually booked.",
    ],
    approach: [
      "The page opens on the salon itself, then moves through a day-and-time picker, services with prices, featured transformations and artist profiles. The picker opens a request form, so a visitor asks for a time rather than reserving one.",
      "If you run a salon, we adapt this to your services, prices, team and booking process.",
    ],
    demos: [
      {
        id: "maison-muse",
        name: "Maison Muse Hair Atelier",
        place: "Demo salon",
        summary: "Cuts, colour, treatments, extensions and bridal styling, built around a private consultation at every visit.",
        highlights: ["Day-and-time request picker", "Services and pricing", "Artist profiles and a gallery"],
        cover: { src: "/work/salon-desktop.webp", alt: "Maison Muse Hair Atelier demo on desktop", width: 1440, height: 900 },
        mobile: { src: "/work/salon-mobile.webp", alt: "Maison Muse Hair Atelier demo on a phone", width: 390, height: 844 },
      },
    ],
    faqs: [
      {
        q: "What is this salon website demo?",
        a: "A sample hair salon website made by OrbiTech. It shows a day-and-time request picker, a service price list, featured transformations and artist profiles. The salon, names, prices and reviews are illustrative.",
      },
      { q: "How do I open the live demo?", a: DEMO_NOTE },
      {
        q: "Can OrbiTech build a salon website like this?",
        a: "Yes. Tell us about your services, team and how clients book, and we reply by email with what is possible and a written proposal.",
      },
    ],
  },
  {
    ...emptyProject,
    slug: "ai-voice-receptionist",
    shortName: "AI voice receptionist",
    name: "AI Voice Receptionist for Appointment-Based Businesses",
    client: "OrbiTech product demo",
    type: "AI",
    year: "2026",
    role: "Design and build",
    summary:
      "An AI receptionist that answers the phone, gives callers the hours and prices you set, books an appointment on your calendar and sends you a summary.",
    cover: {
      src: "/work/ai-voice-desktop.webp",
      alt: "AI receptionist landing page with the headline Stop sending callers to voicemail and a service bell",
      width: 1440,
      height: 900,
    },
    desktop: { src: "/work/ai-voice-desktop.webp", alt: "AI receptionist landing page on desktop", width: 1440, height: 900 },
    mobile: { src: "/work/ai-voice-mobile.webp", alt: "AI receptionist landing page on a phone", width: 390, height: 844 },
    brief: [
      "Appointment-based businesses lose bookings when the phone rings after hours. This demo is an AI receptionist for those businesses, with a landing page that explains how it works.",
    ],
    approach: [
      "The page walks through one call from start to finish, using a made-up dental office as the example: the phone rings after closing, the receptionist answers from the facts the owner set, books a real slot and sends the owner a summary.",
      "It also says plainly where the receptionist stops, what you pay for and what you don't, so an owner can judge it before trying a test call.",
    ],
    demos: [
      {
        id: "ai-voice",
        name: "OrbiTech AI Receptionist",
        place: "Product landing page",
        summary: "Answers calls, gives hours and prices, books real appointment slots and sends the owner a summary.",
        highlights: ["A walk-through of one example call", "Clear limits on what it does", "Pricing and common questions"],
        cover: { src: "/work/ai-voice-desktop.webp", alt: "AI receptionist landing page on desktop", width: 1440, height: 900 },
        mobile: { src: "/work/ai-voice-mobile.webp", alt: "AI receptionist landing page on a phone", width: 390, height: 844 },
      },
    ],
    faqs: [
      {
        q: "What is an AI voice receptionist?",
        a: "Software that answers your business phone, gives callers the hours, prices and other facts you set, books an appointment on your calendar and tells you what happened.",
      },
      {
        q: "Who is it for?",
        a: "Businesses that run on appointments. The example call on the demo page is a dental office. The demo page says it is in early access for US appointment-based businesses.",
      },
      { q: "How do I open the live demo?", a: DEMO_NOTE },
    ],
  },
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
    mobile: { src: "/work/orbit-operations-mobile.webp", alt: "OrbitOS on a phone: headline and sign-up buttons", width: 390, height: 844 },
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
    mobile: { src: "/work/property-management-mobile.webp", alt: "Property management workspace on a phone", width: 390, height: 844 },
  },
  { slug: "project-3", ...emptyProject },
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
