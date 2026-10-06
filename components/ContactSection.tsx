"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Terminal,
  FileText,
  Lock,
} from "lucide-react";

interface ContactSectionProps {
  initialProjectType?: string;
  initialEstimate?: string;
  initialFeatures?: string[];
}

export default function ContactSection({
  initialProjectType,
  initialEstimate,
  initialFeatures,
}: ContactSectionProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Full-Scale SaaS Platform",
    budget: "$25,000 - $50,000",
    timeline: "Standard (6 - 8 Weeks)",
    message: "",
  });

  // If initial values come from estimator
  useEffect(() => {
    if (initialProjectType) {
      setFormData((prev) => ({
        ...prev,
        projectType: initialProjectType,
        message: initialFeatures?.length
          ? `Selected Capabilities from Estimator:\n- ${initialFeatures.join("\n- ")}\n\nProject Notes:`
          : prev.message,
      }));
    }
  }, [initialProjectType, initialFeatures]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate real submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 900);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#070b13] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
            Initiate Technical Discovery
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Let's Engineer Your Next Competitive Advantage.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Schedule a 30-minute discovery call directly with our Founder & CEO, Dr. Evelyn Chen, and Lead Architect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Executive Direct Contacts & Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Direct Executive Channels
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                We believe in direct technical communication without gatekeepers. Reach out directly to discuss architecture, timeline, and pricing.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="mailto:ceo@orbitech.dev"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">DIRECT CEO INBOX</div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      ceo@orbitech.dev
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+14158906724"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">DIRECT LINE / WHATSAPP</div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      +1 (415) 890-ORBI (6724)
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">GLOBAL HEADQUARTERS</div>
                    <div className="text-sm font-medium text-white">
                      San Francisco, CA & Distributed Global Pods
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees List */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sub-4 hour response time during business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mutual NDA executed prior to sensitive technical sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Complimentary architecture review and system blueprint</span>
                </div>
              </div>
            </div>

            {/* Live Availability Box */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Currently Booking Q2/Q3 Sprints</div>
                  <div className="text-[11px] text-slate-400">2 Dedicated Senior Pods Available</div>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>

          {/* Interactive Consultation Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/10 shadow-2xl relative">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Inquiry Received & Fast-Tracked
                    </h3>
                    <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                      Thank you, <strong className="text-white">{formData.name || "partner"}</strong>.
                      Your project brief has been delivered directly to Dr. Evelyn Chen and our lead architect. We will review your requirements and respond within 4 business hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 max-w-sm mx-auto text-left text-xs text-slate-300 space-y-1.5 font-mono">
                    <div className="text-cyan-400 font-bold">Project Summary:</div>
                    <div>• Scope: {formData.projectType}</div>
                    <div>• Budget: {formData.budget}</div>
                    <div>• Target Timeline: {formData.timeline}</div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href="mailto:ceo@orbitech.dev"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                    >
                      Email CEO Directly
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {initialEstimate && (
                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Attached Estimator Range: <strong>{initialEstimate}</strong>
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-cyan-500/20 px-2 py-0.5 rounded">
                        Auto-Scoped
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Vance"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@yourcompany.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Company or Startup Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Vance Labs, Inc."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Primary System Archetype
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#0e1628] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="Custom Website & CMS">Custom Website & CMS</option>
                        <option value="Full-Scale SaaS Platform">Full-Scale SaaS Platform</option>
                        <option value="Autonomous AI Agent Swarm">Autonomous AI Agent Swarm</option>
                        <option value="Enterprise Backend & Telemetry">Enterprise Backend & Telemetry</option>
                        <option value="CRM & Webhook Automation">CRM & Webhook Automation</option>
                        <option value="Cloud DevOps & Security Hardening">Cloud DevOps & Security Hardening</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Estimated Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0e1628] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000+ Enterprise Tier">$100,000+ Enterprise Tier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Target Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0e1628] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="Rapid Sprint (3 - 4 Weeks)">Rapid Sprint (3 - 4 Weeks)</option>
                        <option value="Standard (6 - 8 Weeks)">Standard (6 - 8 Weeks)</option>
                        <option value="Comprehensive (10 - 12 Weeks)">Comprehensive (10 - 12 Weeks)</option>
                        <option value="Ongoing Architecture SLA">Ongoing Architecture SLA</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Project Vision, Key Requirements & Challenges
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the product you're building, target audience, specific security or compliance needs, and current technical state..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Transmitting Encrypted Brief...
                      </span>
                    ) : (
                      <>
                        <span>Submit Project Brief to CEO & Architects</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
