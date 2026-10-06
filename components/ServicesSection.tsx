"use client";

import React, { useState } from "react";
import {
  Globe,
  LayoutGrid,
  Sparkles,
  Bot,
  RefreshCw,
  BarChart4,
  Network,
  Server,
  Rocket,
  ShieldCheck,
  Check,
  ArrowUpRight,
} from "lucide-react";

interface ServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "web" | "ai" | "backend">("all");

  const services = [
    {
      id: "custom-websites",
      title: "Custom Websites",
      category: "web",
      icon: Globe,
      accent: "from-blue-500 to-cyan-400",
      description:
        "Bespoke high-converting marketing & brand sites engineered with Next.js 16, React 19, and headless CMS integrations.",
      features: [
        "Core Web Vitals 99+ guaranteed",
        "Sub-second global CDN delivery",
        "Dynamic animations & responsive UX",
        "SEO architecture & structured data",
      ],
      metric: "99+ Lighthouse Score",
    },
    {
      id: "web-apps",
      title: "Complex Web Applications",
      category: "web",
      icon: LayoutGrid,
      accent: "from-cyan-500 to-teal-400",
      description:
        "Interactive, state-driven multi-tenant web platforms built for high-concurrency usage, real-time collaboration, and rich UX.",
      features: [
        "React Server Components & Turbopack",
        "Optimistic UI & offline synchronization",
        "Granular state management & caching",
        "End-to-end Cypress & Playwright tests",
      ],
      metric: "<100ms Interaction Latency",
    },
    {
      id: "ai-automation",
      title: "AI Workflow Automation",
      category: "ai",
      icon: Sparkles,
      accent: "from-purple-500 to-indigo-500",
      description:
        "Transform manual business operations with autonomous LLM document pipelines, intelligent OCR, and decision trees.",
      features: [
        "Document ingestion & extraction",
        "Intelligent exception handling",
        "Human-in-the-loop review nodes",
        "Custom fine-tuned embeddings",
      ],
      metric: "80% Time Savings on Manual Tasks",
    },
    {
      id: "ai-agents",
      title: "AI Agents & Intelligent Chatbots",
      category: "ai",
      icon: Bot,
      accent: "from-violet-500 to-fuchsia-500",
      description:
        "Autonomous goal-directed AI agents and contextual multi-turn conversational bots equipped with live RAG vector search.",
      features: [
        "Multi-agent collaborative workflows",
        "Vector database integration (Pinecone/pgvector)",
        "Hallucination mitigation guardrails",
        "Multi-channel deployment (Slack, Web, API)",
      ],
      metric: "94% First-Contact Resolution",
    },
    {
      id: "crm-automation",
      title: "CRM & Pipeline Automation",
      category: "backend",
      icon: RefreshCw,
      accent: "from-emerald-500 to-green-400",
      description:
        "Deep bidirectional synchronization for HubSpot, Salesforce, and custom CRM engines with automatic lead qualification.",
      features: [
        "Real-time event webhooks & sync",
        "Automated lead scoring & routing",
        "Bespoke sales pipeline dashboards",
        "Deduplication & automated data hygiene",
      ],
      metric: "100% Zero-Loss Pipeline Sync",
    },
    {
      id: "dashboards",
      title: "Real-Time Telemetry & Dashboards",
      category: "web",
      icon: BarChart4,
      accent: "from-sky-500 to-blue-600",
      description:
        "Low-latency executive analytics dashboards with live WebSocket data streams, financial KPIs, and granular filtering.",
      features: [
        "Real-time streaming via WebSockets",
        "Interactive canvas & SVG charts",
        "Custom role-filtered data views",
        "CSV/PDF automated report exports",
      ],
      metric: "Sub-15ms WebSocket Broadcast",
    },
    {
      id: "api-integrations",
      title: "Enterprise API Integrations",
      category: "backend",
      icon: Network,
      accent: "from-amber-500 to-orange-500",
      description:
        "Secure bridges connecting payment gateways (Stripe/Adyen), third-party SaaS ecosystems, ERP systems, and legacy APIs.",
      features: [
        "Idempotent webhook processing",
        "Circuit breakers & exponential backoff",
        "PCI-DSS compliant payment flows",
        "Swagger & OpenAPI 3.0 documentation",
      ],
      metric: "99.999% Gateway Delivery",
    },
    {
      id: "backend-systems",
      title: "High-Throughput Backend Systems",
      category: "backend",
      icon: Server,
      accent: "from-rose-500 to-pink-500",
      description:
        "Scalable distributed microservices, event queues, and database architectures engineered to process millions of transactions.",
      features: [
        "Node.js, Go, and Python/FastAPI",
        "PostgreSQL schema optimization & Redis",
        "Distributed lock & queue management",
        "Zero-deadlock concurrent transactions",
      ],
      metric: "100k+ Transactions / Minute",
    },
    {
      id: "saas-development",
      title: "Full-Lifecycle SaaS Development",
      category: "web",
      icon: Rocket,
      accent: "from-indigo-500 to-cyan-400",
      description:
        "From early MVP architecture to high-scale recurring revenue platforms with tiered billing, seat licensing, and team governance.",
      features: [
        "Multi-tenant data isolation & RLS",
        "Subscription billing & invoicing engine",
        "Self-serve client onboarding workflows",
        "Team invitations & permission grids",
      ],
      metric: "4-Week Rapid MVP Delivery",
    },
    {
      id: "secure-deployment",
      title: "Secure Cloud DevOps & Deployment",
      category: "backend",
      icon: ShieldCheck,
      accent: "from-teal-500 to-emerald-400",
      description:
        "Cloud-native infrastructure on AWS, GCP, and Vercel with Docker, Kubernetes, zero-downtime CI/CD, and hardened security.",
      features: [
        "Automated CI/CD with staging preview URLs",
        "Auto-healing container clusters",
        "SOC2-ready secret & key management",
        "24/7 telemetry & alerting (Sentry/Datadog)",
      ],
      metric: "0 Downtime Deployments",
    },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 relative bg-[#090e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Full-Spectrum Engineering Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              End-to-End Capabilities for Ambitious Companies.
            </h2>
            <p className="text-slate-300 mt-4 text-base sm:text-lg">
              Every system is engineered from the ground up for high reliability, modern aesthetics, and bulletproof security.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Services (10)
            </button>
            <button
              onClick={() => setActiveCategory("web")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "web"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Web & SaaS (4)
            </button>
            <button
              onClick={() => setActiveCategory("ai")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "ai"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              AI & Agents (2)
            </button>
            <button
              onClick={() => setActiveCategory("backend")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "backend"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Backend & Cloud (4)
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/30 hover:bg-slate-900/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon & Action */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.accent} p-2.5 flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-cyan-300 border border-white/10">
                      {service.metric}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <button
                  onClick={() => {
                    if (onSelectService) {
                      onSelectService(service.title);
                    } else {
                      window.location.href = "#estimator";
                    }
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>Build with this stack</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
