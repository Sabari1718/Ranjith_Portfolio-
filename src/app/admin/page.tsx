"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  Palette,
  Briefcase,
  Mail,
  GraduationCap,
  MessageSquareQuote,
  Cpu,
  Award,
  ArrowRight,
  Sparkles,
  Database,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Enquiry } from "@/types";

interface StatsData {
  totalVideos: number;
  featuredVideos: number;
  totalDesigns: number;
  featuredDesigns: number;
  totalServices: number;
  totalSkills: number;
  totalExperience: number;
  totalEducation: number;
  totalTestimonials: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  storageMode: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setStats(data.stats);
          setRecentEnquiries(data.recentEnquiries || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-400">Loading Dashboard Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Portfolio Management Hub</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Complete real-time control center for Ranjith Kumar&apos;s creative visual portfolio.
          </p>
        </div>

        {/* Database mode pill */}
        <div className="flex items-center gap-2 rounded-xl border border-electric-500/30 bg-electric-500/10 px-3.5 py-2 text-xs font-semibold text-electric-300">
          <Database className="h-4 w-4 text-electric-400" />
          <span>Storage Engine: <strong>{stats?.storageMode || "MongoDB Atlas / Database"}</strong></span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Videos */}
        <Link
          href="/admin/videos"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-electric-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-500/10 text-electric-400">
              <Video className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-electric-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalVideos || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Video Projects ({stats?.featuredVideos || 0} featured)</div>
        </Link>

        {/* Designs */}
        <Link
          href="/admin/designs"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-neon-orange/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-orange/10 text-neon-orange">
              <Palette className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-neon-orange flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalDesigns || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Graphic Artworks ({stats?.featuredDesigns || 0} featured)</div>
        </Link>

        {/* Services */}
        <Link
          href="/admin/services"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-purple-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-purple-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalServices || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Services & Packages</div>
        </Link>

        {/* Education */}
        <Link
          href="/admin/education"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-emerald-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-emerald-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalEducation || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Education Qualifications</div>
        </Link>

        {/* Testimonials */}
        <Link
          href="/admin/testimonials"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-yellow-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <MessageSquareQuote className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-yellow-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalTestimonials || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Client Reviews</div>
        </Link>

        {/* Enquiries */}
        <Link
          href="/admin/enquiries"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-emerald-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Mail className="h-5 w-5" />
            </span>
            {stats?.unreadEnquiries ? (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                {stats.unreadEnquiries} new
              </span>
            ) : (
              <span className="text-xs text-gray-400 group-hover:text-emerald-300 flex items-center gap-1">
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalEnquiries || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Client Messages</div>
        </Link>

        {/* Skills */}
        <Link
          href="/admin/skills"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-cyan-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-cyan-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalSkills || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Software & Skills</div>
        </Link>

        {/* Experience */}
        <Link
          href="/admin/experience"
          className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 hover:border-pink-500/40 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
              <Award className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-pink-300 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalExperience || 0}</div>
          <div className="text-xs text-gray-400 mt-0.5">Career Milestones</div>
        </Link>
      </div>

      {/* Quick Launchpad & Shortcuts */}
      <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-electric-400" />
          <span>Quick Portfolio Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-electric-500 hover:text-white transition-all"
          >
            <Sparkles className="h-4 w-4 text-electric-400" />
            <span>Profile & Photo</span>
          </Link>
          <Link
            href="/admin/education"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-neon-orange hover:text-white transition-all"
          >
            <PlusCircle className="h-4 w-4 text-neon-orange" />
            <span>Education</span>
          </Link>
          <Link
            href="/admin/videos"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-electric-500 hover:text-white transition-all"
          >
            <PlusCircle className="h-4 w-4 text-electric-400" />
            <span>Add Video</span>
          </Link>
          <Link
            href="/admin/designs"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-neon-orange hover:text-white transition-all"
          >
            <PlusCircle className="h-4 w-4 text-neon-orange" />
            <span>Upload Design</span>
          </Link>
          <Link
            href="/admin/contact"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-emerald-500 hover:text-white transition-all"
          >
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>Contact Info</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-dark-850 p-3.5 text-xs font-semibold text-gray-200 hover:border-purple-500 hover:text-white transition-all"
          >
            <ExternalLink className="h-4 w-4 text-purple-400" />
            <span>Site Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Enquiries & Admin Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Enquiries */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-dark-900/90 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Latest Inquiries & Client Leads</h2>
              <p className="text-xs text-gray-400">Incoming messages from prospective clients worldwide</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-electric-400 hover:text-electric-300"
            >
              View All ({stats?.totalEnquiries || 0}) →
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-dark-850/60 p-4 hover:border-white/15 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{enq.name}</span>
                      <span className="text-xs text-gray-400">({enq.email})</span>
                      {enq.status === "unread" && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{enq.message}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 sm:text-right">
                    <span className="rounded bg-white/5 px-2 py-1 text-[11px] font-medium text-gray-300">
                      {enq.serviceInterested}
                    </span>
                    <Link
                      href="/admin/enquiries"
                      className="text-xs font-semibold text-neon-orange hover:underline"
                    >
                      Respond
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500">
              No inquiries received yet. Once visitors submit the contact form, they will appear here.
            </div>
          )}
        </div>

        {/* Recent Admin Activity / System Status */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-dark-900/90 p-6 sm:p-7 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-neon-orange" />
            <span>Recent System Status</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-850/60 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Full Dynamic API Connected</span>
                <span className="text-gray-400 text-[11px]">All 10 modules syncing live to frontend</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-850/60 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Authentication & Session</span>
                <span className="text-gray-400 text-[11px]">Bcrypt secure hash & HTTP-only JWT</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-850/60 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Cloudinary Media Handler</span>
                <span className="text-gray-400 text-[11px]">High-speed image & video upload ready</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-xl border border-electric-500/30 bg-electric-500/10 px-4 py-2.5 text-xs font-bold text-electric-300 hover:bg-electric-500/20 transition-colors"
            >
              <span>View Public Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
