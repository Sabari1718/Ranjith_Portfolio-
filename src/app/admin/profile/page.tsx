"use client";

import { useEffect, useState } from "react";
import {
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Share2,
  Briefcase,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

interface ProfileData {
  name: string;
  brandName?: string;
  profileImage: string;
  title: string;
  greeting: string;
  tagline: string;
  bio: string;
  experienceBadge: string;
  projectsBadge: string;
  availableForHire: boolean;
  statusBadge: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  serviceTags?: string[];
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  behance: string;
  twitter: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setProfile(data.data);
          if (Array.isArray(data.data.serviceTags)) {
            setTagsInput(data.data.serviceTags.join(", "));
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...profile,
        serviceTags: parsedTags,
      };

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Profile & Hero details updated successfully! Homepage updated." });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-400">Loading Profile Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <User className="h-6 w-6 text-electric-400" />
            <span>Profile / Hero Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your personal identity, brand name, profile photograph, hero badges, CTA buttons, and service tags.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving Changes..." : "Save Profile & Hero"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs font-semibold ${
            message.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Photograph & Visual Preview */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neon-orange" />
            <span>1. Profile Photograph (Dynamic Cloudinary / Local Store)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Live Profile Photo Preview */}
            <div className="md:col-span-5 flex flex-col items-center text-center p-4 rounded-2xl border border-white/5 bg-dark-950/70">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Homepage Hero Frame
              </span>
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-electric-600 via-fuchsia-600 to-neon-orange opacity-75 blur-md animate-pulse-slow" />
                {/* Gradient border */}
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-electric-600 to-neon-orange shadow-2xl">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-dark-900">
                    {profile.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-dark-850 text-gray-500 font-bold text-xl">
                        {profile.name?.slice(0, 2).toUpperCase() || "RK"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-sm font-bold text-white block">{profile.name}</span>
                <span className="text-xs text-electric-400 block">{profile.title}</span>
              </div>
            </div>

            {/* Photo Upload & Input Controls */}
            <div className="md:col-span-7 space-y-4">
              <MediaUploader
                label="Upload Ranjith Kumar's Actual Photograph"
                currentUrl={profile.profileImage}
                onUploadComplete={(url) => setProfile({ ...profile, profileImage: url })}
                accept="image/*"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Or Image URL (Cloudinary / CDN / Direct URL)
                </label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/.../profile.jpg"
                  value={profile.profileImage}
                  onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Name & Brand Identity */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-electric-400" />
            <span>2. Name & Brand Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="RANJITH KUMAR"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Brand / Logo Name
              </label>
              <input
                type="text"
                value={profile.brandName || ""}
                onChange={(e) => setProfile({ ...profile, brandName: e.target.value })}
                placeholder="RANJITH KUMAR"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Professional Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="Video Editor & Graphic Designer"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Greeting Prefix
              </label>
              <input
                type="text"
                value={profile.greeting}
                onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
                placeholder="HELLO, I'M"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Tagline, Hero Description & Availability */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-purple-400" />
            <span>3. Tagline, Hero Description & Availability</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Hero Tagline / Headline
            </label>
            <input
              type="text"
              required
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              placeholder="Turning Ideas Into High-Impact Visual Experiences."
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Hero Bio / Description
            </label>
            <textarea
              rows={3}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Availability Status
              </label>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availableForHire"
                  checked={profile.availableForHire}
                  onChange={(e) => setProfile({ ...profile, availableForHire: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-dark-950 text-electric-600 focus:ring-electric-500"
                />
                <label htmlFor="availableForHire" className="text-xs text-gray-300 font-medium">
                  {profile.availableForHire ? "Available For Hire" : "Currently Booked"}
                </label>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Status Badge Text
              </label>
              <input
                type="text"
                value={profile.statusBadge}
                onChange={(e) => setProfile({ ...profile, statusBadge: e.target.value })}
                placeholder="Available for Projects & Retainers"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Experience Badge
              </label>
              <input
                type="text"
                value={profile.experienceBadge}
                onChange={(e) => setProfile({ ...profile, experienceBadge: e.target.value })}
                placeholder="5+ Years Crafting Visuals"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Projects Completed Badge
              </label>
              <input
                type="text"
                value={profile.projectsBadge}
                onChange={(e) => setProfile({ ...profile, projectsBadge: e.target.value })}
                placeholder="250+ Successful Projects"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Hero CTA Buttons & Service Tags */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-emerald-400" />
            <span>4. Hero CTA Buttons & Service Tags</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Primary CTA Text
              </label>
              <input
                type="text"
                value={profile.ctaPrimaryText || ""}
                onChange={(e) => setProfile({ ...profile, ctaPrimaryText: e.target.value })}
                placeholder="Explore My Work"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={profile.ctaPrimaryLink || ""}
                onChange={(e) => setProfile({ ...profile, ctaPrimaryLink: e.target.value })}
                placeholder="#videos"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Secondary CTA Text
              </label>
              <input
                type="text"
                value={profile.ctaSecondaryText || ""}
                onChange={(e) => setProfile({ ...profile, ctaSecondaryText: e.target.value })}
                placeholder="Let's Connect"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Secondary CTA Link
              </label>
              <input
                type="text"
                value={profile.ctaSecondaryLink || ""}
                onChange={(e) => setProfile({ ...profile, ctaSecondaryLink: e.target.value })}
                placeholder="#contact"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-electric-400" />
              <span>Hero Service Tags (Comma-Separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Cinematic Video Editing, Brand Identity, Motion Graphics, Poster Design, Color Grading"
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white focus:border-electric-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400">
              Displayed as badge pills directly below the hero introduction on the homepage.
            </p>
          </div>
        </div>

        {/* Section 5: Social Channels & Contact Links */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-pink-400" />
            <span>5. Social Media & Contact Quick Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Instagram URL
              </label>
              <input
                type="text"
                value={profile.instagram}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                placeholder="https://instagram.com/ranjith_visuals"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/ranjith-editor"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                YouTube URL
              </label>
              <input
                type="text"
                value={profile.youtube}
                onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                placeholder="https://youtube.com/@ranjithvisuals"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Behance URL
              </label>
              <input
                type="text"
                value={profile.behance}
                onChange={(e) => setProfile({ ...profile, behance: e.target.value })}
                placeholder="https://behance.net/ranjithvisuals"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Twitter / X URL
              </label>
              <input
                type="text"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                placeholder="https://x.com/ranjith_visuals"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Primary Public Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="contact@ranjithportfolio.com"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-electric-400 hover:underline"
          >
            <span>Preview on Live Homepage</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Profile & Hero..." : "Save Profile & Hero Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
