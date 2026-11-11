"use client";

import { motion } from "framer-motion";
import { Star, MessageSquareQuote, CheckCircle, Sparkles } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const activeTestimonials = testimonials.filter((t) => t.active !== false);

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-dark-900 border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-electric-600/10 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Social Proof & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Client Words & Endorsements
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Real feedback from creative directors, YouTube creators, marketing leaders, and founders I&apos;ve had the privilege to work with.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeTestimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl p-6 sm:p-8 glass-panel-hover"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (item.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <MessageSquareQuote className="h-6 w-6 text-electric-400/40" />
                </div>

                {/* Content */}
                <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed mb-6">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={item.clientName}
                    className="h-11 w-11 rounded-full object-cover border border-electric-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{item.clientName}</span>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-gray-400">
                      {item.clientRole} {item.clientCompany && `• ${item.clientCompany}`}
                    </p>
                  </div>
                </div>

                {item.projectRef && (
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-neon-orange bg-neon-orange/10 px-2 py-0.5 rounded border border-neon-orange/20 max-w-[120px] truncate">
                    {item.projectRef}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
