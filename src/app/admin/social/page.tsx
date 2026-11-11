"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/ui/BrandIcons";
import { SiteSettings } from "@/types";

export default function AdminSocialPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        if (data?.success) setSettings(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Social media profiles updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update social profiles" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving social media." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-400">Loading Social Profiles...</span>
        </div>
      </div>
    );
  }

  const socialChannels = [
    {
      key: "instagram" as const,
      label: "Instagram Profile",
      placeholder: "https://instagram.com/ranjith_visuals",
      color: "hover:border-pink-500",
    },
    {
      key: "youtube" as const,
      label: "YouTube Channel",
      placeholder: "https://youtube.com/@ranjithvisuals",
      color: "hover:border-red-500",
    },
    {
      key: "linkedin" as const,
      label: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/ranjith-editor",
      color: "hover:border-blue-500",
    },
    {
      key: "behance" as const,
      label: "Behance Portfolio",
      placeholder: "https://behance.net/ranjithvisuals",
      color: "hover:border-blue-400",
    },
    {
      key: "facebook" as const,
      label: "Facebook Page",
      placeholder: "https://facebook.com/ranjithvisuals",
      color: "hover:border-blue-600",
    },
    {
      key: "dribbble" as const,
      label: "Dribbble Profile",
      placeholder: "https://dribbble.com/ranjithvisuals",
      color: "hover:border-pink-400",
    },
    {
      key: "twitter" as const,
      label: "Twitter / X Profile",
      placeholder: "https://x.com/ranjith_visuals",
      color: "hover:border-gray-400",
    },
    {
      key: "whatsapp" as const,
      label: "WhatsApp Number (with country code)",
      placeholder: "+91 98765 43210",
      color: "hover:border-emerald-500",
    },
    {
      key: "email" as const,
      label: "Primary Email Address",
      placeholder: "contact@ranjithportfolio.com",
      color: "hover:border-purple-500",
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Share2 className="h-6 w-6 text-pink-400" />
            <span>Social Media Channels</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Connect your global social profiles, creator channels, and messaging handles shown in the navbar, footer, and contact sections.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Social Links"}</span>
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

      {/* Social Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {socialChannels.map((channel) => {
              const currentValue = (settings as any)[channel.key] || "";
              return (
                <div
                  key={channel.key}
                  className="p-4 rounded-xl border border-white/5 bg-dark-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-white/20 transition-all"
                >
                  <div className="sm:w-1/3">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      {channel.label}
                    </label>
                    <span className="text-[11px] text-gray-500">
                      {channel.key === "whatsapp" || channel.key === "email" ? "Direct channel" : "Public profile"}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [channel.key]: e.target.value,
                        })
                      }
                      placeholder={channel.placeholder}
                      className="w-full rounded-xl border border-white/10 bg-dark-900 px-4 py-2.5 text-xs text-white focus:border-electric-500 focus:outline-none"
                    />

                    {currentValue && channel.key !== "email" && channel.key !== "whatsapp" && (
                      <a
                        href={currentValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0"
                        title="Open & Test Link"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save All Profiles"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

