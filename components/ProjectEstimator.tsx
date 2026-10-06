"use client";

import React, { useState } from "react";
import {
  Calculator,
  Check,
  Zap,
  Clock,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ProjectEstimatorProps {
  onApplyEstimate?: (summary: {
    projectType: string;
    timeline: string;
    features: string[];
    estimateRange: string;
  }) => void;
}

export default function ProjectEstimator({ onApplyEstimate }: ProjectEstimatorProps) {
  const [projectType, setProjectType] = useState<string>("saas");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth",
    "dashboard",
    "ai",
  ]);
  const [timeline, setTimeline] = useState<string>("standard");

  const projectTypes = [
    {
      id: "website",
      name: "Custom Website & CMS",
      basePrice: 5000,
      baseWeeks: 3,
      desc: "High-converting brand platform with 99+ Core Web Vitals.",
    },
    {
      id: "saas",
      name: "Full-Scale SaaS Platform",
      basePrice: 12000,
      baseWeeks: 6,
      desc: "Multi-tenant web application, billing, and team workspaces.",
    },
    {
      id: "ai-agent",
      name: "Autonomous AI Agent Swarm",
      basePrice: 10000,
      baseWeeks: 5,
      desc: "Goal-directed agents, RAG vector pipelines, and workflows.",
    },
    {
      id: "enterprise",
      name: "Enterprise Backend & Telemetry",
      basePrice: 15000,
      baseWeeks: 8,
      desc: "High-throughput microservices, WebSockets, and database RLS.",
    },
  ];

  const featureOptions = [
    { id: "auth", name: "Enterprise Auth & RBAC (MFA/Passkeys)", price: 1500, weeks: 0.5 },
    { id: "dashboard", name: "Real-Time Telemetry & Dashboards", price: 2500, weeks: 1 },
    { id: "ai", name: "AI/LLM Pipeline & RAG Knowledge Search", price: 3500, weeks: 1.5 },
    { id: "payments", name: "Stripe Billing & Subscription Engine", price: 2000, weeks: 0.5 },
    { id: "crm", name: "CRM & Webhook Sync Automation", price: 2000, weeks: 0.5 },
    { id: "devops", name: "Docker, Kubernetes & AWS CI/CD", price: 2500, weeks: 1 },
  ];

  const timelineOptions = [
    { id: "express", name: "Rapid Sprint (Expedited)", multiplier: 1.25, timeReduction: 0.7 },
    { id: "standard", name: "Standard Cadence (Recommended)", multiplier: 1.0, timeReduction: 1.0 },
    { id: "enterprise", name: "Comprehensive Enterprise Rollout", multiplier: 1.15, timeReduction: 1.3 },
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  // Calculations
  const currentType = projectTypes.find((p) => p.id === projectType) || projectTypes[1];
  const featuresTotal = selectedFeatures.reduce((acc, featId) => {
    const feat = featureOptions.find((f) => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  const featuresWeeks = selectedFeatures.reduce((acc, featId) => {
    const feat = featureOptions.find((f) => f.id === featId);
    return acc + (feat ? feat.weeks : 0);
  }, 0);

  const currentTimeline = timelineOptions.find((t) => t.id === timeline) || timelineOptions[1];
  const rawTotal = (currentType.basePrice + featuresTotal) * currentTimeline.multiplier;
  const rawWeeks = Math.max(2, Math.round((currentType.baseWeeks + featuresWeeks) * currentTimeline.timeReduction));

  const minEstimate = Math.round(rawTotal * 0.95);
  const maxEstimate = Math.round(rawTotal * 1.15);
  const estimateString = `$${minEstimate.toLocaleString()} - $${maxEstimate.toLocaleString()}`;

  const handleApply = () => {
    if (onApplyEstimate) {
      onApplyEstimate({
        projectType: currentType.name,
        timeline: currentTimeline.name,
        features: selectedFeatures.map(
          (fId) => featureOptions.find((f) => f.id === fId)?.name || fId
        ),
        estimateRange: estimateString,
      });
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="estimator" className="py-24 relative bg-[#090e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Transparent Scoping Tool
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Interactive Project Scope & Cost Estimator.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Get an immediate, data-backed projection for your engineering scope, estimated duration, and senior pod allocation.
          </p>
        </div>

        {/* Estimator Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/10">
            {/* Step 1: Project Type */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-3">
                1. Select Project Archetype
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      projectType === type.id
                        ? "bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-blue-500/20"
                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">{type.name}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Key Capabilities */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-3">
                2. Select Core Capabilities & Modules
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {featureOptions.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-xl text-left border flex items-center justify-between text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                          : "bg-white/[0.01] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="truncate pr-2">{feat.name}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? "bg-cyan-500 border-cyan-400 text-slate-950"
                            : "border-white/20"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline Cadence */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-3">
                3. Deployment Cadence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {timelineOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTimeline(opt.id)}
                    className={`p-3 rounded-xl text-center border text-xs font-medium transition-all cursor-pointer ${
                      timeline === opt.id
                        ? "bg-blue-600/20 border-blue-400 text-white"
                        : "bg-white/[0.01] border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-white/10 shadow-2xl relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Architectural Estimate
            </div>

            <div className="mb-6">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                Estimated Investment Range
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 mt-1">
                {estimateString}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Includes architectural blueprint, senior engineering, and 1-month post-launch SLA.
              </div>
            </div>

            <div className="space-y-4 py-5 border-y border-white/10 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Target Timeline
                </span>
                <span className="font-mono font-bold text-white">~{rawWeeks} Weeks</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Dedicated Pod Size
                </span>
                <span className="font-mono font-bold text-white">2 Principal + 1 DevSecOps</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Standard
                </span>
                <span className="font-mono font-bold text-emerald-400">SOC2 & OWASP Top 10</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Deliverable Guarantee
                </span>
                <span className="font-mono font-bold text-white">100% Client IP Ownership</span>
              </div>
            </div>

            {/* Lock In Scope Action Button */}
            <div className="mt-8">
              <button
                onClick={handleApply}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                <span>Lock In Scope & Book Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-center text-[11px] text-slate-400 mt-3">
                No credit card or commitment required. Includes free architecture review.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
