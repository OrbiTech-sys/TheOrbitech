"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CeoOverview from "@/components/CeoOverview";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import TechStackSection from "@/components/TechStackSection";
import SecuritySection from "@/components/SecuritySection";
import ClientBenefits from "@/components/ClientBenefits";
import TeamSection from "@/components/TeamSection";
import ProjectEstimator from "@/components/ProjectEstimator";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [estimatorData, setEstimatorData] = useState<{
    projectType: string;
    timeline: string;
    features: string[];
    estimateRange: string;
  } | null>(null);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyEstimate = (data: {
    projectType: string;
    timeline: string;
    features: string[];
    estimateRange: string;
  }) => {
    setEstimatorData(data);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Main Page Flow */}
      <main>
        {/* Hero with live HUD & CEO value proposition */}
        <Hero onOpenConsultation={() => setIsConsultationOpen(true)} />

        {/* Startup Overview & CEO Commitment Letter */}
        <CeoOverview onOpenConsultation={() => setIsConsultationOpen(true)} />

        {/* 10 Core Services with Category Filters */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* Production Websites & Projects Built with Architecture Modals */}
        <ProjectsSection />

        {/* Skills & Modern Tech Matrix */}
        <TechStackSection />

        {/* Security-First Architecture & Compliance */}
        <SecuritySection />

        {/* Client Benefits & Agency Comparison Matrix */}
        <ClientBenefits />

        {/* Highly Qualified Senior Team Pods with Portraits */}
        <TeamSection />

        {/* Interactive Scope & Cost Estimator */}
        <ProjectEstimator onApplyEstimate={handleApplyEstimate} />

        {/* Client Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Conversion-Focused Contact & Brief Submission */}
        <ContactSection
          initialProjectType={estimatorData?.projectType || selectedService}
          initialEstimate={estimatorData?.estimateRange}
          initialFeatures={estimatorData?.features}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* 30-Min Architecture Discovery Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
