"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Code2,
  ShieldCheck,
  Zap,
  TrendingUp,
  X,
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  category: "saas" | "fintech" | "ai" | "web";
  tag: string;
  image?: string;
  summary: string;
  impact: { label: string; value: string }[];
  stack: string[];
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    security: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<"all" | "saas" | "ai" | "fintech">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "nexus-saas",
      title: "Nexus Enterprise SaaS Intelligence Suite",
      client: "Nexus Cloud Corp",
      category: "saas",
      tag: "Enterprise SaaS & Telemetry",
      image: "/projects/nexus-saas.jpg",
      summary:
        "A multi-tenant cloud analytics and revenue telemetry dashboard processing over $3.8M in monthly transaction volume with sub-15ms edge rendering.",
      impact: [
        { label: "Active Revenue Tracked", value: "$3.8M+/mo" },
        { label: "Edge Latency", value: "14.2 ms" },
        { label: "User Engagement", value: "+340%" },
      ],
      stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL RLS", "Redis Cache", "Tailwind CSS"],
      architecture: {
        frontend: "Next.js App Router with Server Components & Optimistic State UI",
        backend: "Node.js distributed cluster with event-driven WebSockets",
        database: "PostgreSQL multi-tenant schema with Row-Level Security (RLS)",
        security: "Zero-Trust JWT rotation, SOC2 audit logging, TLS 1.3 strict encryption",
      },
      testimonial: {
        quote:
          "OrbiTech engineered our SaaS foundation from scratch. Their senior architects built a platform that handled our 10x traffic spike on launch day without dropping a single packet.",
        author: "Marcus Lindqvist",
        role: "CTO, Nexus Cloud Corp",
      },
    },
    {
      id: "quant-vortex",
      title: "QuantVortex Algorithmic Telemetry Platform",
      client: "Vortex Capital Partners",
      category: "fintech",
      tag: "FinTech & High-Frequency Streaming",
      image: "/projects/quant-fintech.jpg",
      summary:
        "High-frequency algorithmic trade execution & telemetry workstation streaming real-time order books, Sharpe ratios, and low-latency order execution.",
      impact: [
        { label: "Stream Latency", value: "<15 ms" },
        { label: "Execution Speed", value: "4.2x Faster" },
        { label: "Daily Volume", value: "$42M+ Daily" },
      ],
      stack: ["Go Microservices", "FastAPI", "WebSockets", "TimescaleDB", "Next.js", "Docker"],
      architecture: {
        frontend: "React 19 with high-performance WebGL charting & sub-frame updates",
        backend: "Golang ultra-low-latency order router with memory-mapped queues",
        database: "TimescaleDB time-series partitions with sub-millisecond aggregations",
        security: "Hardware key authentication, encrypted memory buffers, air-gapped audit trails",
      },
      testimonial: {
        quote:
          "In high-frequency trading, microseconds are everything. OrbiTech delivered an institutional-grade terminal with zero latency lag.",
        author: "Elena Rostova",
        role: "Head of Quantitative Trading, Vortex Capital",
      },
    },
    {
      id: "neural-flow",
      title: "NeuralFlow Autonomous Multi-Agent Orchestrator",
      client: "NeuralFlow Labs",
      category: "ai",
      tag: "Autonomous AI Agents & RAG",
      image: "/projects/neural-agents.jpg",
      summary:
        "Node-based autonomous AI workflow canvas linking multi-agent LLM teams, knowledge base retrieval, and automated customer ticket resolution.",
      impact: [
        { label: "Resolution Rate", value: "92.4%" },
        { label: "Support Cost", value: "-68% Reduction" },
        { label: "Indexed Vectors", value: "3.2M Embeddings" },
      ],
      stack: ["LangChain", "Claude 3.5 Sonnet", "OpenAI GPT-4o", "Pinecone", "Next.js", "Node.js"],
      architecture: {
        frontend: "Interactive React Flow canvas with real-time token execution tracing",
        backend: "Asynchronous Python FastAPI pipeline orchestrating multi-agent state machines",
        database: "Pinecone Vector DB paired with PostgreSQL for conversation state",
        security: "Prompt injection sandboxing, automated PII scrubbing, role-based vector access",
      },
      testimonial: {
        quote:
          "The autonomous AI agents built by OrbiTech transformed our customer operations. 92% of tickets are now resolved instantly with zero hallucinations.",
        author: "Sarah Sterling",
        role: "VP of Product, NeuralFlow Labs",
      },
    },
    {
      id: "aura-health",
      title: "AuraHealth Telehealth & Clinical AI Portal",
      client: "AuraHealth Medical Group",
      category: "saas",
      tag: "HIPAA Telehealth & Medical AI",
      summary:
        "HIPAA-compliant patient portal with end-to-end encrypted video appointments, automated doctor clinical note summarization, and biometric authentication.",
      impact: [
        { label: "Active Patients", value: "65,000+" },
        { label: "Compliance Score", value: "100% HIPAA" },
        { label: "Physician Hours Saved", value: "18 hrs/wk" },
      ],
      stack: ["Next.js", "WebRTC", "Node.js", "PostgreSQL", "AWS KMS", "Tailwind CSS"],
      architecture: {
        frontend: "Accessible WCAG AAA Next.js portal with zero-trust video rooms",
        backend: "Node.js HIPAA-certified microservices on dedicated AWS VPC",
        database: "PostgreSQL with AES-256 field-level encrypted medical records",
        security: "BAA signed infrastructure, cryptographic audit logs, WebAuthn passkeys",
      },
      testimonial: {
        quote:
          "Healthcare software requires absolute security. OrbiTech’s attention to compliance and patient data privacy was second to none.",
        author: "Dr. Jonathan Hayes",
        role: "Chief Medical Officer, AuraHealth",
      },
    },
    {
      id: "apex-logix",
      title: "ApexLogix Global Predictive Fleet Logistics",
      client: "ApexLogix Freight Network",
      category: "saas",
      tag: "Supply Chain & IoT Telematics",
      summary:
        "Real-time predictive freight tracking engine monitoring 14,000+ commercial vehicles across 24 countries with ML-driven ETA forecasts.",
      impact: [
        { label: "Tracked Vehicles", value: "14,200+" },
        { label: "ETA Accuracy", value: "98.6%" },
        { label: "Fuel Cost Saved", value: "$1.4M / yr" },
      ],
      stack: ["Python", "Apache Kafka", "Redis", "React", "Mapbox GL", "Docker"],
      architecture: {
        frontend: "High-density Mapbox WebGL interactive tracking dashboard",
        backend: "Apache Kafka event streams processing 10,000 telemetry pings/sec",
        database: "PostGIS geospatial database with spatial indexing",
        security: "Mutual TLS (mTLS) device authentication for onboard IoT gateways",
      },
      testimonial: {
        quote:
          "OrbiTech solved our complex telemetry bottlenecks when three previous development agencies failed. They are true systems engineers.",
        author: "Tariq Mansour",
        role: "VP of Logistics, ApexLogix",
      },
    },
    {
      id: "hyperscale-commerce",
      title: "HyperScale Headless Multi-Currency E-Commerce",
      client: "HyperScale Luxury Brands",
      category: "web",
      tag: "High-Converting Headless Web",
      summary:
        "Sub-second global e-commerce storefront with dynamic edge localization, automated multi-currency checkout, and 99+ Core Web Vitals.",
      impact: [
        { label: "Lighthouse Score", value: "99 / 100" },
        { label: "Page Load Time", value: "320 ms" },
        { label: "Conversion Lift", value: "+48%" },
      ],
      stack: ["Next.js 16 App Router", "Shopify Storefront API", "Stripe Connect", "Cloudflare Workers"],
      architecture: {
        frontend: "Next.js ISR (Incremental Static Regeneration) on global Edge CDN",
        backend: "Serverless edge functions routing cart logic and inventory locks",
        database: "Headless CMS + Redis distributed cart cache",
        security: "Stripe PCI-DSS Level 1 compliance, bot-traffic filtering",
      },
      testimonial: {
        quote:
          "Our conversion rate jumped 48% within 3 weeks of launching the new OrbiTech-built web architecture. The speed is unprecedented.",
        author: "Chloe Dubois",
        role: "Head of E-Commerce, HyperScale Group",
      },
    },
  ];

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section id="work" className="py-24 relative bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
              Production Portfolio & Case Studies
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Proven Systems Operating in the Real World.
            </h2>
            <p className="text-slate-300 mt-4 text-base sm:text-lg">
              Explore production applications we have architected and deployed for high-growth tech ventures and enterprises.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Projects (6)
            </button>
            <button
              onClick={() => setActiveTab("saas")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "saas"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              SaaS & Platforms
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              AI & Agents
            </button>
            <button
              onClick={() => setActiveTab("fintech")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "fintech"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              FinTech & Low-Latency
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Preview */}
                {project.image ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                        {project.tag}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-cyan-300 border border-white/10">
                      {project.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{project.client}</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Impact Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 text-center">
                    {project.impact.map((stat, i) => (
                      <div key={i} className="px-1">
                        <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
                          {stat.value}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-xs sm:text-sm font-semibold text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Inspect Architecture & Security Spec</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1220] border border-white/15 p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                System Specification & Architecture Breakdown
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">{selectedProject.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Client: {selectedProject.client}</p>
            </div>

            {/* Architecture Details */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase mb-1">
                  <Layers className="w-4 h-4" /> Frontend Architecture
                </div>
                <p className="text-xs text-slate-300">{selectedProject.architecture.frontend}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase mb-1">
                  <Cpu className="w-4 h-4" /> Backend & Compute Engine
                </div>
                <p className="text-xs text-slate-300">{selectedProject.architecture.backend}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase mb-1">
                  <Database className="w-4 h-4" /> Data Storage & In-Memory Layer
                </div>
                <p className="text-xs text-slate-300">{selectedProject.architecture.database}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-1">
                  <Lock className="w-4 h-4" /> Security & Compliance Implementation
                </div>
                <p className="text-xs text-slate-300">{selectedProject.architecture.security}</p>
              </div>
            </div>

            {/* Client Testimonial */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 mb-6">
              <div className="text-xs italic text-slate-200">
                "{selectedProject.testimonial.quote}"
              </div>
              <div className="text-xs font-semibold text-cyan-300 mt-2">
                — {selectedProject.testimonial.author},{" "}
                <span className="text-slate-400 font-normal">{selectedProject.testimonial.role}</span>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <a
                href="#estimator"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer"
              >
                Build Similar Architecture
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
