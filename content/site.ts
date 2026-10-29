/**
 * Every word, number and link on the site lives in this file.
 *
 * - `null` or `[]` means "not provided yet". The page leaves that field out and
 *   never invents a replacement. A page that cannot work without a value stays
 *   out of search results until it is supplied (see `privacy.retention`).
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
  /** How to read this work: a public demo, or a private project with no link. */
  kind: "Live demo" | "Private project";
  /** Page title without the brand suffix, written for search. */
  seoTitle: string;
  /** Meta description, 150–160 characters, written for search. */
  seoDescription: string;
  /** What the project does, restated from what the demo or the project text shows. */
  features: string[];
  /** Neutral note shown beside the demo link, e.g. about a slow first load. */
  demoNote: string | null;
  /** The service area this work belongs to: an id from `services`. */
  serviceId: string;
  /** ISO date the page content was last meaningfully changed. */
  updated: string;
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
  /** Anchor on /services and in links from the home page: /services#<id> */
  id: string;
  number: string;
  /** Module name, shown on the home page */
  title: string;
  /** Search-phrased heading used on /services */
  heading: string;
  summary: string;
  includes: string[];
  /** One sentence for the Service structured data */
  serviceType: string;
}

/* ─────────────────────────────────────────────────────────────
 * Company
 * ───────────────────────────────────────────────────────────── */

export const site = {
  /** Exact brand form. Use this in titles, headings, schema and the footer. */
  name: "The OrbiTech Solutions",
  /** Short form, only after the full name has been introduced. */
  shortName: "OrbiTech",
  /** Other spellings people use. Listed in schema as alternateName. */
  alternateNames: ["OrbiTech", "OrbiTech Solutions"],
  /** Legal entity name for the privacy page and footer, e.g. "OrbiTech Ltd" */
  legalName: null as string | null,
  tagline: "AI Automation & Web Development",
  /**
   * Two-sentence definition: who we are, what we build, who for. Shown as the
   * first paragraph of the home page and reused as the Organization description
   * in structured data, the footer and llms.txt. Keep all of them identical.
   */
  description:
    "The OrbiTech Solutions is a small AI automation and web development studio based in New York, US, working with businesses remotely worldwide. We build AI chatbots and assistants, workflow automation, websites, web apps and data dashboards for businesses that want less repetitive work and faster answers for customers.",
  /**
   * Public address of the live site, no trailing slash. The NEXT_PUBLIC_SITE_URL
   * environment variable overrides it (see lib/site-config.ts).
   */
  url: "https://theorbitechsolution.com",
  email: "nova@theorbitechsolution.com" as string | null,
  /** City and country, as supplied by the owner. */
  location: "New York, US" as string | null,
  /** Where the studio works. The studio works remotely. Used in structured data and the footer. */
  areaServed: "Worldwide",
  /** ISO date the studio was founded. */
  foundingDate: "2025-10-26" as string | null,
  locale: "en_US",
  /** Booking page, e.g. a Cal.com or Calendly link. Not supplied yet. */
  booking: {
    url: null as string | null,
    /** true when the booking page allows being shown inside an iframe */
    embed: false,
  },
  /**
   * Company profiles that belong to you. These are the only profiles rendered in
   * the footer and listed in structured data. `id` picks the icon.
   */
  social: [
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/theorbitechsolution/" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/theorbitechsolution/" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61595882163169" },
  ] as { id: "linkedin" | "instagram" | "facebook" | "x"; label: string; url: string }[],
  /** Update when you publish. Fixed here because pages are prerendered. */
  copyrightYear: 2026,
  /** Real date of the last meaningful content update. Drives dateModified and the sitemap. */
  contentUpdated: "2026-10-27",
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

/** Sections of the home page, linked from the header. */
export const homeAnchors = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Projects", href: "/#projects" },
  { label: "Our approach", href: "/#approach" },
];

/* ─────────────────────────────────────────────────────────────
 * Search titles and descriptions. Titles are 50–60 characters, descriptions
 * 150–160, and no two pages share either. Case studies carry their own in
 * `projects` (seoTitle, seoDescription).
 * ───────────────────────────────────────────────────────────── */

export const meta = {
  home: {
    title: "AI Automation & Web Development | The OrbiTech Solutions",
    description:
      "The OrbiTech Solutions is a small studio that builds AI automation, chatbots and websites for businesses. See live demos and get in touch to scope a project.",
  },
  services: {
    title: "AI Automation, Web & Data Services | The OrbiTech Solutions",
    description:
      "Six service areas: AI automation and chatbots, data analytics, custom web and SaaS, digital strategy, CRM and workflow automation, and AI e-commerce search.",
  },
  work: {
    title: "AI & Web Projects with Live Demos | The OrbiTech Solutions",
    description:
      "Browse four live demos and two private projects from The OrbiTech Solutions: a CRM copilot, property management, AI document chat, AI e-commerce and chatbots.",
  },
  studio: {
    title: "About The OrbiTech Solutions | AI & Web Studio",
    description:
      "The OrbiTech Solutions is a small AI automation and web development studio in New York, US, working remotely worldwide. See how it works and the tools it uses.",
  },
  contact: {
    title: "Contact The OrbiTech Solutions | Start a Project",
    description:
      "Contact The OrbiTech Solutions to start an AI automation, chatbot or web project. Send a message or email nova@theorbitechsolution.com and we reply by email.",
  },
  privacy: {
    title: "Privacy Policy | The OrbiTech Solutions",
    description:
      "What The OrbiTech Solutions collects when you use the contact form on this website, why it is collected, and how to ask for your details to be deleted.",
  },
};

/* ─────────────────────────────────────────────────────────────
 * Home page copy
 * ───────────────────────────────────────────────────────────── */

export const home = {
  /** The H1: says what the company does, in plain words. */
  headline: "AI automation and web development for growing businesses",
  /** Supporting line under the H1 */
  slogan: "Make work smarter. Make growth real.",
  closing: {
    heading: "Have a project in mind?",
    text: "Tell us what slows your team down, where customers need faster answers, or which systems should work better together.",
  },
};

/* ─────────────────────────────────────────────────────────────
 * Services: the six areas shown on the home page and on /services.
 * ───────────────────────────────────────────────────────────── */

export const services: Service[] = [
  {
    id: "ai-solutions",
    number: "01",
    title: "AI Solutions & Intelligent Automation",
    heading: "AI automation, chatbots and AI assistants for business",
    summary:
      "Design and integrate AI systems that help teams answer questions, automate repeatable work, and make better use of business knowledge.",
    serviceType: "AI automation, AI chatbot and AI assistant development",
    includes: [
      "AI integrations: automation, chatbots, and AI assistants",
      "WhatsApp business chatbots for customer service and lead capture",
      "AI agent development",
      "AI-powered business operations",
      "AI customer-support systems",
      "AI sales and marketing assistants",
      "Knowledge-base and RAG systems",
      "Semantic search and retrieval",
      "Intelligent document processing",
      "Voice AI and multilingual AI solutions",
      "AI strategy and implementation",
    ],
  },
  {
    id: "data-analytics",
    number: "02",
    title: "Data Science, Analytics & Business Intelligence",
    heading: "Data analytics and business intelligence dashboards",
    summary: "Turn business data into clear reporting, usable insights, and better-informed decisions.",
    serviceType: "Data analytics, business intelligence and dashboard development",
    includes: [
      "Data analysis and visualization",
      "Data engineering and pipeline development",
      "Business intelligence dashboards",
      "AI-powered analytics and reporting",
      "Predictive analytics solutions",
      "Database design and optimization",
      "Data migration and synchronization",
    ],
  },
  {
    id: "software-engineering",
    number: "03",
    title: "Software & Digital Product Engineering",
    heading: "Custom web, SaaS and MVP development",
    summary: "Build modern digital products, from websites and internal tools to SaaS platforms and MVPs.",
    serviceType: "Custom web development, SaaS and MVP development, website modernization",
    includes: [
      "Modern website development",
      "Custom web application development",
      "E-commerce development",
      "SaaS product development",
      "MVP development and rapid prototyping",
      "API development and third-party integrations",
      "Internal dashboards and business portals",
      "Cloud-based business solutions",
      "Secure business systems",
      "Role-based access control and audit logging",
      "Website modernization, technical SEO, and performance optimization",
    ],
  },
  {
    id: "business-growth",
    number: "04",
    title: "Business Growth & Digital Strategy",
    heading: "Digital strategy and technology consulting",
    summary:
      "Connect technology decisions to business goals, customer experience, operational efficiency, and sustainable growth.",
    serviceType: "Digital transformation and technology consulting",
    includes: [
      "Business growth and scale-up strategy",
      "Smart solutions for businesses",
      "Digital transformation consulting",
      "Technology consulting and architecture",
      "Business process analysis",
      "Operational efficiency consulting",
      "Business workflow optimization",
      "Conversion-rate optimization",
      "Customer-experience optimization",
    ],
  },
  {
    id: "business-automation",
    number: "05",
    title: "Business Automation & System Integration",
    heading: "CRM and workflow automation for business",
    summary:
      "Reduce repetitive manual work by connecting business tools, customer workflows, and internal processes.",
    serviceType: "CRM automation, workflow automation and system integration",
    includes: [
      "CRM automation and integrations",
      "Lead generation and qualification automation",
      "Business process automation",
      "Workflow automation",
      "Appointment scheduling automation",
      "Email and communication automation",
      "Data and application integrations",
    ],
  },
  {
    id: "ai-commerce",
    number: "06",
    title: "AI-Powered Commerce & Customer Experience",
    heading: "AI e-commerce search and product discovery",
    summary:
      "Create smoother digital buying journeys with intelligent discovery, responsive support, and tailored experiences.",
    serviceType: "AI e-commerce development, semantic product search and conversational shopping assistants",
    includes: [
      "AI-powered e-commerce experiences",
      "AI product discovery and recommendations",
      "Conversational shopping assistants",
      "Customer-support chatbots",
      "Semantic product search",
      "Customer-experience optimization",
      "E-commerce workflow automation",
    ],
  },
];

/** How a project runs. The same five steps appear on the home page and /services. */
export const process: { title: string; text: string }[] = [
  { title: "Discover", text: "Understand the challenge and current process." },
  { title: "Define", text: "Agree scope, priorities, and success measures." },
  { title: "Prototype", text: "Demonstrate the proposed workflow early." },
  { title: "Build and integrate", text: "Implement the approved solution." },
  { title: "Validate", text: "Test, improve, and plan future iterations." },
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

/**
 * Questions buyers ask, each with a direct answer of 40–60 words that stands on
 * its own. Shown as plain text on /services. Answers use only what the site
 * already states; scope decides cost and timing, so none is given.
 */
export const faqs: { question: string; answer: string }[] = [
  {
    question: "What does AI automation for a business include?",
    answer:
      "AI automation uses software, often a language model, to take over repetitive work such as answering common questions, sorting documents, qualifying leads or drafting follow-ups. We scope it around your goals and existing tools. A person can stay in the loop to approve results. The work can cover chatbots, assistants, workflows and integrations.",
  },
  {
    question: "What can a WhatsApp business chatbot do?",
    answer:
      "A WhatsApp business chatbot answers customer messages on your behalf. Our WhatsApp chatbot concept covers customer service, frequently asked questions, lead capture and hand-off to a person when a question needs one. It suits businesses and online shops that receive the same questions repeatedly. Details of that project are private and shared on request where authorised.",
  },
  {
    question: "What is a knowledge-base (RAG) chatbot, and when does a business need one?",
    answer:
      "A knowledge-base chatbot, also called a RAG system, answers questions from your own documents instead of general knowledge, and shows which passage it used. A business needs one when staff or customers keep searching long documents for answers. Our AidoChat demo shows this with uploaded documents and answers that cite the page they came from.",
  },
  {
    question: "How does a project run from discovery to launch?",
    answer:
      "A project runs in five steps. Discover: we learn the challenge and current process. Define: we agree scope, priorities and success measures. Prototype: we demonstrate the proposed workflow early. Build and integrate: we implement the approved solution. Validate: we test, improve and plan future iterations. Scope decides how long each step takes.",
  },
  {
    question: "What do we need from a client to start?",
    answer:
      "Tell us what slows your team down, where customers wait for answers, or which tools should work better together. A short description is enough to begin. During Discover we ask about your current process, tools and goals, and in Define we agree scope and success measures before anything is built.",
  },
  {
    question: "What does website modernization and technical SEO cover?",
    answer:
      "Website modernization updates an existing site so it loads quickly, works well on phones and is easy for search engines and AI assistants to read. Our work in this area covers technical SEO and performance optimization alongside rebuilding pages where needed. Scope depends on the current site, so we start by reviewing it.",
  },
  {
    question: "How is AI e-commerce product search different from keyword search?",
    answer:
      "Keyword search matches the words a shopper types. AI product search reads the meaning, such as an occasion, a need or a budget, and returns products that fit. Our AI E-commerce demo lets visitors type a request like an anniversary gift under a set price and then browse matching collections.",
  },
  {
    question: "What stays confidential in our work?",
    answer:
      "Private projects are listed without a public link to respect client and company confidentiality, and are shown only with approved screenshots or a controlled demo. A mutual NDA is available before you share anything sensitive. Work lives in your own repository and your own cloud accounts from the first day.",
  },
];

/* ─────────────────────────────────────────────────────────────
 * Work: one entry per project. Fields that do not apply stay empty and are not shown.
 * ───────────────────────────────────────────────────────────── */

/**
 * Fields that do not apply are left empty and are not shown on the page: the case
 * study layout collapses empty client, year, role and stack rows instead of
 * showing a bracket.
 */
const emptyProject = {
  client: null,
  type: null,
  year: null,
  role: null,
  demoNote: null,
  stack: [] as string[],
  brief: [] as string[],
  approach: [] as string[],
  results: [] as Project["results"],
};

export const projects: Project[] = [
  {
    ...emptyProject,
    slug: "orbitos",
    name: "OrbitOS",
    type: "SaaS",
    kind: "Live demo",
    summary:
      "An AI-powered business operating system that connects CRM, sales, inventory, invoicing and operations in one workspace, with a copilot that surfaces what needs attention.",
    seoTitle: "OrbitOS: AI Business OS Demo",
    seoDescription:
      "OrbitOS is a live demo of an AI business operating system. CRM, quotes, orders, invoices and stock share one record, and a copilot flags what needs attention.",
    features: [
      "A CRM for contacts, leads, deal value and follow-up dates",
      "Quotations that convert to orders and invoices without re-keying, reserving stock along the way",
      "Inventory with per-product low-stock thresholds and alerts",
      "Dashboards for revenue, receivables, pipeline and stock in one view",
      "An AI copilot that answers from the workspace's own records and flags overdue invoices, low stock and leads needing follow-up",
    ],
    serviceId: "business-automation",
    updated: "2026-10-29",
    liveUrl: "https://orbitos-beta.vercel.app/",
    cover: {
      src: "/work/orbitos-landing.webp",
      alt: "OrbitOS landing page preview",
      width: 1200,
      height: 750,
    },
    desktop: {
      src: "/work/orbitos-landing.webp",
      alt: "OrbitOS landing page on a desktop screen",
      width: 1200,
      height: 750,
    },
    mobile: {
      src: "/work/orbitos-mobile.webp",
      alt: "OrbitOS on a phone",
      width: 390,
      height: 844,
    },
  },
  {
    ...emptyProject,
    slug: "property-management",
    name: "Property Management System",
    type: "SaaS",
    kind: "Live demo",
    summary:
      "A property-operations workspace concept for property/unit information, leasing activity, maintenance requests, payment records, and portfolio visibility.",
    seoTitle: "Property Management System Demo",
    seoDescription:
      "A live demo of a property operations workspace. It brings property and unit details, leasing, maintenance requests and payment records into one dashboard view.",
    features: [
      "An overview of properties and units, with occupancy and resident details",
      "Maintenance requests tracked from intake to vendor resolution",
      "A leasing pipeline that shows where each prospect stands and upcoming tours",
      "Payment balances and recorded activity",
      "A dashboard marked as a sample view, so the figures shown are examples",
    ],
    serviceId: "software-engineering",
    updated: "2026-10-28",
    liveUrl: "https://propertymanagementsystem-six.vercel.app/",
    cover: {
      src: "/work/property-management-landing.webp",
      alt: "Property Management System landing page preview",
      width: 1200,
      height: 750,
    },
    desktop: {
      src: "/work/property-management-landing.webp",
      alt: "Property management workspace on desktop with property overview",
      width: 1200,
      height: 750,
    },
    mobile: {
      src: "/work/property-management-mobile.webp",
      alt: "Property management workspace on a phone",
      width: 390,
      height: 844,
    },
  },
  {
    ...emptyProject,
    slug: "aidochat",
    name: "AidoChat / DocuMind AI",
    type: "AI",
    kind: "Live demo",
    summary:
      "An AI document-intelligence demo. Upload documents, ask questions and get answers that cite the page and passage they came from.",
    seoTitle: "AidoChat: AI Document Chat Demo",
    seoDescription:
      "AidoChat is a live demo of AI document chat. Upload PDFs, scans and Word files, ask questions and get answers that cite the page and passage they came from.",
    features: [
      "Reads PDFs, scanned images, Word files and tables, with OCR for scans",
      "Combines keyword search with semantic search",
      "Answers questions about selected documents and cites the page and highlighted passage",
      "Can decline to answer when the answer is not in the documents",
      "Role-based access for admins, editors and viewers",
    ],
    demoNote: "Live demo. The first load can take a few seconds.",
    serviceId: "ai-solutions",
    updated: "2026-10-28",
    liveUrl: "https://aidochat.vercel.app/",
    cover: {
      src: "/work/aidochat-landing.webp",
      alt: "AidoChat / DocuMind AI landing page preview",
      width: 1200,
      height: 750,
    },
    desktop: {
      src: "/work/aidochat-landing.webp",
      alt: "AidoChat AI document intelligence interface",
      width: 1200,
      height: 750,
    },
    mobile: {
      src: "/work/aidochat-landing.webp",
      alt: "AidoChat on mobile device",
      width: 1200,
      height: 750,
    },
  },
  {
    ...emptyProject,
    slug: "ecommerce-experience",
    name: "AI E-commerce Experience",
    type: "Web app",
    kind: "Live demo",
    summary:
      "An AI-oriented commerce demo featuring natural-language product discovery, product collections, product details, and a luxury storefront experience.",
    seoTitle: "AI E-commerce Product Search Demo",
    seoDescription:
      "A live demo of an AI e-commerce storefront. Visitors search in plain language by occasion, need or budget, and browse collections, filters and product details.",
    features: [
      "Natural-language search by occasion, intent and budget",
      "An AI concierge that suggests gifts and styles",
      "Collections for jewelry, watches, leather goods, perfume and audio",
      "Sorting and filters by price band, occasion and stock",
      "Product detail views",
    ],
    serviceId: "ai-commerce",
    updated: "2026-10-28",
    liveUrl: "https://ecommerceorbitech.vercel.app/",
    cover: {
      src: "/work/ecommerce-landing.webp",
      alt: "AI E-commerce Experience landing page preview",
      width: 1200,
      height: 750,
    },
    desktop: {
      src: "/work/ecommerce-landing.webp",
      alt: "AI E-commerce storefront interface",
      width: 1200,
      height: 750,
    },
    mobile: {
      src: "/work/ecommerce-landing.webp",
      alt: "AI E-commerce storefront mobile view",
      width: 1200,
      height: 750,
    },
  },
  {
    ...emptyProject,
    slug: "whatsapp-chatbot",
    name: "WhatsApp Business Chatbot",
    type: "AI",
    kind: "Private project",
    summary:
      "Custom WhatsApp chatbot concept for business and e-commerce customer service, FAQs, lead capture, and customer hand-off. The link is withheld for client and company privacy.",
    seoTitle: "WhatsApp Business Chatbot Concept",
    seoDescription:
      "A private concept for a WhatsApp business chatbot that handles customer service questions, FAQs and lead capture, then hands customers to a person when needed.",
    features: [
      "Customer service for businesses and online shops",
      "Answers to frequently asked questions",
      "Lead capture",
      "Hand-off to a person",
    ],
    serviceId: "ai-solutions",
    updated: "2026-10-27",
    liveUrl: null,
    cover: {
      src: "/work/whatsapp-chatbot-preview.webp",
      alt: "WhatsApp Business Chatbot preview interface",
      width: 1200,
      height: 675,
    },
    desktop: {
      src: "/work/whatsapp-chatbot-preview.webp",
      alt: "WhatsApp Business Chatbot desktop preview",
      width: 1200,
      height: 675,
    },
    mobile: {
      src: "/work/whatsapp-chatbot-preview.webp",
      alt: "WhatsApp Business Chatbot mobile preview",
      width: 1200,
      height: 675,
    },
  },
  {
    ...emptyProject,
    slug: "bulk-email-agent",
    name: "Bulk Email Agent / Sender",
    type: "AI",
    kind: "Private project",
    summary:
      "Bulk email workflow tool concept for sending and managing outreach campaigns. The link is withheld for client and company privacy.",
    seoTitle: "Bulk Email Agent Outreach Concept",
    seoDescription:
      "A private concept for a bulk email workflow tool that sends and manages outreach campaigns. There is no public link, and details are shared on request.",
    features: ["Sending outreach campaigns", "Managing outreach campaigns"],
    serviceId: "business-automation",
    updated: "2026-10-27",
    liveUrl: null,
    cover: {
      src: "/work/bulk-email-agent-preview.webp",
      alt: "Bulk Email Agent / Sender preview interface",
      width: 1200,
      height: 675,
    },
    desktop: {
      src: "/work/bulk-email-agent-preview.webp",
      alt: "Bulk Email Agent / Sender desktop preview",
      width: 1200,
      height: 675,
    },
    mobile: {
      src: "/work/bulk-email-agent-preview.webp",
      alt: "Bulk Email Agent / Sender mobile preview",
      width: 1200,
      height: 675,
    },
  },
];

/* ─────────────────────────────────────────────────────────────
 * Studio
 * ───────────────────────────────────────────────────────────── */

export const studio = {
  /**
   * The studio in the plain third person, built only from facts the site already
   * states. Add a founder's story here only when it is real.
   */
  about: [
    "The studio was founded in October 2025. It is based in New York, US, and works with businesses remotely, worldwide.",
    "It works from the problem outward, not from a tool looking for a use case. Each project starts with the challenge and the current process, agrees scope and success measures, shows a prototype of the proposed workflow early, and then builds, integrates and validates the approved solution.",
    "Selected work includes four live demos and two private projects. Demos and prototypes are labelled as demos and prototypes, and private work is listed without a public link to respect confidentiality.",
  ],
  workingAgreements: [
    "You own the code, the repositories and the accounts from the first day.",
    "You see working software every two weeks, not at the end.",
    "You talk to the people doing the work, with no account manager in between.",
    "Prices are written down per milestone before work begins.",
  ],
};

/**
 * Add a person only with their real name, role and bio. The studio page and the
 * home page show nobody until at least one person is listed here.
 */
export const team: TeamMember[] = [];

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

/**
 * Indicative figures for the estimator. These were written as placeholders, so the
 * estimator is hidden from the contact page until the owner confirms them: set
 * `confirmed` to true only after checking every price and week count.
 */
export const estimator = {
  confirmed: false,
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
  /**
   * How long you keep enquiries, e.g. "12 months". Not supplied yet: until it is,
   * the retention paragraph is left out and /privacy stays out of search results.
   */
  retention: null as string | null,
  /** Who handles privacy questions: an email address. */
  contactEmail: "nova@theorbitechsolution.com" as string | null,
  /** When this page's text was last reviewed. */
  updated: "27 October 2026" as string | null,
  /** Who delivers the contact-form email. Matches the code; change both if you switch provider. */
  emailProvider: "Resend",
  /** Where the site is hosted. */
  hosting: "Vercel" as string | null,
};
