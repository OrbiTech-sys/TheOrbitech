"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Terminal,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Layers,
  Cpu,
  Lock,
  Users,
} from "lucide-react";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", href: "#overview" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Tech Stack", href: "#tech-stack" },
    { name: "Security", href: "#security" },
    { name: "Team", href: "#team" },
    { name: "Estimator", href: "#estimator" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Availability Status & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Q2/Q3 Projects</span>
            </div>

            <button
              onClick={onOpenConsultation}
              className="relative group inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              <span>Book Call</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-[#0d1424] border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 w-fit">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              <span>Available for Q2/Q3 Projects</span>
            </div>
            <div className="h-[1px] bg-white/10 my-1" />
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/[0.04] rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="h-[1px] bg-white/10 my-1" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenConsultation) onOpenConsultation();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Schedule Architecture Discovery</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
