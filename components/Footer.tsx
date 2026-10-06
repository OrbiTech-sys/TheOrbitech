"use client";

import React from "react";
import {
  Terminal,
  ShieldCheck,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#05080e] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25">
                <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Orbi<span className="text-cyan-400">Tech</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    SYSTEMS
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                  Autonomous Software & AI
                </span>
              </div>
            </a>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              We partner with visionary startups and global enterprises to engineer mission-critical SaaS, resilient backend infrastructures, and autonomous AI agents. Built with zero tech debt and bank-grade security.
            </p>

            {/* System Status Ping */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • 99.99% Global Uptime</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Custom Next.js Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Multi-Tenant SaaS Apps
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Autonomous AI Agents
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Real-Time Dashboards
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Enterprise API Integrations
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Cloud DevOps & Security
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Trust Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Engineering Rigor
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#security" className="hover:text-cyan-300 transition-colors">
                  Zero-Trust Architecture
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-cyan-300 transition-colors">
                  OWASP Top 10 Hardening
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-cyan-300 transition-colors">
                  AES-256 Data Protection
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-cyan-300 transition-colors">
                  Sub-300ms Core Web Vitals
                </a>
              </li>
              <li>
                <a href="#tech-stack" className="hover:text-cyan-300 transition-colors">
                  Production Tech Matrix
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-cyan-300 transition-colors">
                  Scope & Cost Estimator
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Company & Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#overview" className="hover:text-cyan-300 transition-colors">
                  Message from the CEO
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-cyan-300 transition-colors">
                  Senior Engineering Pod
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-cyan-300 transition-colors">
                  Case Studies & Work
                </a>
              </li>
              <li>
                <a href="mailto:ceo@orbitech.dev" className="hover:text-cyan-300 transition-colors">
                  ceo@orbitech.dev
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 OrbiTech Systems Inc. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 & ISO 27001 Aligned
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Security Disclosure
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5 transition-all cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
