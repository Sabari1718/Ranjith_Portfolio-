"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Clock, Award, Users, TrendingUp, Quote } from "lucide-react";
import { AboutData } from "@/types";

interface AboutSectionProps {
  about: AboutData;
  name?: string;
}

export default function AboutSection({ about, name = "Ranjith Kumar" }: AboutSectionProps) {
  const stats = [
    {
      label: "Years of Experience",
      value: `${about.yearsOfExperience}+`,
      icon: Clock,
      color: "text-electric-400",
      border: "border-electric-500/20",
    },
    {
      label: "Projects Completed",
      value: `${about.projectsCompleted}+`,
      icon: Award,
      color: "text-neon-orange",
      border: "border-neon-orange/20",
    },
    {
      label: "Happy Global Clients",
      value: `${about.happyClients}+`,
      icon: Users,
      color: "text-purple-400",
      border: "border-purple-500/20",
    },
    {
      label: "Client Retention Rate",
      value: `${about.clientRetentionRate}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <section id="story" className="relative py-24 sm:py-32 bg-dark-900 border-t border-white/[0.06] overflow-hidden">
      {/* Subtle Glows */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-electric-600/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-neon-orange/10 blur-[140px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Behind The Visuals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {about.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            {about.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-2xl border ${stat.border} bg-dark-850/70 backdrop-blur-xl p-6 sm:p-8 text-center glass-panel-hover overflow-hidden`}
              >
                <div className="flex justify-center mb-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Story, Quote & Creative Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Biography & Strengths */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>My Creative Philosophy</span>
              <span className="h-1.5 w-1.5 rounded-full bg-neon-orange" />
            </h3>

            {about.aboutImage && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.aboutImage}
                  alt={name}
                  className="h-full w-full object-cover filter brightness-[1.03]"
                />
              </div>
            )}

            <div className="space-y-4 text-base text-gray-300 leading-relaxed">
              <p>{about.bioParagraph1}</p>
              <p>{about.bioParagraph2}</p>
            </div>

            {/* Philosophy Quote Card */}
            {about.quote && (
              <div className="relative rounded-2xl border border-electric-500/25 bg-gradient-to-r from-electric-950/40 to-dark-850 p-6 backdrop-blur-md">
                <Quote className="h-8 w-8 text-electric-400/40 mb-2" />
                <p className="text-base sm:text-lg italic font-medium text-gray-200">
                  &ldquo;{about.quote}&rdquo;
                </p>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-neon-orange">
                  — {name}
                </div>
              </div>
            )}

            {/* Key Strengths */}
            <div className="pt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                Core Superpowers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.keyStrengths?.map((strength, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850/50 p-3 text-sm font-medium text-gray-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Creative Journey Timeline */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>The Journey So Far</span>
              <span className="h-1.5 w-1.5 rounded-full bg-electric-500" />
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-electric-500 before:via-purple-500 before:to-neon-orange">
              {about.creativeJourney?.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Node */}
                  <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dark-950 border-2 border-electric-400 group-hover:border-neon-orange transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric-400 group-hover:bg-neon-orange transition-colors" />
                  </span>

                  <div className="rounded-2xl border border-white/10 bg-dark-850/70 p-5 backdrop-blur-md glass-panel-hover">
                    <span className="text-xs font-bold uppercase tracking-wider text-neon-orange">
                      {step.year}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
