"use client";

import React from "react";
import { Star, Quote, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "OrbiTech replaced our failing legacy backend with an ultra-responsive Next.js & PostgreSQL architecture in under 6 weeks. Our AWS compute bills dropped by 54% and checkout latency plunged to 14ms. They are the best engineering partner we've ever hired.",
      author: "Marcus Lindqvist",
      role: "CTO, Nexus Cloud Corp",
      tag: "SaaS Scale & Performance",
      impact: "54% Cost Reduction • 14ms Edge Latency",
    },
    {
      quote:
        "As a healthcare founder, patient privacy and strict HIPAA compliance kept me up at night. Dr. Evelyn Chen and the OrbiTech team engineered an airtight architecture with end-to-end zero-trust encryption and flawless audit logging.",
      author: "Dr. Jonathan Hayes",
      role: "Chief Medical Officer, AuraHealth Group",
      tag: "HIPAA & Enterprise Security",
      impact: "100% HIPAA Audit Pass • 0 Vulnerabilities",
    },
    {
      quote:
        "The autonomous AI agents designed by OrbiTech saved our operations team over 2,400 hours each quarter. Zero hallucinations, flawless bidirectional CRM synchronization, and direct weekly syncs with their principal engineers.",
      author: "Sarah Sterling",
      role: "VP of Product, NeuralFlow Labs",
      tag: "AI Automation & Agents",
      impact: "92.4% Auto Resolution • 2,400+ Hours Saved",
    },
    {
      quote:
        "In algorithmic trading, microsecond execution is everything. OrbiTech delivered high-throughput Go and WebSocket streaming that operated flawlessly without dropping a single frame during extreme high-volatility surges.",
      author: "Elena Rostova",
      role: "Head of Quantitative Trading, Vortex Capital",
      tag: "FinTech & Low-Latency Streaming",
      impact: "4.2x Faster Trades • $42M+ Daily Volume",
    },
  ];

  return (
    <section className="py-24 relative bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
            Social Proof & Client Endorsements
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Trusted by Ambitious Founders and Technical Leaders.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Read how our senior software engineering pods deliver measurable business and technical impact for our clients.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Rating & Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {rev.tag}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author & Quantifiable Impact */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-base font-bold text-white">{rev.author}</div>
                  <div className="text-xs text-slate-400">{rev.role}</div>
                </div>

                <div className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
                  {rev.impact}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metric Trust Strip */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">On-Time Sprint Completion</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10 hidden md:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">96.8%</div>
            <div className="text-xs text-slate-400 mt-0.5">Client Retention & Referral Rate</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10 hidden md:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">0</div>
            <div className="text-xs text-slate-400 mt-0.5">Security Breaches Across All Systems</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10 hidden md:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">4.9 / 5.0</div>
            <div className="text-xs text-slate-400 mt-0.5">Average Architecture Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
