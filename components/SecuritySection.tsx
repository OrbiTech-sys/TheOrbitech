"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Users,
  Network,
  Zap,
  Search,
  Server,
  Wrench,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  BadgeAlert,
  ArrowRight,
} from "lucide-react";

export default function SecuritySection() {
  const [selectedAudit, setSelectedAudit] = useState<string>("auth");

  const pillars = [
    {
      id: "web-sec",
      title: "Website Security & WAF",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      description:
        "Comprehensive perimeter protection against cyber threats. Strict Content Security Policy (CSP), automated TLS 1.3 certificates, and Cloudflare WAF preventing XSS, CSRF, and SQL injection.",
      badges: ["OWASP Top 10 Defended", "Strict CSP & HSTS", "DDoS Mitigation"],
    },
    {
      id: "data-prot",
      title: "Data Protection & Encryption",
      icon: Lock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      description:
        "Bank-grade cryptographic standards. AES-256 field-level encryption for sensitive database columns, encrypted disk volumes, zero-knowledge data flows, and full GDPR / CCPA compliance.",
      badges: ["AES-256 at Rest", "TLS 1.3 in Transit", "Zero-Knowledge Architecture"],
    },
    {
      id: "auth",
      title: "Enterprise Authentication & MFA",
      icon: KeyRound,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      description:
        "Battle-tested authentication protocols. Support for Passkeys (WebAuthn biometric), SAML 2.0 / SSO enterprise identity providers (Okta, Azure AD), and secure JWT rotation.",
      badges: ["Biometric Passkeys", "SAML SSO / OAuth2", "Multi-Factor Auth (MFA)"],
    },
    {
      id: "rbac",
      title: "Granular Role-Based Access (RBAC)",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      description:
        "Multi-tenant data isolation using PostgreSQL Row-Level Security (RLS). Granular role permissions, administrative privilege isolation, and immutable tamper-evident audit trails.",
      badges: ["PostgreSQL RLS", "Least-Privilege Model", "Immutable Audit Logs"],
    },
    {
      id: "api-sec",
      title: "API Security & Rate Limiting",
      icon: Network,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      description:
        "Hardened API gateways with token bucket rate-limiting, HMAC payload signature verification, API secret vaulting (AWS Secrets Manager), and automated vulnerability linting.",
      badges: ["HMAC Verification", "Token Bucket Throttling", "Zero Secret Leakage"],
    },
    {
      id: "perf",
      title: "Performance & Core Web Vitals",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      description:
        "Sub-second page speeds guaranteed. React Server Components, Turbopack optimizations, WebP/AVIF automated image pipelines, and global edge caching delivering 99+ Lighthouse metrics.",
      badges: ["Sub-300ms Page Load", "99+ Lighthouse Score", "Edge CDN Routing"],
    },
    {
      id: "seo",
      title: "SEO Architecture & Semantic Web",
      icon: Search,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      description:
        "Search engine dominance built in. Semantic HTML5 markup, automated dynamic sitemaps, JSON-LD rich snippet schemas, and OpenGraph social metadata rendering.",
      badges: ["JSON-LD Schemas", "Dynamic XML Sitemaps", "Core Web Vitals Optimized"],
    },
    {
      id: "scale",
      title: "Scalability & 24/7 SLA Maintenance",
      icon: Server,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/20",
      description:
        "Elastic auto-scaling Kubernetes and serverless backends engineered for 99.99% uptime. Continuous real-time telemetry (Sentry/Datadog), automated health-check pings, and proactive patch management.",
      badges: ["99.99% SLA Uptime", "Zero-Downtime Deploys", "<2hr Incident SLA"],
    },
  ];

  return (
    <section id="security" className="py-24 relative bg-[#070b13] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
            Security-First Engineering
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Security is Never an Afterthought.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every platform we build undergoes rigorous architectural threat modeling. From client auth and database isolation to API rate limiting and sub-second performance.
          </p>
        </div>

        {/* Compliance Badges Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
          <div className="p-3">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              SOC2 Type II Aligned
            </div>
            <div className="text-xs text-slate-400 mt-1">Audit-ready controls & logs</div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              OWASP Top 10 Verified
            </div>
            <div className="text-xs text-slate-400 mt-1">Automated vulnerability scans</div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              GDPR & CCPA Compliant
            </div>
            <div className="text-xs text-slate-400 mt-1">Data privacy & right-to-forget</div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              HIPAA & PCI Ready
            </div>
            <div className="text-xs text-slate-400 mt-1">Field encryption for health/payments</div>
          </div>
        </div>

        {/* 8 Core Security & Performance Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-emerald-500/30 hover:bg-slate-900/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${pillar.bg} flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  {pillar.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Audit Guarantee Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-emerald-950/30 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Complimentary Architecture & Security Audit for Every New Engagement
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Before writing code, our CEO & Security Lead evaluate your existing systems or blueprints for potential attack vectors and scalability bottlenecks.
              </p>
            </div>
          </div>

          <a
            href="#estimator"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Claim Security Review
          </a>
        </div>
      </div>
    </section>
  );
}
