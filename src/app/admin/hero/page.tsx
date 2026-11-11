"use client";

import { useEffect, useState } from "react";
import { Sparkles, Save, CheckCircle, AlertCircle } from "lucide-react";
import { HeroData } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) setHero(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Hero section updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update hero section." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !hero) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-electric-400" />
            <span>Hero & Identity Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your personal brand name, professional title, showreel, and CTAs.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold ${
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
        {/* Core Identity */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white">1. Name & Titles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Greeting
              </label>
              <input
                type="text"
                value={hero.greeting}
                onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Personal Name
              </label>
              <input
                type="text"
                required
                value={hero.name}
                onChange={(e) => setHero({ ...hero, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Tagline
              </label>
              <input
                type="text"
                required
                value={hero.tagline}
                onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Short Hero Pitch / Bio
            </label>
            <textarea
              rows={3}
              required
              value={hero.bio}
              onChange={(e) => setHero({ ...hero, bio: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Media & Showreel */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white">2. Profile Image & Showreel</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <MediaUploader
                label="Profile Picture"
                currentUrl={hero.profileImage}
                onUploadComplete={(url) => setHero({ ...hero, profileImage: url })}
              />
              <input
                type="text"
                placeholder="Or paste Profile Image URL"
                value={hero.profileImage}
                onChange={(e) => setHero({ ...hero, profileImage: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-3">
              <MediaUploader
                label="Showreel Card Cover Thumbnail"
                currentUrl={hero.showreelThumbnail}
                onUploadComplete={(url) => setHero({ ...hero, showreelThumbnail: url })}
              />
              <input
                type="text"
                placeholder="Or paste Thumbnail URL"
                value={hero.showreelThumbnail}
                onChange={(e) => setHero({ ...hero, showreelThumbnail: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Showreel Video Link (YouTube / Vimeo / MP4)
            </label>
            <input
              type="text"
              value={hero.showreelUrl}
              onChange={(e) => setHero({ ...hero, showreelUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=LXb3EKWsInQ"
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Badges & CTAs */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white">3. Badges & CTA Buttons</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Primary CTA Label
              </label>
              <input
                type="text"
                value={hero.ctaPrimaryText}
                onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={hero.ctaPrimaryLink}
                onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Secondary CTA Label
              </label>
              <input
                type="text"
                value={hero.ctaSecondaryText}
                onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Secondary CTA Link
              </label>
              <input
                type="text"
                value={hero.ctaSecondaryLink}
                onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Status Badge
              </label>
              <input
                type="text"
                value={hero.statusBadge}
                onChange={(e) => setHero({ ...hero, statusBadge: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Experience Badge
              </label>
              <input
                type="text"
                value={hero.experienceBadge}
                onChange={(e) => setHero({ ...hero, experienceBadge: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Projects Badge
              </label>
              <input
                type="text"
                value={hero.projectsBadge}
                onChange={(e) => setHero({ ...hero, projectsBadge: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save All Hero Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

