"use client";

import {
  Film,
  Mail,
  Phone,
  ArrowUp,
  Shield,
  Palette,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon, FacebookIcon, DribbbleIcon } from "@/components/ui/BrandIcons";
import { SiteSettings } from "@/types";
import Link from "next/link";

interface FooterProps {
  settings?: SiteSettings;
  name?: string;
}

export default function Footer({ settings, name = "Ranjith Kumar" }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.08] bg-dark-950 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-electric-600/10 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-electric-600 to-neon-orange text-white shadow-lg shadow-electric-600/30">
                <Film className="h-5 w-5" />
              </span>
              <span className="text-2xl font-black tracking-wider text-white">
                {name.toUpperCase()}<span className="text-neon-orange">.</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-gray-400 leading-relaxed">
              {settings?.footerText ||
                "Crafting high-impact cinematic video edits, viral short-form social campaigns, and memorable brand identities for creators, agencies, and global brands."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {settings?.isAvailable !== false ? "Available for Projects & Retainers" : "Currently Booked for Projects"}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-electric-400 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors"
                >
                  About (Home)
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-white transition-colors">
                  Video Portfolio
                </a>
              </li>
              <li>
                <a href="#designs" className="hover:text-white transition-colors">
                  Graphic Design
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition-colors">
                  Tools & Skills
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">
                  Work Experience
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-white transition-colors">
                  Education & Qualifications
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neon-orange mb-4">
              Connect With Me
            </h4>
            <div className="flex flex-col space-y-3 text-sm text-gray-400">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-electric-400" />
                  <span className="truncate">{settings.email}</span>
                </a>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-neon-orange" />
                  <span>{settings.phone}</span>
                </a>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-pink-500 hover:text-pink-400 transition-colors"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-red-500 hover:text-red-400 transition-colors"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-blue-400 hover:text-blue-300 transition-colors"
                    title="Behance"
                  >
                    <Palette className="h-4 w-4" />
                  </a>
                )}
                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-blue-600 hover:text-blue-500 transition-colors"
                    title="Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {settings?.dribbble && (
                  <a
                    href={settings.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-pink-400 hover:text-pink-300 transition-colors"
                    title="Dribbble"
                  >
                    <DribbbleIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            {settings?.copyrightText ||
              `© ${currentYear} ${name}. All rights reserved. Crafted with passion & precision.`}
          </p>

          <div className="flex items-center space-x-6">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-gray-500 hover:text-electric-400 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-electric-400 transition-colors">
                <ArrowUp className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
