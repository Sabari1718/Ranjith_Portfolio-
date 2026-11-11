"use client";

import { motion } from "framer-motion";
import {
  Film,
  Smartphone,
  Sparkles,
  Palette,
  Share2,
  Image as ImageIcon,
  Check,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "smartphone":
        return Smartphone;
      case "sparkles":
        return Sparkles;
      case "palette":
        return Palette;
      case "share2":
        return Share2;
      case "image":
        return ImageIcon;
      default:
        return Film;
    }
  };

  const activeServices = services.filter((s) => s.active !== false);

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-dark-950 border-t border-white/[0.06] overflow-hidden">
      {/* Background radial */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-electric-600/10 blur-[160px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>What I Deliver</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Comprehensive Creative Services
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            End-to-end creative solutions built to elevate your digital presence, retain viewer attention, and drive organic conversions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeServices.map((service, idx) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between rounded-2xl border ${
                  service.popular
                    ? "border-electric-500/50 bg-gradient-to-b from-electric-950/30 to-dark-850/90 shadow-xl shadow-electric-500/10"
                    : "border-white/10 bg-dark-850/70"
                } p-6 sm:p-8 backdrop-blur-xl glass-panel-hover`}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-gradient-to-r from-electric-600 to-neon-orange px-3 py-1 text-[11px] font-bold text-white shadow-lg shadow-electric-600/40">
                    <Flame className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Service Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/10 border border-electric-500/20 text-electric-400 mb-6">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {service.title}
                  </h3>

                  {service.price && (
                    <div className="inline-block rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 mb-3">
                      From {service.price}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                    {service.fullDescription || service.shortDescription}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10 mb-8">
                    {service.features?.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <Check className="h-4 w-4 text-neon-orange flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service CTA */}
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-between w-full rounded-xl border border-white/10 bg-white/5 hover:bg-electric-500 hover:border-electric-500 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-all duration-200"
                >
                  <span>Request This Service</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
