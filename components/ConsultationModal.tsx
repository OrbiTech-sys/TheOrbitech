"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Video,
} from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Tomorrow");
  const [selectedTime, setSelectedTime] = useState<string>("2:00 PM EST");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  const days = ["Today (Rush)", "Tomorrow", "Thursday", "Friday"];
  const times = ["10:00 AM EST", "1:30 PM EST", "2:00 PM EST", "4:30 PM EST"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#0c1220] border border-white/15 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isBooked ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              Architecture Discovery Call Confirmed!
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              We've reserved your session for <strong className="text-cyan-300">{selectedDay} at {selectedTime}</strong>. A calendar invite with a secure Google Meet room has been sent to <span className="text-white font-mono">{email || "your email"}</span>.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 text-left space-y-1.5 max-w-md mx-auto">
              <div className="text-cyan-400 font-bold mb-1">Session Agenda:</div>
              <div>• 00-10m: Business objectives & technical bottleneck analysis</div>
              <div>• 10-20m: System architecture & security compliance roadmap</div>
              <div>• 20-30m: Sprint allocation, timeline & deliverables sign-off</div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <Image
                  src="/team/ceo.jpg"
                  alt="Dr. Evelyn Chen"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5" /> 30-Minute Architecture Session
                </div>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Discovery Call with Dr. Evelyn Chen (CEO)
                </h3>
                <p className="text-xs text-slate-400">
                  Direct discussion with our founder & lead systems architect. No sales pitch.
                </p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Day selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  1. Select Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedDay === day
                          ? "bg-blue-600/20 border-cyan-400 text-white font-bold"
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  2. Select Time Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedTime === time
                          ? "bg-blue-600/20 border-cyan-400 text-white font-bold"
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Lindqvist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Project Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Tech Ventures"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Discovery Session ({selectedDay} @ {selectedTime})</span>
                </button>
                <div className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Strict confidentiality guaranteed under mutual NDA.
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
