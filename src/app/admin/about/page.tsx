"use client";

import { useEffect, useState } from "react";
import { User, Save, CheckCircle, AlertCircle, Plus, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import { AboutData } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) setAbout(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "About section updated successfully!" });
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update about section." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  const addJourneyStep = () => {
    if (!about) return;
    setAbout({
      ...about,
      creativeJourney: [
        ...about.creativeJourney,
        { year: "2025 - Present", title: "New Milestone", description: "Brief description of role and achievements." },
      ],
    });
  };

  const removeJourneyStep = (index: number) => {
    if (!about) return;
    const updated = [...about.creativeJourney];
    updated.splice(index, 1);
    setAbout({ ...about, creativeJourney: updated });
  };

  if (loading || !about) {
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
            <User className="h-6 w-6 text-electric-400" />
            <span>About & Journey Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Update your biography, stats, creative philosophy, studio visual, and career milestones.
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
        {/* Biography */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric-400" />
            <span>1. Story, Introduction & Studio Image</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Section Title
            </label>
            <input
              type="text"
              required
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Subtitle
            </label>
            <input
              type="text"
              required
              value={about.subtitle}
              onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>

          {/* About / Studio Image Uploader */}
          <div className="space-y-1.5 pt-2">
            <MediaUploader
              label="About Section Studio Image (Optional)"
              currentUrl={about.aboutImage || ""}
              onUploadComplete={(url) => setAbout({ ...about, aboutImage: url })}
              accept="image/*"
            />
            <input
              type="text"
              placeholder="Or enter direct image URL"
              value={about.aboutImage || ""}
              onChange={(e) => setAbout({ ...about, aboutImage: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Bio Paragraph 1
            </label>
            <textarea
              rows={3}
              required
              value={about.bioParagraph1}
              onChange={(e) => setAbout({ ...about, bioParagraph1: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white leading-relaxed focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Bio Paragraph 2
            </label>
            <textarea
              rows={3}
              required
              value={about.bioParagraph2}
              onChange={(e) => setAbout({ ...about, bioParagraph2: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white leading-relaxed focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Personal Philosophy Quote
            </label>
            <input
              type="text"
              value={about.quote}
              onChange={(e) => setAbout({ ...about, quote: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Counter Stats */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-neon-orange" />
            <span>2. Numerical Achievements & Metrics</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Years Exp.
              </label>
              <input
                type="number"
                value={about.yearsOfExperience}
                onChange={(e) => setAbout({ ...about, yearsOfExperience: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Projects Completed
              </label>
              <input
                type="number"
                value={about.projectsCompleted}
                onChange={(e) => setAbout({ ...about, projectsCompleted: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Happy Clients
              </label>
              <input
                type="number"
                value={about.happyClients}
                onChange={(e) => setAbout({ ...about, happyClients: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Retention Rate %
              </label>
              <input
                type="number"
                value={about.clientRetentionRate}
                onChange={(e) => setAbout({ ...about, clientRetentionRate: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Creative Journey Steps */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">3. Creative Journey Milestones</h2>
            <button
              type="button"
              onClick={addJourneyStep}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-electric-300 hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {about.creativeJourney?.map((step, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-dark-850 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={step.year}
                    placeholder="e.g. 2022 - 2024"
                    onChange={(e) => {
                      const updated = [...about.creativeJourney];
                      updated[idx].year = e.target.value;
                      setAbout({ ...about, creativeJourney: updated });
                    }}
                    className="w-36 rounded-lg border border-white/10 bg-dark-950 px-3 py-1.5 text-xs text-neon-orange font-semibold"
                  />

                  <button
                    type="button"
                    onClick={() => removeJourneyStep(idx)}
                    className="text-gray-500 hover:text-red-400 p-1"
                    title="Remove Step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={step.title}
                  placeholder="Milestone Title"
                  onChange={(e) => {
                    const updated = [...about.creativeJourney];
                    updated[idx].title = e.target.value;
                    setAbout({ ...about, creativeJourney: updated });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-dark-950 px-3 py-1.5 text-sm text-white font-medium"
                />

                <textarea
                  rows={2}
                  value={step.description}
                  placeholder="Short description of what was achieved..."
                  onChange={(e) => {
                    const updated = [...about.creativeJourney];
                    updated[idx].description = e.target.value;
                    setAbout({ ...about, creativeJourney: updated });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-dark-950 px-3 py-1.5 text-xs text-gray-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save About Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
