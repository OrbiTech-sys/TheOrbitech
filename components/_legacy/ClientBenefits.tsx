"use client";

import React from "react";
import {
  Check,
  X,
  Shield,
  Zap,
  Users,
  Code,
  Sparkles,
  Lock,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ClientBenefits() {
  const comparisonRows = [
    {
      feature: "Seniority & Team Composition",
      orbitech: "Exclusively Principal & Senior Architects",
      agency: "Junior developers with high turnover",
      freelance: "Single isolated developer with blind spots",
    },
    {
      feature: "Executive & CEO Accountability",
      orbitech: "Direct weekly review with Founder & CEO",
      agency: "Opaque account manager intermediary",
      freelance: "No architectural oversight",
    },
    {
      feature: "Security & Threat Mitigation",
      orbitech: "Zero-Trust, OWASP Top 10, AES-256 by default",
      agency: "Treated as paid add-on or overlooked",
      freelance: "Basic password hashing only",
    },
    {
      feature: "Intellectual Property Ownership",
      orbitech: "100% Client IP Ownership from Day 1",
      agency: "Proprietary lock-in & licensing fees",
      freelance: "Ambiguous licensing contracts",
    },
    {
      feature: "Delivery Cadence & Visibility",
      orbitech: "2-Week Sprints with Live Staging Previews",
      agency: "Infrequent milestone dumps with delays",
      freelance: "Unpredictable delivery schedule",
    },
    {
      feature: "Post-Launch Warranty & SLA",
      orbitech: "99.99% Uptime SLA & 24/7 Monitoring",
      agency: "Expensive ongoing hourly retainer",
      freelance: "Disappears after final payment",
    },
  ];

  return (
    <section className="py-24 relative bg-[#090e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            The OrbiTech Advantage
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Why Visionary Founders Choose Us Over Traditional Agencies.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            We operate as your dedicated engineering strike team. Transparent, relentless, and obsessed with your business success.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden shadow-2xl mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/70">
                  <th className="py-5 px-6 font-semibold text-slate-300 w-1/4">Engineering Criteria</th>
                  <th className="py-5 px-6 font-bold text-white bg-blue-600/15 border-x border-blue-500/30 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="text-cyan-300 text-base">OrbiTech Dedicated Pod</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 font-medium text-slate-400 w-1/4">Typical Software Agency</th>
                  <th className="py-5 px-6 font-medium text-slate-400 w-1/6">Freelancer Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-200">{row.feature}</td>
                    <td className="py-4 px-6 font-semibold text-cyan-300 bg-blue-600/10 border-x border-blue-500/20 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{row.orbitech}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.agency}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.freelance}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Pillars of Client Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Rapid 2-Week Sprints</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No months of radio silence. You receive working staging preview deployments every two weeks to test with real users.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Clean IP Ownership</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full legal transfer of all intellectual property, git history, configuration files, and cloud access credentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Direct Slack & Syncs</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Direct shared Slack / Discord channel with your principal engineers. Instant technical clarity without middlemen.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Predictable Fixed Scope</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transparent milestone agreements. Clear deliverables and fixed sprint commitments that eliminate surprise invoices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
