"use client";

import React, { useState } from "react";
import {
  Code2,
  Database,
  Cpu,
  Cloud,
  Layers,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function TechStackSection() {
  const [selectedDomain, setSelectedDomain] = useState<number>(0);

  const domains = [
    {
      title: "Frontend & UI Engineering",
      icon: Layers,
      summary: "Modern React and Next.js architectures optimized for instant render times, SEO, and accessibility.",
      technologies: [
        { name: "Next.js 16", tag: "App Router & SSR", proficiency: "Enterprise Mastery" },
        { name: "React 19", tag: "Server Components & Actions", proficiency: "Expert" },
        { name: "TypeScript", tag: "Strict Type Safety", proficiency: "Core Standard" },
        { name: "Tailwind CSS v4", tag: "Zero-Runtime Styling", proficiency: "Design System" },
        { name: "Turbopack", tag: "Sub-second Bundling", proficiency: "Build Core" },
        { name: "WebSockets & WebRTC", tag: "Real-Time Streaming", proficiency: "Advanced" },
      ],
    },
    {
      title: "Backend, APIs & Distributed Systems",
      icon: Cpu,
      summary: "High-throughput asynchronous services capable of processing tens of thousands of requests per second.",
      technologies: [
        { name: "Node.js & NestJS", tag: "Microservices Architecture", proficiency: "High Concurrency" },
        { name: "Python & FastAPI", tag: "AI Pipelines & Async APIs", proficiency: "Production Standard" },
        { name: "Golang", tag: "Ultra-Low-Latency Workers", proficiency: "Microservices" },
        { name: "GraphQL & REST", tag: "Strict Schema Contracts", proficiency: "Universal" },
        { name: "gRPC & Protocol Buffers", tag: "Inter-Service Communication", proficiency: "Internal Mesh" },
        { name: "Apache Kafka & RabbitMQ", tag: "Distributed Event Queues", proficiency: "Streaming" },
      ],
    },
    {
      title: "Databases, In-Memory Caching & Search",
      icon: Database,
      summary: "Robust relational schemas, vector databases for semantic retrieval, and distributed caching.",
      technologies: [
        { name: "PostgreSQL", tag: "Row-Level Security (RLS)", proficiency: "Primary Datastore" },
        { name: "Redis", tag: "In-Memory Caching & PubSub", proficiency: "Sub-ms Speeds" },
        { name: "pgvector & Pinecone", tag: "High-Dimension Embeddings", proficiency: "AI Vectors" },
        { name: "TimescaleDB", tag: "Time-Series Financial Telemetry", proficiency: "Real-Time" },
        { name: "Supabase & Prisma", tag: "Modern ORM & Auth Bridges", proficiency: "Rapid Prototyping" },
        { name: "MongoDB", tag: "Document & Event Logging", proficiency: "Big Data" },
      ],
    },
    {
      title: "AI, Large Language Models & Automation",
      icon: Sparkles,
      summary: "Autonomous agents, contextual RAG search, document intelligence, and multi-agent coordination.",
      technologies: [
        { name: "OpenAI GPT-4o API", tag: "Structured Outputs & Reasoning", proficiency: "SOTA Inference" },
        { name: "Anthropic Claude 3.5", tag: "Complex Code & Document Logic", proficiency: "Extended Context" },
        { name: "LangChain & LlamaIndex", tag: "Multi-Agent Orchestration", proficiency: "Workflow Engine" },
        { name: "RAG Vector Pipelines", tag: "Hallucination Mitigation", proficiency: "Enterprise Knowledge" },
        { name: "Hugging Face Models", tag: "Fine-Tuning & Quantization", proficiency: "Private Hosted" },
        { name: "Function Calling & Tools", tag: "Autonomous Execution Agents", proficiency: "Agentic Loop" },
      ],
    },
    {
      title: "Cloud Infrastructure, DevOps & Security",
      icon: Cloud,
      summary: "Zero-downtime CI/CD pipelines, container orchestration, edge caching, and automated cloud security.",
      technologies: [
        { name: "AWS & Google Cloud", tag: "ECS, EKS, RDS, S3, IAM", proficiency: "Enterprise Cloud" },
        { name: "Vercel Enterprise", tag: "Global Edge Network & ISR", proficiency: "Edge Compute" },
        { name: "Docker & Kubernetes", tag: "Containerization & Auto-Scaling", proficiency: "DevOps Standard" },
        { name: "Cloudflare Enterprise", tag: "WAF, DDoS Shield, DNS", proficiency: "Edge Security" },
        { name: "GitHub Actions", tag: "Automated Testing & Deployment", proficiency: "CI/CD Pipeline" },
        { name: "Terraform", tag: "Infrastructure as Code (IaC)", proficiency: "Reproducible Ops" },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="py-24 relative bg-[#090e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
            Battle-Tested Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Our Skills & Modern Tech Stack.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            We reject fragile boilerplate templates. Every tool in our stack is intentionally selected for speed, security, scalability, and long-term maintainability.
          </p>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {domains.map((domain, idx) => {
            const Icon = domain.icon;
            const isSelected = selectedDomain === idx;
            return (
              <button
                key={domain.title}
                onClick={() => setSelectedDomain(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30"
                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-cyan-300" : "text-slate-400"}`} />
                <span>{domain.title.split("&")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Domain Display Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/50 border border-white/10 relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {domains[selectedDomain].title}
            </h3>
            <p className="text-sm text-slate-300">
              {domains[selectedDomain].summary}
            </p>
          </div>

          {/* Technology Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains[selectedDomain].technologies.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {tech.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                    {tech.proficiency}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {tech.tag}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              All dependencies subjected to automated vulnerability audits (npm audit, Snyk, Dependabot)
            </span>
            <span className="font-mono text-cyan-400">100% Modern LTS Versions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
