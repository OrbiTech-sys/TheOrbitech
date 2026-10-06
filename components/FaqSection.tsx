"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Who owns the code, intellectual property, and infrastructure accounts?",
      answer:
        "You own 100% of the code, intellectual property, and digital assets from the very first git commit. Everything is committed directly into your private GitHub or GitLab organization, and all cloud infrastructure (AWS, Vercel, Supabase, Cloudflare) is provisioned under your corporate accounts. There are zero licensing traps or proprietary vendor locks.",
    },
    {
      question: "How is OrbiTech different from conventional software agencies?",
      answer:
        "Traditional software agencies use senior leaders to win contracts, then immediately delegate execution to junior developers with generic boilerplates. At OrbiTech, every line of production code is written and reviewed by principal engineers and staff architects. Our Founder & CEO directly signs off on all system designs, ensuring zero technical debt.",
    },
    {
      question: "How do you guarantee code security and vulnerability prevention?",
      answer:
        "Security is engineered into our foundation, not added as a patch. We implement zero-trust principles: AES-256 encryption at rest, TLS 1.3 in transit, PostgreSQL Row-Level Security (RLS) for multi-tenant isolation, automated OWASP Top 10 CI/CD security audits, tokenized secret vaults, and strict rate-limiting.",
    },
    {
      question: "What is your typical timeline from architectural kickoff to production launch?",
      answer:
        "Our high-velocity sprint cadence allows us to ship full MVPs, custom web apps, or AI agent pipelines in 4 to 8 weeks. We operate in tight 2-week agile sprints, providing you with interactive live staging preview URLs at the end of each sprint so you can test features with real users immediately.",
    },
    {
      question: "Do you offer post-launch maintenance and continuous 24/7 SLA support?",
      answer:
        "Yes. Every build comes with an inclusive 30-day post-deployment warranty. For long-term continuity, we offer dedicated monthly SLA pods providing 24/7 automated error monitoring (Sentry/Datadog), zero-downtime rolling dependency updates, security vulnerability patching, and continuous feature roadmapping.",
    },
    {
      question: "How do we collaborate and communicate throughout the project?",
      answer:
        "We prioritize absolute transparency. You receive a direct shared Slack or Discord channel with your dedicated engineering pod, weekly video architecture reviews with recorded screen demos, and transparent task tracking via Linear or GitHub Projects. No opaque account managers—you speak directly with the architects writing your code.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 relative bg-[#090e18]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Clear Answers
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Everything you need to know about partnering with our senior software engineering team.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/40 border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white text-base sm:text-lg flex items-center gap-3">
                    <span className="text-cyan-400 text-sm font-mono">0{idx + 1}.</span>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400 bg-cyan-500/10" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
