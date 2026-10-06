"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Terminal,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function TeamSection() {
  const team = [
    {
      name: "Dr. Evelyn Chen",
      role: "Founder, CEO & Chief Systems Architect",
      photo: "/team/ceo.jpg",
      credentials: "PhD Computer Science • Ex-Big Tech Staff Architect",
      bio: "14+ years pioneering distributed systems and enterprise architectures. Evelyn oversees all architectural blueprints, ensuring zero technical debt and rock-solid scalability.",
      skills: ["Distributed Systems", "Zero-Trust Architecture", "Next.js Core", "PostgreSQL"],
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Marcus Thorne",
      role: "Head of Engineering & Fullstack Architect",
      photo: "/team/eng-lead.jpg",
      credentials: "Ex-FinTech Lead • AWS Solutions Architect Pro",
      bio: "Former lead engineer at Tier-1 quantitative trading and banking platforms. Specializes in real-time WebSockets, microservices, and ultra-low latency web apps.",
      skills: ["Next.js 16 / React 19", "Golang", "Microservices", "TimescaleDB"],
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Dr. Maya Vance",
      role: "Lead AI & Machine Learning Scientist",
      photo: "/team/ai-lead.jpg",
      credentials: "PhD Computational Intelligence • AI Fellow",
      bio: "World-class AI researcher specializing in autonomous LLM agent coordination, high-precision RAG vector pipelines, and production hallucination guardrails.",
      skills: ["Agentic Swarms", "LangChain & LlamaIndex", "Vector DBs", "Prompt Engineering"],
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Julian Scott",
      role: "Cloud Security & DevSecOps Lead",
      photo: "/team/security-lead.jpg",
      credentials: "CISSP Certified • Certified Kubernetes Admin",
      bio: "Cybersecurity veteran dedicated to hardening cloud infrastructures. Implements automated OWASP threat scanning, SOC2/GDPR pipelines, and resilient Kubernetes meshes.",
      skills: ["Cloudflare WAF", "Kubernetes", "SOC2 / HIPAA", "Terraform & AWS"],
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  ];

  return (
    <section id="team" className="py-24 relative bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
            Elite Engineering Talent
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Meet the Senior Architects Behind Your Code.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every member of our team is a seasoned veteran with a proven record of shipping enterprise-grade, high-concurrency software.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-3xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Lead
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-medium text-cyan-400 mt-0.5 mb-1">
                    {member.role}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mb-3">
                    {member.credentials}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Skills Pill Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Social / Verified Bar */}
              <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Verified Senior Pod
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label={`${member.name} GitHub`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Culture & Standards Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              100% In-House Senior Engineers
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Direct Senior Peer Code Reviews
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Continuous Automated CI/CD Testing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
