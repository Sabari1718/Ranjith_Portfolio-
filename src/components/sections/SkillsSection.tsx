"use client";

import { motion } from "framer-motion";
import {
  Video,
  Sparkles,
  Image as ImageIcon,
  PenTool,
  Sliders,
  Layout,
  Volume2,
  Box,
  Cpu,
} from "lucide-react";
import { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sortedSkills = (skills || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const getSkillIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "video":
        return Video;
      case "sparkles":
        return Sparkles;
      case "image":
        return ImageIcon;
      case "pentool":
        return PenTool;
      case "sliders":
        return Sliders;
      case "layout":
        return Layout;
      case "volume2":
        return Volume2;
      case "box":
        return Box;
      default:
        return Cpu;
    }
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32 bg-dark-900 border-t border-white/[0.06] overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-electric-600/10 blur-[140px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest">
            <Cpu className="h-3.5 w-3.5" />
            <span>Mastered Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Tools & Technical Expertise
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Professional proficiency across industry-standard video editing, color science, motion design, and graphic design ecosystems.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedSkills.map((skill, idx) => {
            const Icon = getSkillIcon(skill.iconName);
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative rounded-2xl border border-white/10 bg-dark-850/70 backdrop-blur-xl p-5 sm:p-6 glass-panel-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/10 border border-electric-500/20 text-electric-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-neon-orange px-2.5 py-1 rounded-full bg-neon-orange/10 border border-neon-orange/20">
                    {skill.experienceYears}y exp
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-base font-bold text-white">{skill.name}</h3>
                  <p className="text-xs font-medium text-gray-400">{skill.category}</p>
                </div>

                {/* Proficiency Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Mastery</span>
                    <span className="text-white">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-dark-950 border border-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: idx * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-electric-500 to-neon-orange"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

