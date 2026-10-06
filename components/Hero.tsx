"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  Server,
  Cpu,
  Lock,
  Globe2,
  Sparkles,
  Database,
  BarChart3,
  Flame,
} from "lucide-react";

interface HeroProps {
  onOpenConsultation?: () => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const [activeHudTab, setActiveHudTab] = useState<"telemetry" | "security" | "stack">("telemetry");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[320px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 hover:border-cyan-500/40 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              Enterprise Software Engineering & Autonomous AI Agents
            </span>
            <span className="text-[11px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Q2/Q3 Cohort
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.08] mb-6">
            Architecting <span className="text-gradient-cyan">High-Scale SaaS</span>,
            <br />
            Resilient Web Apps & <span className="text-gradient">AI Systems</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            We partner with ambitious startups and enterprises to design, build, and deploy
            mission-critical software. Engineered with <span className="text-cyan-400 font-medium">zero technical debt</span>, bank-grade security, and sub-second global performance from day one.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#estimator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-xl shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all duration-300 transform active:scale-95 group cursor-pointer"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>Launch Your Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#work"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <span>Explore Live Systems</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/30 transition-all duration-200 cursor-pointer"
            >
              <span>Talk to CEO & Architects</span>
            </button>
          </div>

          {/* Security & Reliability Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md mb-14 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">45+ Delivered</div>
                <div className="text-xs text-slate-400">Production Systems</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">99.99% Uptime</div>
                <div className="text-xs text-slate-400">Enterprise SLA Guarantees</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">&lt; 35ms Latency</div>
                <div className="text-xs text-slate-400">Sub-second Edge Speed</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">SOC2 & GDPR</div>
                <div className="text-xs text-slate-400">Zero-Trust Security</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Engineering Live HUD / Preview Display */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0b1120] border border-white/10 shadow-2xl shadow-blue-950/60 overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                orbitech-cluster-us-east // production-kernel-v2.6
              </span>
            </div>

            {/* HUD View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveHudTab("telemetry")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeHudTab === "telemetry"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Live Telemetry
              </button>
              <button
                onClick={() => setActiveHudTab("security")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeHudTab === "security"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Security Engine
              </button>
              <button
                onClick={() => setActiveHudTab("stack")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeHudTab === "stack"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Runtime Matrix
              </button>
            </div>
          </div>

          {/* HUD Content Area */}
          <div className="p-5 sm:p-7 bg-[#080d19]">
            {activeHudTab === "telemetry" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>GLOBAL EDGE LATENCY</span>
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-mono font-bold text-emerald-400">14.2 ms</div>
                      <div className="text-[11px] text-slate-400">P99 across 28 global points of presence</div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-1.5 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>SYSTEM THROUGHPUT</span>
                      <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-mono font-bold text-cyan-400">42,850 req/s</div>
                      <div className="text-[11px] text-slate-400">Autoscaling Kubernetes mesh with zero jitter</div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-400 h-1.5 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>AUTONOMOUS AGENTS ACTIVE</span>
                      <Cpu className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-mono font-bold text-purple-400">128 Swarms</div>
                      <div className="text-[11px] text-slate-400">Real-time LLM inference & RAG vector sync</div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-400 h-1.5 rounded-full w-[96%]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[11px] text-slate-400">
                    <span>MICROSERVICE TELEMETRY STREAM</span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      STREAM CONNECTED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <p className="flex items-center gap-2">
                      <span className="text-blue-400">[00:39:48]</span>
                      <span className="text-purple-300">AUTH_GATEWAY:</span>
                      <span>NextAuth v5 & SAML SSO handshakes passed in 8ms (Zero-Knowledge JWT verify)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-blue-400">[00:39:49]</span>
                      <span className="text-cyan-300">AI_WORKFLOW:</span>
                      <span>LangChain agent completed vector retrieval across 4.2M embedded docs with 98.7% confidence</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-blue-400">[00:39:50]</span>
                      <span className="text-emerald-300">DB_CLUSTER:</span>
                      <span>PostgreSQL pool auto-tuned: 0 connection leaks, replication lag 0.02ms</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeHudTab === "security" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      Zero-Trust Guard & WAF Architecture
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every endpoint is protected with rate-limiting, strict CORS policies, token rotation, and OWASP automated threat shielding.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">TLS 1.3 Active</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">AES-256 Storage</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">DDoS Auto-Mitigation</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
                      <Lock className="w-4 h-4" />
                      Granular RBAC & Data Isolation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Multi-tenant row-level security (RLS) in PostgreSQL ensures strict client partition isolation. No cross-tenant data leaks possible.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Postgres RLS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Audit Trail Logs</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">HMAC Webhooks</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeHudTab === "stack" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-white/5">
                    <div className="text-cyan-400 font-bold text-sm">Next.js 16 + React 19</div>
                    <div className="text-[11px] text-slate-400">Turbopack & Server Actions</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-white/5">
                    <div className="text-indigo-400 font-bold text-sm">Python & FastAPI / Node</div>
                    <div className="text-[11px] text-slate-400">Async high-concurrency core</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-white/5">
                    <div className="text-purple-400 font-bold text-sm">LangChain & OpenAI</div>
                    <div className="text-[11px] text-slate-400">Fine-tuned Agent pipelines</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-white/5">
                    <div className="text-emerald-400 font-bold text-sm">Postgres & Redis</div>
                    <div className="text-[11px] text-slate-400">pgvector & sub-millisecond cache</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
