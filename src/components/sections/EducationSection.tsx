"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, Building, Award, Sparkles } from "lucide-react";
import { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  // If no education records exist, don't crash
  const sortedEducation = [...(education || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section
      id="education"
      className="relative py-24 sm:py-32 bg-dark-900 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px] bg-electric-600/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[450px] h-[450px] bg-neon-orange/10 blur-[150px] rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest shadow-inner">
            <GraduationCap className="h-3.5 w-3.5 text-electric-400" />
            <span>Academic & Professional Training</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Education & Qualifications
          </h2>

          <p className="text-base sm:text-lg text-gray-400">
            Foundational knowledge in visual media, motion graphics, and digital communication that powers every creative project.
          </p>
        </div>

        {/* Education Timeline */}
        {sortedEducation.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/5 bg-dark-850/50 p-8">
            <GraduationCap className="h-10 w-10 text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Education records are currently being updated.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-10 space-y-10 sm:space-y-12 before:absolute before:left-2 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-electric-500 via-purple-500 to-neon-orange">
            {sortedEducation.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative group"
              >
                {/* Timeline Bullet Node with Glow */}
                <div className="absolute -left-[30px] sm:-left-[43px] top-3 flex items-center justify-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-950 border-2 border-electric-500 group-hover:border-neon-orange group-hover:scale-125 transition-all duration-300 shadow-md shadow-electric-500/30">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-electric-400 to-neon-orange" />
                  </span>
                </div>

                {/* Timeline Card */}
                <div className="rounded-2xl border border-white/10 bg-dark-850/85 backdrop-blur-xl p-6 sm:p-8 hover:border-electric-500/40 hover:shadow-xl hover:shadow-black/60 transition-all duration-300 group-hover:translate-x-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    {/* Degree & Institution */}
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-electric-300 transition-colors">
                          {edu.degree}
                        </h3>
                        {edu.grade && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-400 shadow-sm">
                            <Award className="h-3 w-3" />
                            <span>{edu.grade}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 pt-0.5">
                        <span className="font-semibold text-neon-orange flex items-center gap-1.5">
                          <Building className="h-4 w-4 text-neon-orange" />
                          <span>{edu.institution}</span>
                        </span>
                        {edu.department && (
                          <>
                            <span className="text-white/20 hidden sm:inline">•</span>
                            <span className="text-xs sm:text-sm text-electric-300 font-medium">
                              {edu.department}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Institution Logo / Icon & Year Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-500/30 bg-electric-500/10 px-3 py-1 text-xs font-semibold text-electric-300">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{edu.startYear} – {edu.endYear}</span>
                      </span>

                      {edu.logoUrl && (
                        <div className="hidden sm:block h-10 w-10 rounded-xl border border-white/10 bg-dark-950/80 p-1 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={edu.logoUrl}
                            alt={edu.institution}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm text-gray-300 mt-3 leading-relaxed border-t border-white/5 pt-3">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

