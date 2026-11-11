"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Send,
  MessageCircle,
  Palette,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import confetti from "canvas-confetti";
import { SiteSettings } from "@/types";

interface ContactSectionProps {
  settings?: SiteSettings;
  name?: string;
}

export default function ContactSection({ settings, name = "Ranjith Kumar" }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterested: "Cinematic Video Editing",
    budget: "$1,000 - $3,000",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || "Message sent successfully! I will reply within 24 hours.",
        });

        // Trigger victory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ff6b00", "#ec4899", "#ffffff"],
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceInterested: "Cinematic Video Editing",
          budget: "$1,000 - $3,000",
          message: "",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Something went wrong. Please reach out via WhatsApp or email directly.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error. Please message me directly on WhatsApp or email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = settings?.whatsapp?.replace(/[^0-9]/g, "") || "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(name)},%20I%20saw%20your%20creative%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!`;

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-dark-950 border-t border-white/[0.06] overflow-hidden">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-[600px] h-[400px] bg-electric-600/15 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute top-10 right-10 w-[450px] h-[450px] bg-neon-orange/15 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-orange/30 bg-neon-orange/10 px-4 py-1.5 text-xs font-bold text-neon-orange uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Start a Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Let&apos;s Build Something Unforgettable
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Have footage ready for cinematic editing, need viral short-form growth, or looking for a distinct visual brand identity? Drop a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Channels & Fast Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Direct Channels</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Prefer immediate messaging or email? Feel free to reach out directly through any of these verified channels.
              </p>

              <div className="space-y-4">
                {/* WhatsApp Fast CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 hover:bg-emerald-500/20 transition-all group"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/40">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Fastest Response
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Chat on WhatsApp
                    </span>
                  </div>
                </a>

                {/* Email */}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all group"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/20 text-electric-400 border border-electric-500/30">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-xs font-medium text-gray-400 block">Direct Inquiries</span>
                      <span className="text-sm font-semibold text-white group-hover:text-electric-300 transition-colors">
                        {settings.email}
                      </span>
                    </div>
                  </a>
                )}

                {/* Phone */}
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all group"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-xs font-medium text-gray-400 block">Call / Phone</span>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-orange transition-colors">
                        {settings.phone}
                      </span>
                    </div>
                  </a>
                )}
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3">
                  Follow My Creative Journey
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {settings?.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:border-pink-500 hover:text-pink-400 transition-colors"
                      title="Instagram"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  )}
                  {settings?.youtube && (
                    <a
                      href={settings.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:border-red-500 hover:text-red-400 transition-colors"
                      title="YouTube"
                    >
                      <YoutubeIcon className="h-4 w-4" />
                    </a>
                  )}
                  {settings?.linkedin && (
                    <a
                      href={settings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                  {settings?.behance && (
                    <a
                      href={settings.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:border-blue-400 hover:text-blue-300 transition-colors"
                      title="Behance"
                    >
                      <Palette className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Direct Message</h3>
              <p className="text-sm text-gray-400 mb-8">
                Fill in the project details and I&apos;ll get back to you with custom ideas, turnaround time, and an estimate.
              </p>

              {statusMessage && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-sm font-medium ${
                    statusMessage.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. marcus@brand.com"
                      className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone / WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 555-0192"
                      className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                    />
                  </div>

                  {/* Service Needed */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Service Interested In
                    </label>
                    <select
                      value={formData.serviceInterested}
                      onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                    >
                      <option value="Cinematic Video Editing">Cinematic Video Editing</option>
                      <option value="Reels & Shorts Viral Editing">Reels & Shorts Viral Editing</option>
                      <option value="Motion Graphics & VFX">Motion Graphics & VFX</option>
                      <option value="Brand Identity & Logo Design">Brand Identity & Logo Design</option>
                      <option value="YouTube Thumbnails">High-CTR YouTube Thumbnails</option>
                      <option value="Social Media & Ad Creatives">Social Media & Ad Creatives</option>
                      <option value="Monthly Retainer Partnership">Monthly Retainer Partnership</option>
                      <option value="Other Project">Other / Custom Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Estimated Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                  >
                    <option value="<$500">&lt; $500 (Small quick cut / assets)</option>
                    <option value="$500 - $1,000">$500 - $1,000 (Short promo / thumbnails pack)</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000 (Commercial cut / brand package)</option>
                    <option value="$3,000 - $6,000">$3,000 - $6,000 (Full campaign / multiple deliverables)</option>
                    <option value="$6,000+">$6,000+ (Monthly retainer / large-scale production)</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Project Details & Scope *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your video footage, target audience, reference style, deadline, and desired deliverables..."
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-8 py-4 text-sm font-bold text-white shadow-lg shadow-electric-600/35 hover:shadow-electric-600/50 hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
