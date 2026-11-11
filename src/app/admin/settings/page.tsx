"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Mail,
  Shield,
  ExternalLink,
} from "lucide-react";
import { SiteSettings } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [keywordsInput, setKeywordsInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setSettings(data.data);
          setKeywordsInput((data.data.keywords || []).join(", "));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      ...settings,
      keywords: keywordsInput.split(",").map((k) => k.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Website settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-neon-orange" />
            <span>Website & System Settings</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage search engine metadata, brand branding, footer copyright, and contact configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
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
        {/* SEO & Metadata */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-electric-400" />
            <span>1. SEO & General Metadata</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Site Title (Page Title) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="RANJITH KUMAR | Creative Video Editor & Graphic Designer"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Author Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.author}
                onChange={(e) => setSettings({ ...settings, author: e.target.value })}
                placeholder="RANJITH KUMAR"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Site Meta Description
            </label>
            <textarea
              rows={2}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="High-energy cinematic video editor and visionary graphic designer..."
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              SEO Keywords (Comma-Separated)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="Video Editor, Motion Graphics, Premiere Pro, Colorist, Graphic Designer, Ranjith Kumar"
              className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Branding & Assets */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-neon-orange" />
            <span>2. Brand Assets & Footer Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <MediaUploader
                label="Custom Favicon"
                currentUrl={settings.faviconUrl || ""}
                onUploadComplete={(url) => setSettings({ ...settings, faviconUrl: url })}
                accept="image/*"
              />
              <input
                type="text"
                placeholder="Favicon URL"
                value={settings.faviconUrl || ""}
                onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <MediaUploader
                label="Navbar Brand Logo Image (Optional)"
                currentUrl={settings.logoUrl || ""}
                onUploadComplete={(url) => setSettings({ ...settings, logoUrl: url })}
                accept="image/*"
              />
              <input
                type="text"
                placeholder="Brand Logo Image URL"
                value={settings.logoUrl || ""}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Footer Tagline Text
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="Crafting Visual Experiences That Captivate."
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Copyright Notice
              </label>
              <input
                type="text"
                value={settings.copyrightText || ""}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                placeholder="© 2026 RANJITH KUMAR. All rights reserved."
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={settings.isAvailable !== false}
                onChange={(e) => setSettings({ ...settings, isAvailable: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-dark-950 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="isAvailable" className="text-xs font-semibold text-gray-300">
                Available for New Projects & Retainers
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="allowInquiries"
                checked={settings.allowInquiries}
                onChange={(e) => setSettings({ ...settings, allowInquiries: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-dark-950 text-electric-600 focus:ring-electric-500"
              />
              <label htmlFor="allowInquiries" className="text-xs font-semibold text-gray-300">
                Accept Client Contact Form Inquiries
              </label>
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>3. Contact & Reach Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Public Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="contact@ranjithportfolio.com"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Studio Location / Base
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Bengaluru, Karnataka, India (Available Worldwide)"
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-pink-400" />
            <span>4. Social Profiles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
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
                value={settings.youtube}
                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Behance URL
              </label>
              <input
                type="text"
                value={settings.behance}
                onChange={(e) => setSettings({ ...settings, behance: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Twitter / X
              </label>
              <input
                type="text"
                value={settings.twitter || ""}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Facebook
              </label>
              <input
                type="text"
                value={settings.facebook || ""}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Dribbble
              </label>
              <input
                type="text"
                value={settings.dribbble || ""}
                onChange={(e) => setSettings({ ...settings, dribbble: e.target.value })}
                placeholder="https://dribbble.com/..."
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-electric-400 hover:underline"
          >
            <span>Preview live website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
