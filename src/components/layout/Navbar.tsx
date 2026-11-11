"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Film, Sparkles } from "lucide-react";

interface NavbarProps {
  name?: string;
  statusBadge?: string; // Kept in interface for backward compatibility, not rendered in navbar
}

interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

const navLinks: NavItem[] = [
  { label: "About", href: "#hero", sectionId: "hero" },
  { label: "Videos", href: "#videos", sectionId: "videos" },
  { label: "Designs", href: "#designs", sectionId: "designs" },
  { label: "Services", href: "#services", sectionId: "services" },
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Experience", href: "#experience", sectionId: "experience" },
  { label: "Education", href: "#education", sectionId: "education" },
  { label: "Reviews", href: "#testimonials", sectionId: "testimonials" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export default function Navbar({ name = "Ranjith Kumar" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("About");

  // Handle direct URL navigation, back/forward, and hash checks
  const handleHashCheck = useCallback(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.toLowerCase();

    // If navigated directly to #about or #hero or empty
    if (hash === "#about" || hash === "#hero" || !hash || hash === "#") {
      setActiveSection("About");
      if (hash === "#about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname + "#hero");
        }
      }
      return;
    }

    const matched = navLinks.find(
      (item) => item.href.toLowerCase() === hash || `#${item.sectionId}`.toLowerCase() === hash
    );
    if (matched) {
      setActiveSection(matched.label);
    }
  }, []);

  useEffect(() => {
    handleHashCheck();

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // If near top of page, always make About active
      if (window.scrollY < 200) {
        setActiveSection("About");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashCheck);
    window.addEventListener("popstate", handleHashCheck);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashCheck);
      window.removeEventListener("popstate", handleHashCheck);
    };
  }, [handleHashCheck]);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionElements = navLinks
      .map((item) => document.getElementById(item.sectionId))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 200) {
          setActiveSection("About");
          return;
        }

        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const matched = navLinks.find((link) => link.sectionId === visibleEntry.target.id);
          if (matched) {
            setActiveSection(matched.label);
          }
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavItem) => {
    if (link.label === "About" || link.sectionId === "hero") {
      e.preventDefault();
      setActiveSection("About");
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.history.pushState) {
        window.history.pushState(null, "", window.location.pathname + "#hero");
      }
      return;
    }

    setActiveSection(link.label);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Pill Navbar Shell */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <nav
            aria-label="Main Navigation"
            className={`pointer-events-auto relative flex items-center justify-between rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 ${
              scrolled
                ? "bg-dark-950/85 backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/80 ring-1 ring-electric-500/20"
                : "bg-dark-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/40"
            }`}
          >
            {/* Ambient subtle glow along the floating pill bottom */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-electric-600/30 via-transparent to-neon-orange/25 opacity-50 blur-sm" />

            {/* Brand Logo & Name */}
            <Link
              href="/#hero"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("About");
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (window.history.pushState) {
                  window.history.pushState(null, "", window.location.pathname + "#hero");
                }
              }}
              className="relative z-10 group flex items-center gap-3 flex-shrink-0"
            >
              {/* Premium Film/Frame Icon with glowing gradient */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-electric-600 to-neon-orange opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
                <span className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-electric-600 via-purple-600 to-neon-orange text-white shadow-md shadow-electric-600/30 group-hover:scale-105 transition-transform">
                  <Film className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </div>

              {/* Brand Typography: Strictly on one line on desktop */}
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm sm:text-base font-black tracking-wider text-white uppercase flex items-center gap-1 group-hover:text-electric-200 transition-colors">
                  <span>{name.toUpperCase()}</span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-electric-400 to-neon-orange animate-pulse" />
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-extrabold tracking-[0.25em] text-gray-400 uppercase -mt-0.5 group-hover:text-neon-orange transition-colors">
                  CREATIVE STUDIO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Pill Island */}
            <div className="hidden lg:flex items-center space-x-1 rounded-full border border-white/[0.08] bg-dark-950/60 backdrop-blur-md px-2 py-1 shadow-inner relative z-10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-md shadow-electric-600/25"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Right Action: Let's Collaborate (Availability badge completely removed) */}
            <div className="hidden sm:flex items-center gap-3 relative z-10">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, navLinks[navLinks.length - 1])}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:shadow-electric-600/50 hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <span>Let&apos;s Collaborate</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden relative z-10">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full p-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 top-20 z-40 rounded-3xl border border-white/10 bg-dark-900/95 backdrop-blur-2xl p-6 shadow-2xl shadow-black/90 lg:hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow-md shadow-electric-600/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <Sparkles className="h-4 w-4" />}
                  </a>
                );
              })}

              <div className="pt-4 border-t border-white/10 mt-2">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, navLinks[navLinks.length - 1])}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange py-3 text-xs font-bold text-white shadow-lg shadow-electric-600/30"
                >
                  <span>Let&apos;s Collaborate</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
