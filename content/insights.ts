/**
 * Insights: articles on AI engineering, automation and software.
 *
 * Nothing here is published yet. Each entry is a DRAFT: a planned topic with an
 * outline, no body text, no author and no date. Drafts are shown on /insights
 * with a "Draft" label, their pages are kept out of search results and the
 * sitemap, and no article is presented as written or published.
 *
 * To publish an article:
 *   1. Write the real body in `sections` (each section is a heading and paragraphs).
 *   2. Set `status: "published"`, `published` to the real date, and `author` to a
 *      real person or to the studio's name.
 *   3. Write `seoTitle` (22–36 characters) and `seoDescription` (150–160) for search.
 * The page, the listing, the sitemap and the structured data then pick it up.
 *
 * Keep this file free of imports so scripts can read it directly.
 */

export const insightCategories = [
  "AI Engineering",
  "AI Automation",
  "Software Development",
  "Data Engineering",
  "Business Technology",
] as const;
export type InsightCategory = (typeof insightCategories)[number];

export interface InsightSection {
  heading: string;
  paragraphs: string[];
}

export interface Insight {
  /** URL slug: /insights/<slug> */
  slug: string;
  status: "draft" | "published";
  title: string;
  category: InsightCategory;
  /** One or two sentences: what the article will cover */
  summary: string;
  /** The planned headings, shown on a draft's page */
  outline: string[];
  /** The article body. Empty while the article is a draft. */
  sections: InsightSection[];
  /** ISO date. Set only when published. */
  published: string | null;
  /** A real person or the studio's name. Set only when published. */
  author: string | null;
  /** Page title without the brand suffix: 22–36 characters. */
  seoTitle: string;
  /** Meta description: 150–160 characters. */
  seoDescription: string;
  /** Minutes to read. Set only when published. */
  readingMinutes: number | null;
}

export const insights: Insight[] = [
  {
    slug: "how-ai-agents-automate-business-operations",
    status: "draft",
    title: "How AI Agents Automate Business Operations",
    category: "AI Automation",
    summary: "What an AI agent is, where it fits in a business process, and where a person should stay in the loop.",
    outline: ["What an AI agent is", "Agents compared with simple automation", "Where agents fit in a business process", "Keeping a person in the loop", "How to start with one narrow task"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "How AI Agents Automate Business",
    seoDescription:
      "How AI agents automate business operations: what an agent is, where it fits in a process, how it differs from simple automation and where people stay involved.",
    readingMinutes: null,
  },
  {
    slug: "rag-vs-traditional-chatbots",
    status: "draft",
    title: "RAG vs Traditional Chatbots",
    category: "AI Engineering",
    summary: "How a chatbot that retrieves from your documents differs from a scripted or general-purpose one, and when each is the right choice.",
    outline: ["How traditional chatbots work", "How retrieval-augmented generation works", "Why answers should cite their source", "When a scripted bot is enough", "What to prepare before building one"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "RAG vs Traditional Chatbots",
    seoDescription:
      "RAG vs traditional chatbots explained: how retrieval over your own documents differs from scripted and general-purpose bots, and how to choose the right one.",
    readingMinutes: null,
  },
  {
    slug: "how-ai-voice-receptionists-work",
    status: "draft",
    title: "How AI Voice Receptionists Work",
    category: "AI Engineering",
    summary: "What happens during a call handled by an AI receptionist, from answering to booking, and where its limits are.",
    outline: ["What happens when the phone rings", "Answering from facts the owner sets", "Booking into a real calendar", "What the owner receives afterwards", "Where an AI receptionist should stop"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "How AI Voice Receptionists Work",
    seoDescription:
      "How AI voice receptionists work: answering calls, giving the hours and prices you set, booking appointments into a calendar and handing over to a person.",
    readingMinutes: null,
  },
  {
    slug: "building-whatsapp-ai-customer-support",
    status: "draft",
    title: "Building WhatsApp AI Customer Support",
    category: "AI Automation",
    summary: "How a WhatsApp business chatbot handles frequently asked questions and lead capture, and how it hands a conversation to a person.",
    outline: ["Why customers use WhatsApp for support", "Questions a chatbot can answer", "Capturing leads in the conversation", "Handing over to a person", "What to decide before you build"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "WhatsApp AI Customer Support",
    seoDescription:
      "Building WhatsApp AI customer support: answering common questions, capturing leads and handing conversations to a person, and what to decide before you build.",
    readingMinutes: null,
  },
  {
    slug: "business-process-automation",
    status: "draft",
    title: "Business Process Automation",
    category: "Business Technology",
    summary: "How to find the processes worth automating, map them first and connect the tools around them.",
    outline: ["Which processes are worth automating", "Mapping the process before automating it", "Connecting the tools you already use", "Approval steps and logs", "Measuring whether it worked"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "Business Process Automation Guide",
    seoDescription:
      "A guide to business process automation: choosing which processes to automate, mapping them first, connecting your existing tools and measuring the result.",
    readingMinutes: null,
  },
  {
    slug: "building-scalable-saas-applications",
    status: "draft",
    title: "Building Scalable SaaS Applications",
    category: "Software Development",
    summary: "The decisions that shape a SaaS product early on: access control, data design, integrations and how to ship in small milestones.",
    outline: ["Start with an MVP", "Roles, access control and audit logging", "Designing the data model for growth", "APIs and integrations", "Shipping in small milestones"],
    sections: [],
    published: null,
    author: null,
    seoTitle: "Building Scalable SaaS Apps",
    seoDescription:
      "Building scalable SaaS applications: starting with an MVP, access control, data design, APIs and integrations, and shipping working software in small steps.",
    readingMinutes: null,
  },
];

export const getInsight = (slug: string) => insights.find((a) => a.slug === slug);
export const isPublishedInsight = (a: Insight) => a.status === "published" && a.sections.length > 0 && Boolean(a.published);
