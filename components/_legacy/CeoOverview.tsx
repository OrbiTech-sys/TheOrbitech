"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldAlert,
  Award,
  CheckCircle,
  Quote,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface CeoOverviewProps {
  onOpenConsultation?: () => void;
}

export default function CeoOverview({ onOpenConsultation }: CeoOverviewProps) {
  return (
    <section id="overview" className="py-24 relative overflow-hidden bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Startup Overview & Executive Commitment
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Built by Engineers Who Treat Your Code Like Our Own.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            We are not a bloated agency that delegates your vision to inexperienced interns. We are an elite senior software studio executing mission-critical systems with speed, security, and precision.
          </p>
        </div>

        {/* CEO Message & Executive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* CEO Profile & Visual */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/80 p-2">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
                <Image
                  src="/team/ceo.jpg"
                  alt="Dr. Evelyn Chen - Founder & CEO of OrbiTech"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xl font-bold">Dr. Evelyn Chen</div>
                  <div className="text-cyan-400 text-sm font-medium">
                    Founder, CEO & Chief Systems Architect
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Ex-Staff Architect, Distributed Systems & AI Fellow
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Engineering Leadership
                </span>
                <span className="font-mono text-slate-400">14+ Yrs Tech Leadership</span>
              </div>
            </div>
          </div>

          {/* CEO Letter & Core Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-glass border border-white/10 relative">
              <Quote className="w-10 h-10 text-cyan-500/20 absolute top-6 right-6 pointer-events-none" />

              <h3 className="text-2xl font-bold text-white mb-4">
                "Our promise: Zero technical shortcuts, 100% intellectual property ownership, and relentless performance."
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  In the tech industry, far too many startups fall victim to the "agency trap": you pay enterprise rates, only to have your mission-critical product handed off to junior developers with generic boilerplates, unvetted dependencies, and fragile databases.
                </p>
                <p>
                  At <strong className="text-white">OrbiTech</strong>, I founded our engineering firm on a strictly different foundation: <strong className="text-cyan-300">every client codebase is treated like high-frequency financial infrastructure</strong>. We architect with zero-trust security from day one, design data schemas that scale effortlessly to millions of concurrent users, and integrate state-of-the-art AI workflows that provide true operational leverage.
                </p>
                <p>
                  When you partner with us, you work directly with seasoned architects who understand both low-level code mechanics and high-level enterprise business strategy.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-sm">
                    EC
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Dr. Evelyn Chen</div>
                    <div className="text-xs text-slate-400">Directly oversees all client architecture sign-offs</div>
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <span>Request Architecture Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The 4 Core Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="text-cyan-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Principal Engineers Only
                </div>
                <p className="text-xs text-slate-300">
                  No junior handoffs or opaque outsourcing. Your project is engineered by top 3% senior systems specialists.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="text-emerald-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Bank-Grade Security Standard
                </div>
                <p className="text-xs text-slate-300">
                  Strict adherence to OWASP Top 10, automated vulnerability scanning, encrypted secrets, and SOC2 readiness.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="text-purple-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Future-Proof AI Integration
                </div>
                <p className="text-xs text-slate-300">
                  We harness autonomous LLM agents and custom fine-tuned workflows to automate repetitive work and delight users.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="text-blue-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  100% Clean IP & Code Ownership
                </div>
                <p className="text-xs text-slate-300">
                  You own all code, repositories, infrastructure credentials, and documentation from the very first commit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quantifiable Track Record */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/10">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              45+
            </div>
            <div className="text-sm font-medium text-slate-200 mt-1">Production Releases</div>
            <div className="text-xs text-slate-400">Shipped with zero rollbacks</div>
          </div>

          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              99.99%
            </div>
            <div className="text-sm font-medium text-slate-200 mt-1">Average SLA Uptime</div>
            <div className="text-xs text-slate-400">Engineered for high resilience</div>
          </div>

          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              $120M+
            </div>
            <div className="text-sm font-medium text-slate-200 mt-1">Client Valuation Generated</div>
            <div className="text-xs text-slate-400">Across backed startups</div>
          </div>

          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              &lt; 2 Hours
            </div>
            <div className="text-sm font-medium text-slate-200 mt-1">Incident SLA Response</div>
            <div className="text-xs text-slate-400">24/7 dedicated engineering pod</div>
          </div>
        </div>
      </div>
    </section>
  );
}
