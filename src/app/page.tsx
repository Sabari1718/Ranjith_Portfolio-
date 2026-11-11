import { getPortfolioData } from "@/lib/storage";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getPortfolioData();

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
