"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Video, Palette, Clapperboard } from "lucide-react";
import { HeroData } from "@/types";

interface HeroSectionProps {
  hero: HeroData;
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const serviceTags =
    hero.serviceTags && hero.serviceTags.length > 0
      ? hero.serviceTags
      : ["Cinematic Video Editing", "Viral Short-Form Reels", "Brand & Graphic Identity"];

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden flex items-center">
      {/* Animated Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-40" />

      {/* Glowing Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-electric-600/20 blur-[140px] animate-pulse-slow" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-[450px] w-[450px] rounded-full bg-neon-orange/15 blur-[150px] animate-glow-shift" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-[400px] w-[400px] rounded-full bg-electric-700/15 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Introduction Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-neon-orange animate-ping" />
              <span className="text-xs font-bold tracking-widest text-electric-300 uppercase">
                {hero.greeting || "HELLO, I'M"}
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-xs font-medium text-gray-300">
                {hero.statusBadge || "Available for Projects & Retainers"}
              </span>
            </div>

            {/* Dynamic Name - RANJITH KUMAR */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight text-white uppercase">
                <span className="text-white">{hero.name}</span>
                <span className="text-neon-orange font-normal">.</span>
              </h1>

              {/* Subtitle / Professional Role */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-gradient-purple-orange">
                {hero.title || "Video Editor & Graphic Designer"}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-medium text-gray-200 max-w-2xl mx-auto lg:mx-0">
              &ldquo;{hero.tagline}&rdquo;
            </p>

            {/* Biography Summary */}
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {hero.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={hero.ctaPrimaryLink || "#videos"}
                className="group relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-electric-600/35 hover:shadow-electric-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>{hero.ctaPrimaryText || "Explore My Work"}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#videos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:border-electric-400/50 hover:shadow-glow-purple transition-all duration-200"
              >
                <Video className="h-4 w-4 text-neon-orange" />
                <span>Video Showreel</span>
              </a>

              <a
                href={hero.ctaSecondaryLink || "#contact"}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-gray-300 hover:text-white hover:border-white/20 transition-colors"
              >
                <span>{hero.ctaSecondaryText || "Let's Collaborate"}</span>
              </a>
            </div>

            {/* Floating skill highlights row */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {serviceTags.map((tag, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-dark-850/80 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-electric-500/40 transition-colors"
                >
                  {i % 3 === 0 ? (
                    <Video className="h-3.5 w-3.5 text-electric-400" />
                  ) : i % 3 === 1 ? (
                    <Clapperboard className="h-3.5 w-3.5 text-neon-orange" />
                  ) : (
                    <Palette className="h-3.5 w-3.5 text-purple-400" />
                  )}
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Large Circular Profile Photo with Purple-Orange Gradient Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center items-center py-6"
          >
            {/* Floating Outer Group */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[440px] aspect-square flex items-center justify-center"
            >
              {/* Multi-layered Soft Circular Neon Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-electric-600 via-fuchsia-600 to-neon-orange opacity-40 blur-3xl animate-pulse-slow pointer-events-none" />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-neon-orange/25 via-electric-600/30 to-purple-600/25 blur-xl pointer-events-none" />

              {/* Outer Circular Gradient Border (1:1 Aspect Ratio, border-radius: 50%) */}
              <div className="relative h-full w-full rounded-full p-1.5 sm:p-2 bg-gradient-to-tr from-electric-600 via-fuchsia-500 to-neon-orange shadow-2xl shadow-electric-600/40 aspect-square">
                
                {/* Inner Perfect 1:1 Circle Container */}
                <div className="relative h-full w-full rounded-full overflow-hidden bg-dark-900 border border-white/10 group aspect-square">
                  {hero.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hero.profileImage}
                      alt={hero.name}
                      className="h-full w-full rounded-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  ) : (
                    /* Clean, elegant circular placeholder until photo is uploaded */
                    <div className="h-full w-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 p-6 text-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-electric-600 to-neon-orange p-1 mb-3 shadow-lg">
                        <div className="h-full w-full rounded-full bg-dark-900 flex items-center justify-center text-3xl font-black text-white">
                          {hero.name ? hero.name.split(" ").map((n) => n[0]).join("") : "RK"}
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-white">{hero.name}</h3>
                      <p className="text-[11px] text-electric-400 mt-1">Creative Visual Artist</p>
                    </div>
                  )}

                  {/* Subtle bottom circular vignette for depth */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-950/60 to-transparent" />
                </div>
              </div>

              {/* Floating Badge 1 - Top Left: Video Editing Specialist */}
              <motion.div
                animate={{ y: [0, -8, 0], x: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-6 flex items-center gap-2 rounded-full border border-electric-500/40 bg-dark-900/95 backdrop-blur-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xl shadow-black/80 z-20 whitespace-nowrap"
              >
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-electric-500/20 text-electric-400">
                  <Video className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
                <span>Video Editing Specialist</span>
              </motion.div>

              {/* Floating Badge 2 - Top Right: Motion Graphics */}
              <motion.div
                animate={{ y: [0, 8, 0], x: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-2 -right-3 sm:top-4 sm:-right-6 flex items-center gap-2 rounded-full border border-purple-500/40 bg-dark-900/95 backdrop-blur-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xl shadow-black/80 z-20 whitespace-nowrap"
              >
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-purple-500/20 text-yellow-300">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
                <span>Motion Graphics</span>
              </motion.div>

              {/* Floating Badge 3 - Bottom Right: Creative Designer */}
              <motion.div
                animate={{ y: [0, -7, 0], x: [0, 4, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 flex items-center gap-2 rounded-full border border-neon-orange/40 bg-dark-900/95 backdrop-blur-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xl shadow-black/80 z-20 whitespace-nowrap"
              >
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-neon-orange/20 text-neon-orange">
                  <Palette className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
                <span>Creative Designer</span>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
