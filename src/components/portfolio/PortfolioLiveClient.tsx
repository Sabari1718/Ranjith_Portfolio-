"use client";

import { useState, useEffect, useCallback } from "react";
import { PortfolioData } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import VideoPortfolioSection from "@/components/sections/VideoPortfolioSection";
import GraphicDesignSection from "@/components/sections/GraphicDesignSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

interface PortfolioLiveClientProps {
  initialData: PortfolioData;
}

export default function PortfolioLiveClient({ initialData }: PortfolioLiveClientProps) {
  const [data, setData] = useState<PortfolioData>(initialData);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch {
      // Keep initial data on network error
    }
  }, []);

  useEffect(() => {
    // 1. Initial live sync on mount
    refreshData();

    // 2. Auto-sync whenever the user switches back from admin tab to this tab
    const handleFocus = () => {
      refreshData();
    };

    // 3. Auto-sync on localStorage broadcast event when admin updates anything
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_updated" || e.key === "portfolio_sync_trigger") {
        refreshData();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshData]);

  return (
    <main className="relative bg-dark-950 text-foreground overflow-x-hidden min-h-screen">
      {/* Interactive agency cursor for desktop */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar name={data.hero.name} statusBadge={data.hero.statusBadge} />

      {/* Sections */}
      <HeroSection hero={data.hero} />
      <AboutSection about={data.about} name={data.hero.name} />
      <VideoPortfolioSection videos={data.videos} />
      <GraphicDesignSection designs={data.designs} />
      <ServicesSection services={data.services} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection experience={data.experience} />
      <EducationSection education={data.education} />
      <TestimonialsSection testimonials={data.testimonials} />
      <ContactSection settings={data.settings} name={data.hero.name} />

      {/* Footer */}
      <Footer settings={data.settings} name={data.hero.name} />
    </main>
  );
}

