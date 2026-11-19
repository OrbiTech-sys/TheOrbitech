/**
 * The dedicated service pages (/services/<slug>) and the four core categories
 * shown on the home page. Capabilities for each service come from `services` in
 * content/site.ts, so the two never disagree.
 *
 * - Nothing here states a price, a timeline, a client or a result. Scope decides
 *   cost and time, and the site says so.
 * - Technology names are limited to the ones listed in `skills` (content/site.ts),
 *   plus n8n, which the studio names as a workflow tool.
 * - Keep this file free of imports so scripts can read it directly.
 */

export type IconName =
  | "bot"
  | "code"
  | "workflow"
  | "database"
  | "compass"
  | "cart"
  | "building"
  | "bag"
  | "utensils"
  | "heart"
  | "briefcase";

export interface ServicePage {
  /** URL slug: /services/<slug> */
  slug: string;
  /** The matching `services[].id` in content/site.ts */
  serviceId: string;
  icon: IconName;
  /** Short name for menus and cards */
  navLabel: string;
  /** One line for menus */
  navText: string;
  eyebrow: string;
  /** The H1 */
  headline: string;
  lede: string;
  /** Page title without the brand suffix: 22–36 characters. */
  seoTitle: string;
  /** Meta description: 150–160 characters. */
  seoDescription: string;
  overview: string[];
  problems: { title: string; text: string }[];
  approach: { title: string; text: string }[];
  technologies: string[];
  faqs: { q: string; a: string }[];
  /** ISO date of the last meaningful change */
  updated: string;
}

/** The four categories on the home page and at the top of /services. */
export interface CoreCategory {
  slug: string;
  icon: IconName;
  title: string;
  summary: string;
  items: string[];
}

export const coreCategories: CoreCategory[] = [
  {
    slug: "ai-engineering",
    icon: "bot",
    title: "AI Engineering",
    summary: "AI systems that answer from your own knowledge, take on repeatable work and hand over to a person when it matters.",
    items: ["AI Agents", "RAG Applications", "Voice AI", "Intelligent Chatbots", "Document Intelligence"],
  },
  {
    slug: "software-development",
    icon: "code",
    title: "Software Engineering",
    summary: "Modern digital products, from internal tools and business platforms to SaaS applications and MVPs.",
    items: ["SaaS Applications", "Custom Web Applications", "API Development", "MVP Development", "Business Platforms"],
  },
  {
    slug: "automation",
    icon: "workflow",
    title: "Intelligent Automation",
    summary: "Fewer repetitive tasks, by connecting the tools, customer workflows and internal processes you already use.",
    items: ["n8n Workflows", "CRM Automation", "Lead Generation", "Business Process Automation", "Third-Party Integrations"],
  },
  {
    slug: "data-intelligence",
    icon: "database",
    title: "Data & Intelligence",
    summary: "Business data turned into clear reporting and better-informed decisions.",
    items: ["Data Engineering", "Data Pipelines", "Analytics Dashboards", "Predictive Solutions", "Business Intelligence"],
  },
];

export const servicePages: ServicePage[] = [
  {
    slug: "ai-engineering",
    serviceId: "ai-solutions",
    icon: "bot",
    navLabel: "AI Engineering",
    navText: "Agents, RAG, voice AI and chatbots",
    eyebrow: "AI engineering",
    headline: "AI engineering: agents, RAG, voice and chatbots built around your business",
    lede: "We design and integrate AI systems that answer questions from your own knowledge, take on repeatable work and hand over to a person when a question needs one.",
    seoTitle: "AI Engineering Services",
    seoDescription:
      "AI engineering for business: AI agents, RAG knowledge-base chatbots, voice AI and document intelligence, scoped around your goals and the tools you already use.",
    overview: [
      "AI engineering is the work of making a language model useful inside a real business: connecting it to your documents, your tools and your process, and deciding where a person approves the result.",
      "We cover chatbots and assistants, WhatsApp business chatbots, AI agents, knowledge-base (RAG) systems, semantic search, intelligent document processing and voice AI. Each project starts from the problem, not from a tool looking for a use case.",
    ],
    problems: [
      { title: "The same questions, again and again", text: "Staff and customers keep asking things that are already answered somewhere. An assistant grounded in your own material can answer them and point to the source." },
      { title: "Knowledge nobody can search", text: "Contracts, manuals and policies sit in long documents. Retrieval over those files lets people ask a question instead of reading forty pages." },
      { title: "Calls and messages that go unanswered", text: "Voice and messaging assistants can answer after hours, capture the details and pass the conversation to a person when needed." },
      { title: "AI that never reaches real systems", text: "A demo that cannot read or write to your tools stays a demo. We connect the model to the systems where the work actually happens." },
    ],
    approach: [
      { title: "Ground answers in your data", text: "Retrieval over your own documents, with answers that show which passage they used, so a person can check them." },
      { title: "Keep a person in the loop", text: "Where a mistake would matter, the assistant drafts and a person approves. It can also decline to answer when the answer is not in the documents." },
      { title: "Connect to the tools you use", text: "APIs and integrations so the assistant can look things up and take actions in your CRM, calendar or support tools." },
      { title: "Test on real examples", text: "We agree success measures up front and test against real questions before anything goes live." },
      { title: "Run it in your accounts", text: "Code lives in your repository and services run in your cloud accounts from the first day." },
    ],
    technologies: ["OpenAI API", "Anthropic API", "LangChain", "LlamaIndex", "Hugging Face", "pgvector", "PostgreSQL", "Python", "FastAPI"],
    faqs: [
      {
        q: "What is a RAG chatbot?",
        a: "A RAG, or knowledge-base, chatbot answers from your own documents instead of general knowledge, and shows which passage it used. It suits teams and customers who keep searching long documents for answers.",
      },
      {
        q: "Can an AI assistant hand over to a person?",
        a: "Yes. Our WhatsApp chatbot concept covers customer service, frequently asked questions, lead capture and hand-off to a person when a question needs one.",
      },
      {
        q: "Can I see AI work before we start?",
        a: "Yes. The work page has live demos, including an AI document chat that cites the page and passage behind each answer, and an AI voice receptionist.",
      },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "software-development",
    serviceId: "software-engineering",
    icon: "code",
    navLabel: "Software Engineering",
    navText: "SaaS, web apps, APIs and MVPs",
    eyebrow: "Software engineering",
    headline: "Custom software: SaaS, web applications, APIs and MVPs",
    lede: "We build modern digital products, from websites and internal tools to SaaS platforms and MVPs, with working software shown to you every two weeks.",
    seoTitle: "Custom Software Development",
    seoDescription:
      "Custom software development: SaaS products, web apps, APIs, internal dashboards and MVPs, with secure access control and working software every two weeks.",
    overview: [
      "Good software starts with the people who will use it. We build the product you need, whether that is a customer-facing website, an internal portal, a multi-user SaaS platform or a first version to test an idea.",
      "The work covers modern website development, custom web applications, e-commerce, SaaS products, MVPs and rapid prototyping, API development and third-party integrations, role-based access control and audit logging, and website modernization with technical SEO and performance work.",
    ],
    problems: [
      { title: "Off-the-shelf tools that almost fit", text: "When a spreadsheet or a generic tool stops matching how your team works, a purpose-built application removes the workarounds." },
      { title: "An idea that needs testing", text: "An MVP gets a real product in front of users quickly, so the next decision is based on what they do." },
      { title: "Systems that do not talk to each other", text: "APIs and integrations connect the tools you already pay for, so information is entered once." },
      { title: "A website that is slow or hard to find", text: "Modernizing an existing site covers performance, mobile use and the technical SEO that lets people and AI assistants read it." },
    ],
    approach: [
      { title: "Prototype early", text: "We demonstrate the proposed workflow before the full build, so changes are cheap and decisions are informed." },
      { title: "Build in small milestones", text: "Prices are written down per milestone before work begins, and you see working software every two weeks." },
      { title: "Secure by default", text: "Role-based access control, audit logging and input validation are reviewed against the OWASP Top 10 before launch." },
      { title: "Integrate, do not isolate", text: "REST and GraphQL APIs and third-party integrations so the product fits the systems around it." },
      { title: "You own the result", text: "You own the code, the repositories and the accounts from the first day." },
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "NestJS", "Python", "FastAPI", "PostgreSQL", "Prisma", "REST", "GraphQL", "Vercel"],
    faqs: [
      {
        q: "Do you build SaaS products and MVPs?",
        a: "Yes. SaaS product development and MVP development with rapid prototyping are both part of this service. We agree scope and success measures first, then show a prototype early.",
      },
      {
        q: "Can you modernize an existing website?",
        a: "Yes. Website modernization covers performance, mobile use and technical SEO. We start by reviewing the current site, because scope depends on what is there.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Code, repositories and accounts belong to you from the first day.",
      },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "automation",
    serviceId: "business-automation",
    icon: "workflow",
    navLabel: "Intelligent Automation",
    navText: "Workflows, CRM and integrations",
    eyebrow: "Intelligent automation",
    headline: "Business automation: workflows, CRM and system integration",
    lede: "We reduce repetitive manual work by connecting your business tools, customer workflows and internal processes, with a person approving the steps that matter.",
    seoTitle: "Business Automation Services",
    seoDescription:
      "Business automation services: n8n workflows, CRM automation, lead qualification, appointment scheduling and integrations that cut repetitive manual work.",
    overview: [
      "Most teams lose hours to the same manual steps: copying details between tools, chasing follow-ups, sending routine emails. Automation connects those tools so the work moves on its own and people handle the exceptions.",
      "This service covers CRM automation and integrations, lead generation and qualification, business process and workflow automation, appointment scheduling, email and communication automation, and data and application integrations.",
    ],
    problems: [
      { title: "Double entry across tools", text: "The same customer details typed into a CRM, a spreadsheet and an inbox. Integrations pass the data along once." },
      { title: "Leads that go cold", text: "Qualification and follow-up automation make sure every enquiry gets a prompt, consistent response." },
      { title: "Routine messages that eat the day", text: "Email and communication automation drafts and sends the repetitive messages, with a person approving where it matters." },
      { title: "Scheduling back and forth", text: "Appointment scheduling automation handles the exchange of times and confirmations." },
    ],
    approach: [
      { title: "Map the process first", text: "We analyse the current workflow before automating it, because automating a broken process only makes it faster." },
      { title: "Use the right tool", text: "n8n workflows and custom code, whichever fits: visual workflows for speed, code where logic is complex." },
      { title: "Connect, do not replace", text: "We integrate the CRM, calendar, email and other tools you already use through their APIs." },
      { title: "Keep a person in the loop", text: "Approval steps for anything that matters, and clear logs so you can see what ran." },
      { title: "Improve after launch", text: "We validate against the success measures we agreed, then plan the next iteration." },
    ],
    technologies: ["n8n", "Node.js", "Python", "REST", "GraphQL", "Kafka", "PostgreSQL", "Redis"],
    faqs: [
      {
        q: "What can be automated?",
        a: "Typical work includes lead qualification, CRM updates, email and communication, appointment scheduling and the movement of data between applications. We analyse your process first to find the best candidates.",
      },
      {
        q: "Do you use n8n?",
        a: "Yes. n8n workflows are part of how we build automation, alongside custom code where the logic needs it.",
      },
      {
        q: "Does a person stay involved?",
        a: "Where a mistake would matter, yes. We build approval steps so the automation drafts and a person confirms.",
      },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "data-intelligence",
    serviceId: "data-analytics",
    icon: "database",
    navLabel: "Data & Intelligence",
    navText: "Pipelines, dashboards and analytics",
    eyebrow: "Data and intelligence",
    headline: "Data engineering, analytics and business intelligence dashboards",
    lede: "We turn business data into clear reporting, usable insights and better-informed decisions, from the pipeline that collects it to the dashboard that shows it.",
    seoTitle: "Data Engineering & Analytics",
    seoDescription:
      "Data engineering and analytics: data pipelines, business intelligence dashboards, predictive analytics, database design and data migration for business teams.",
    overview: [
      "Business data is only useful when it is collected reliably, stored sensibly and shown in a way people can act on. We build that chain end to end.",
      "The work covers data analysis and visualization, data engineering and pipeline development, business intelligence dashboards, AI-powered analytics and reporting, predictive analytics solutions, database design and optimization, and data migration and synchronization.",
    ],
    problems: [
      { title: "Numbers in too many places", text: "Sales in one tool, stock in another, finance in a spreadsheet. Pipelines bring them to one place that stays current." },
      { title: "Reports built by hand", text: "Dashboards replace the weekly copy-and-paste with a view that is always up to date." },
      { title: "Decisions made on instinct", text: "Clear reporting and, where it fits, predictive analytics give you evidence to work with." },
      { title: "A database that has outgrown its design", text: "Database design and optimization, and careful migration, keep a growing system fast and dependable." },
    ],
    approach: [
      { title: "Start with the question", text: "We agree the decisions the data needs to support before choosing any tool." },
      { title: "Build reliable pipelines", text: "Data collection and synchronization that you can trust, with checks so errors are caught early." },
      { title: "Design for use", text: "Dashboards organised around how your team makes decisions, not around the data model." },
      { title: "Add intelligence where it helps", text: "AI-powered analytics and predictive models when they add value, and plain reporting when that is enough." },
      { title: "Own your data", text: "Databases and pipelines run in your accounts, and the work is documented." },
    ],
    technologies: ["Python", "PostgreSQL", "TimescaleDB", "Redis", "MongoDB", "Prisma", "Kafka", "pgvector"],
    faqs: [
      {
        q: "What is the difference between data engineering and analytics?",
        a: "Data engineering collects, moves and stores data reliably. Analytics turns that data into reports and insight. Most projects need both, and we cover each.",
      },
      {
        q: "Do you build dashboards?",
        a: "Yes. Business intelligence dashboards are part of this service, built around the decisions your team needs to make.",
      },
      {
        q: "Can you migrate an existing database?",
        a: "Yes. Data migration and synchronization is part of the service. Scope depends on the current system, so we start by reviewing it.",
      },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "technology-consulting",
    serviceId: "business-growth",
    icon: "compass",
    navLabel: "Technology Consulting",
    navText: "Strategy, architecture and process",
    eyebrow: "Technology consulting",
    headline: "Digital strategy and technology consulting for business growth",
    lede: "We connect technology decisions to business goals, customer experience, operational efficiency and sustainable growth, before anything is built.",
    seoTitle: "Technology Consulting Services",
    seoDescription:
      "Technology consulting and digital strategy: business process analysis, architecture advice, workflow optimization and digital transformation for growing firms.",
    overview: [
      "The costliest technology mistake is building the wrong thing. Consulting gives you a clear view of the problem, the options and the sensible first step before you commit to a build.",
      "This service covers business growth and scale-up strategy, digital transformation consulting, technology consulting and architecture, business process analysis, operational efficiency, workflow optimization, conversion-rate optimization and customer-experience optimization.",
    ],
    problems: [
      { title: "Unclear where to start", text: "AI and automation are broad. A short analysis of your process shows where they would help first." },
      { title: "A system that will not scale", text: "Architecture advice before growth makes the next stage cheaper than a rebuild." },
      { title: "Processes nobody has written down", text: "Business process analysis makes the current workflow visible, so it can be improved on purpose." },
      { title: "Visitors who do not become customers", text: "Conversion-rate and customer-experience optimization focus on the points where people drop out." },
    ],
    approach: [
      { title: "Understand the challenge", text: "We learn the problem and the current process before proposing anything." },
      { title: "Agree scope and success", text: "Priorities and success measures are written down, so everyone knows what good looks like." },
      { title: "Recommend the smallest useful step", text: "A prototype or a narrow first release, not a large programme." },
      { title: "Explain the trade-offs", text: "Plain-language options with their costs and risks, so the decision stays yours." },
      { title: "Hand over clearly", text: "Whether you build with us or not, you leave with a documented plan." },
    ],
    technologies: ["AWS", "Google Cloud", "Vercel", "Cloudflare", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    faqs: [
      {
        q: "Do I have to build with you after consulting?",
        a: "No. Consulting stands on its own, and you leave with a documented plan you can act on with us or with anyone else.",
      },
      {
        q: "What does a consulting engagement start with?",
        a: "A conversation about the challenge and the current process. A short description of what slows your team down is enough to begin.",
      },
      {
        q: "Is this only about AI?",
        a: "No. It covers digital strategy, architecture, workflow optimization and customer experience, and AI where it fits.",
      },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "ai-commerce",
    serviceId: "ai-commerce",
    icon: "cart",
    navLabel: "AI Commerce",
    navText: "Product search and shopping assistants",
    eyebrow: "AI-powered commerce",
    headline: "AI e-commerce: product discovery, search and shopping assistants",
    lede: "We create smoother buying journeys with intelligent product discovery, responsive support and tailored experiences.",
    seoTitle: "AI E-commerce Development",
    seoDescription:
      "AI e-commerce development: natural-language product search, recommendations, conversational shopping assistants and support chatbots for online stores.",
    overview: [
      "Shoppers rarely know the product name. They know the occasion, the need and the budget. AI product discovery reads that meaning and returns products that fit, where keyword search returns only matching words.",
      "The work covers AI-powered e-commerce experiences, product discovery and recommendations, conversational shopping assistants, customer-support chatbots, semantic product search, customer-experience optimization and e-commerce workflow automation.",
    ],
    problems: [
      { title: "Search that misses the point", text: "A shopper typing an anniversary gift under a set price gets nothing useful from keyword matching. Semantic search understands the request." },
      { title: "Questions at every step", text: "Conversational assistants and support chatbots answer sizing, delivery and product questions without waiting for a person." },
      { title: "A catalogue that is hard to browse", text: "Collections, filters and recommendations help shoppers find their way." },
      { title: "Manual store operations", text: "E-commerce workflow automation handles the routine steps behind the storefront." },
    ],
    approach: [
      { title: "Search by meaning", text: "Semantic product search over your catalogue, so occasion, intent and budget all count." },
      { title: "A concierge, not a pop-up", text: "A shopping assistant that suggests gifts and styles and explains why." },
      { title: "Fit your platform", text: "Built to work with the store and tools you already run, through their APIs." },
      { title: "Measure what matters", text: "We agree success measures up front and review them after launch." },
      { title: "Show it working", text: "A prototype early, so you judge the experience before the full build." },
    ],
    technologies: ["Next.js", "React", "TypeScript", "OpenAI API", "pgvector", "PostgreSQL", "Vercel"],
    faqs: [
      {
        q: "How is AI product search different from keyword search?",
        a: "Keyword search matches the words typed. AI product search reads the meaning, such as an occasion, a need or a budget, and returns products that fit.",
      },
      {
        q: "Is there a demo?",
        a: "Yes. The AI E-commerce Experience demo on the work page lets you type a request and browse matching collections.",
      },
      {
        q: "Can this work with an existing store?",
        a: "Often, yes. We integrate with the platform and tools you already use. We start by reviewing the setup, because scope depends on it.",
      },
    ],
    updated: "2026-11-19",
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);
export const servicePageById = (serviceId: string) => servicePages.find((s) => s.serviceId === serviceId);
