/**
 * Industry pages (/industries/<slug>).
 *
 * Honesty rules for this file:
 * - It never says the studio has clients, customers or case studies in an industry.
 *   `related` lists only demos and projects that exist on /work, and the page labels
 *   them as demos or concepts, not as client work.
 * - Workflows are examples of what could be built. They are labelled as examples.
 * - No compliance, certification, saving or result is claimed.
 * - Keep this file free of imports so scripts can read it directly.
 */

import type { IconName } from "./offerings";

export interface IndustryPage {
  /** URL slug: /industries/<slug> */
  slug: string;
  name: string;
  icon: IconName;
  /** One line for cards and menus */
  summary: string;
  eyebrow: string;
  /** The H1 */
  headline: string;
  lede: string;
  /** Page title without the brand suffix: 22–36 characters. */
  seoTitle: string;
  /** Meta description: 150–160 characters. */
  seoDescription: string;
  challenges: { title: string; text: string }[];
  /** `service` is a slug from servicePages */
  solutions: { title: string; text: string; service: string }[];
  /** Examples of what could be built, not descriptions of delivered work */
  workflows: { title: string; steps: string[] }[];
  /** Project slugs from content/site.ts that relate to this industry */
  related: string[];
  /** Said plainly on the page, so nobody mistakes a demo for client work */
  relatedNote: string;
  faqs: { q: string; a: string }[];
  updated: string;
}

export const industryPages: IndustryPage[] = [
  {
    slug: "real-estate",
    name: "Real Estate & Property Management",
    icon: "building",
    summary: "Leasing, maintenance, payments and portfolio visibility in one workspace.",
    eyebrow: "Real estate",
    headline: "AI and software for real estate and property management",
    lede: "Property teams juggle units, leasing enquiries, maintenance requests and payments. We build workspaces and assistants that bring them together.",
    seoTitle: "AI Solutions for Real Estate",
    seoDescription:
      "AI and software for real estate and property management: leasing workflows, maintenance tracking, payment records and portfolio dashboards for your team.",
    challenges: [
      { title: "Requests arrive everywhere", text: "Maintenance and leasing questions come by phone, email and message, and are hard to track from first contact to resolution." },
      { title: "Leads need a quick reply", text: "A prospect who waits for an answer about availability or a tour often moves on." },
      { title: "Records live in different places", text: "Unit details, resident information and payment records are spread across tools and spreadsheets." },
      { title: "Owners want visibility", text: "Occupancy, activity and balances across a portfolio are slow to assemble by hand." },
    ],
    solutions: [
      { title: "A property operations workspace", text: "Properties, units, occupancy, maintenance requests, leasing pipeline and payment records in one dashboard.", service: "software-development" },
      { title: "An assistant for enquiries", text: "A chatbot or voice assistant that answers common leasing questions from your own listing information.", service: "ai-engineering" },
      { title: "Maintenance and follow-up automation", text: "Requests categorised, assigned and followed up, with status updates sent along the way.", service: "automation" },
      { title: "Portfolio reporting", text: "Dashboards for occupancy, activity and balances that stay up to date.", service: "data-intelligence" },
    ],
    workflows: [
      { title: "Example: a maintenance request", steps: ["A resident reports an issue by message", "It is categorised and given a priority", "It is assigned to a vendor", "The resident receives status updates until it is resolved"] },
      { title: "Example: a leasing enquiry", steps: ["A prospect asks about availability", "The assistant answers from current listing details", "A tour is offered and recorded in the pipeline", "The leasing team sees the prospect's stage"] },
    ],
    related: ["property-management"],
    relatedNote: "Property Management System is a live demo built to show this kind of workspace. It is a demo, not client work, and its dashboard figures are examples.",
    faqs: [
      { q: "Is there a property management demo?", a: "Yes. The Property Management System demo shows properties and units, maintenance requests, a leasing pipeline and payment records. Its figures are examples." },
      { q: "Can this connect to the tools we already use?", a: "Usually, through APIs and integrations. We review your current tools first, because scope depends on them." },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "ecommerce",
    name: "E-commerce & Retail",
    icon: "bag",
    summary: "Natural-language product search, shopping assistants and support chatbots.",
    eyebrow: "E-commerce and retail",
    headline: "AI and software for e-commerce and retail",
    lede: "Shoppers describe what they need, not the product name. We build search, assistants and support that understand the request.",
    seoTitle: "AI & Software for E-commerce",
    seoDescription:
      "AI and software for e-commerce and retail: natural-language product search, conversational shopping assistants, support chatbots and store workflow automation.",
    challenges: [
      { title: "Search that returns nothing useful", text: "Keyword search fails when a shopper describes an occasion or a budget instead of a product name." },
      { title: "Repeated support questions", text: "Delivery, sizing and returns questions arrive constantly and pull staff away from other work." },
      { title: "A catalogue that is hard to browse", text: "Large ranges need good collections, filters and recommendations to be navigable." },
      { title: "Manual store operations", text: "Order, stock and customer follow-up tasks repeated by hand." },
    ],
    solutions: [
      { title: "Semantic product search", text: "Search by occasion, intent and budget, returning products that fit the meaning of the request.", service: "ai-commerce" },
      { title: "A conversational shopping assistant", text: "A concierge that suggests gifts and styles and answers product questions.", service: "ai-commerce" },
      { title: "Support chatbots", text: "Answers to frequently asked questions on your site or on WhatsApp, with hand-off to a person.", service: "ai-engineering" },
      { title: "Store workflow automation", text: "Routine order and follow-up steps connected so they run on their own.", service: "automation" },
    ],
    workflows: [
      { title: "Example: a gift search", steps: ["A shopper types an anniversary gift under a set price", "Search reads the occasion and the budget", "Matching collections are shown", "The assistant explains why each suggestion fits"] },
      { title: "Example: a delivery question", steps: ["A customer asks where an order is", "The assistant looks up the status", "It answers, or hands over to a person if it cannot"] },
    ],
    related: ["ecommerce-experience", "whatsapp-chatbot"],
    relatedNote: "AI E-commerce Experience is a live demo and the WhatsApp Business Chatbot is a private concept. Neither is presented as client work.",
    faqs: [
      { q: "Is there an e-commerce demo?", a: "Yes. AI E-commerce Experience lets you search in natural language and browse collections such as jewelry, watches, leather goods, perfume and audio." },
      { q: "Do you build on my existing store platform?", a: "Often, yes, through its APIs. We review the platform first, because scope depends on it." },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "restaurants",
    name: "Restaurants & Hospitality",
    icon: "utensils",
    summary: "Ordering websites, delivery-area checks and phone assistants.",
    eyebrow: "Restaurants and hospitality",
    headline: "Websites and AI for restaurants and hospitality",
    lede: "Hungry customers want a menu, a clear way to order and a quick answer. We build the website and the assistants behind it.",
    seoTitle: "Restaurant Software & AI",
    seoDescription:
      "Websites and AI for restaurants and hospitality: ordering sites with menus and delivery-area checks, plus phone and chat assistants that answer customers.",
    challenges: [
      { title: "Orders that depend on the phone", text: "Calls during busy hours go unanswered, and orders or booking requests are lost." },
      { title: "A menu that is hard to browse", text: "Customers want categories, deals and clear options, on a phone first." },
      { title: "Delivery rules", text: "Who can be delivered to, and who should collect, has to be clear before checkout." },
      { title: "Repeated questions", text: "Opening hours, locations and menu questions arrive all day." },
    ],
    solutions: [
      { title: "A restaurant ordering website", text: "A menu you can browse by category, deals and combos, a choice between delivery and pickup, a delivery-area check and a cart.", service: "software-development" },
      { title: "A phone and chat assistant", text: "An assistant that answers hours, location and menu questions and takes booking requests.", service: "ai-engineering" },
      { title: "Follow-up automation", text: "Confirmations and routine messages sent automatically.", service: "automation" },
      { title: "Reporting", text: "Dashboards that show what is ordered and when.", service: "data-intelligence" },
    ],
    workflows: [
      { title: "Example: an online order", steps: ["The customer picks delivery or pickup", "The site checks the address against the delivery area", "They browse the menu and build a cart", "The order is sent to the kitchen"] },
      { title: "Example: a booking call", steps: ["A caller asks for a table", "The assistant takes the details", "The booking request reaches the team", "The caller receives a confirmation"] },
    ],
    related: ["restaurant-website-demos"],
    relatedNote: "The three restaurant demos are demonstration websites built to show what an ordering site can do. They are not client work, and the businesses shown are examples.",
    faqs: [
      { q: "Can I try restaurant website demos?", a: "Yes. Three restaurant demos each have a menu, delivery and pickup, a delivery-area check and a cart, in a different brand style. They open after a quick email check." },
      { q: "Can the site be built around my menu and delivery area?", a: "Yes. We adapt the foundation to your menu, prices, locations and delivery rules." },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "heart",
    summary: "Appointment handling, reminders and document search, scoped with care.",
    eyebrow: "Healthcare",
    headline: "Appointment and document tools for healthcare practices",
    lede: "Practices lose time to calls, scheduling and paperwork. We can build assistants and workflows for those tasks, scoped carefully around how patient information is handled.",
    seoTitle: "Healthcare Software & AI",
    seoDescription:
      "Software and AI for healthcare practices: appointment handling, reminders and document search, with privacy requirements agreed before any design begins.",
    challenges: [
      { title: "Calls that interrupt care", text: "Front-desk staff answer routine calls about hours and appointments while patients wait in person." },
      { title: "Scheduling back and forth", text: "Confirming, moving and reminding appointments takes repeated effort." },
      { title: "Paperwork and long documents", text: "Forms, letters and policies are slow to search." },
      { title: "Sensitive information", text: "Patient information needs careful handling, and the requirements differ by place and by practice." },
    ],
    solutions: [
      { title: "An appointment assistant", text: "A voice or chat assistant that answers routine questions and books appointment slots.", service: "ai-engineering" },
      { title: "Reminder and scheduling automation", text: "Confirmations and reminders sent automatically, with changes handled.", service: "automation" },
      { title: "Document search", text: "Ask a question of a set of documents and see which passage the answer came from.", service: "ai-engineering" },
      { title: "A practice workspace", text: "Internal tools and dashboards with role-based access and audit logging.", service: "software-development" },
    ],
    workflows: [
      { title: "Example: an after-hours call", steps: ["A caller reaches the assistant after closing", "It answers from the hours and information the practice set", "It books a slot or takes a message", "The practice receives a summary"] },
      { title: "Example: an appointment change", steps: ["A patient asks to move an appointment", "The assistant offers available times", "The calendar is updated", "A confirmation is sent"] },
    ],
    related: ["ai-voice-receptionist"],
    relatedNote: "We have no healthcare case studies. The AI Voice Receptionist demo uses a made-up dental office as its example call. It is a product demo, not a deployment.",
    faqs: [
      { q: "Do you have healthcare clients?", a: "We do not list healthcare case studies. The AI receptionist demo shows an example call for a made-up dental office, and it is a demo." },
      { q: "How is sensitive information handled?", a: "Privacy and data-handling requirements are agreed in the Define step, before design and build. Role-based access control and audit logging are part of our software work." },
    ],
    updated: "2026-11-19",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    summary: "Document intelligence, client intake and scheduling automation.",
    eyebrow: "Professional services",
    headline: "AI and automation for professional services firms",
    lede: "Firms run on documents, client conversations and appointments. We build tools that find answers faster and take routine steps off people's desks.",
    seoTitle: "AI for Professional Services",
    seoDescription:
      "AI and automation for professional services: document question-answering with cited sources, client intake workflows, scheduling and CRM automation tools.",
    challenges: [
      { title: "Answers buried in documents", text: "Contracts, reports and policies are long, and finding one clause or figure takes time." },
      { title: "Intake by hand", text: "New enquiries are copied from emails and forms into the CRM." },
      { title: "Appointments and follow-up", text: "Booking consultations and chasing replies takes repeated effort." },
      { title: "Calls during meetings", text: "Phones go unanswered while the team is with clients." },
    ],
    solutions: [
      { title: "Document intelligence", text: "Upload documents, ask questions and get answers that cite the page and passage they came from.", service: "ai-engineering" },
      { title: "Client intake automation", text: "Enquiries captured, qualified and entered in the CRM automatically.", service: "automation" },
      { title: "Scheduling assistants", text: "A voice or chat assistant that answers and books consultations.", service: "ai-engineering" },
      { title: "Client and project dashboards", text: "A single view of work, deadlines and activity.", service: "data-intelligence" },
    ],
    workflows: [
      { title: "Example: a contract question", steps: ["A team member asks a question of selected documents", "The assistant answers and cites the page and passage", "If the answer is not in the documents, it says so"] },
      { title: "Example: a new enquiry", steps: ["A prospect submits a form", "The details are qualified and added to the CRM", "A reply is drafted for a person to approve"] },
    ],
    related: ["aidochat", "ai-voice-receptionist"],
    relatedNote: "AidoChat and the AI Voice Receptionist are live demos. They are not client work.",
    faqs: [
      { q: "Is there a document question-answering demo?", a: "Yes. AidoChat reads PDFs, scanned images, Word files and tables, answers questions about selected documents and cites the page and passage. It can decline when the answer is not in the documents." },
      { q: "Can you work with confidential documents?", a: "A mutual NDA is available before you share anything sensitive, and work lives in your own repository and cloud accounts from the first day." },
    ],
    updated: "2026-11-19",
  },
];

export const getIndustryPage = (slug: string) => industryPages.find((i) => i.slug === slug);
