"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Experience } from "@/types";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="relative py-24 sm:py-32 bg-dark-950 border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-10 left-10 w-[400px] h-[400px] bg-electric-600/10 blur-[140px] rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-orange/30 bg-neon-orange/10 px-4 py-1.5 text-xs font-bold text-neon-orange uppercase tracking-widest">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Work Experience & Milestones
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            A proven career path of driving viewer engagement, brand growth, and creative leadership across agencies and high-growth media studios.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-electric-500 before:via-purple-500 before:to-neon-orange">
          {experience.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Bullet */}
              <span className="absolute -left-[29px] sm:-left-[35px] top-2 flex h-5 w-5 items-center justify-center rounded-full bg-dark-950 border-2 border-electric-500 group-hover:border-neon-orange group-hover:scale-110 transition-all">
                <span className={`h-2 w-2 rounded-full ${exp.current ? "bg-neon-orange animate-ping" : "bg-electric-400"}`} />
              </span>

              {/* Experience Card */}
              <div className="rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl p-6 sm:p-8 glass-panel-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {exp.companyLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={exp.companyLogo}
                        alt={exp.company}
                        className="h-10 w-10 rounded-xl object-contain bg-dark-900 border border-white/10 p-1.5 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-electric-600/20 text-electric-400 font-bold flex items-center justify-center text-sm border border-electric-500/20 flex-shrink-0">
                        {exp.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-electric-300 transition-colors">
                          {exp.role}
                        </h3>
                        {exp.employmentType && (
                          <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-gray-300">
                            {exp.employmentType}
                          </span>
                        )}
                        {exp.current && (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Present
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-neon-orange">
                        {exp.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-electric-400" />
                      <span>{exp.period}</span>
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    {exp.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
