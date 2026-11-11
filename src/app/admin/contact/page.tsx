"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  Trash2,
  Check,
  Send,
  ExternalLink,
} from "lucide-react";
import { SiteSettings, Enquiry } from "@/types";

export default function AdminContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "enquiries">("info");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchData = async () => {
    try {
      const [settingsRes, enquiriesRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/enquiries"),
      ]);

      if (settingsRes.status === 401 || enquiriesRes.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const settingsData = await settingsRes.json();
      const enquiriesData = await enquiriesRes.json();

      if (settingsData?.success) setSettings(settingsData.data);
      if (enquiriesData?.success) setEnquiries(enquiriesData.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
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
        setMessage({ type: "success", text: "Contact coordinates & settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update contact info" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving contact info." });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "unread" | "read" | "replied") => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      // ignore
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-400">Loading Contact Information...</span>
        </div>
      </div>
    );
  }

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus === "all") return true;
    return e.status === filterStatus;
  });

  const unreadCount = enquiries.filter((e) => e.status === "unread").length;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-neon-orange" />
            <span>Contact Information & Enquiries</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your direct communication channels, phone/WhatsApp numbers, and incoming prospective client messages.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-dark-900 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "info"
                ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Contact Coordinates
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "enquiries"
                ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Client Enquiries</span>
            {unreadCount > 0 && (
              <span className="h-5 px-1.5 flex items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
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

      {/* Tab 1: Contact Coordinates Form */}
      {activeTab === "info" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-electric-400" />
              <span>1. Primary Communication Coordinates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Primary Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="contact@ranjithportfolio.com"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Location / Availability
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Available Worldwide (Remote & Travel)"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Contact Section Subtitle / Pitch
              </label>
              <textarea
                rows={2}
                value={settings.contactDescription || ""}
                onChange={(e) => setSettings({ ...settings, contactDescription: e.target.value })}
                placeholder="Have footage ready for cinematic editing, need viral short-form growth, or looking for a distinct visual brand identity? Drop a message below."
                className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowInquiries}
                  onChange={(e) => setSettings({ ...settings, allowInquiries: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-dark-950 text-electric-600 focus:ring-0"
                />
                <span className="text-xs font-semibold text-gray-200">
                  Enable Public Contact & Project Inquiry Form
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Coordinates..." : "Save Contact Info"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Enquiries Management */}
      {activeTab === "enquiries" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">Filter Status:</span>
              {(["all", "unread", "read", "replied"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                    filterStatus === status
                      ? "bg-electric-600 text-white"
                      : "bg-dark-900 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-gray-400">
              Showing {filteredEnquiries.length} of {enquiries.length}
            </span>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-dark-900/60 p-12 text-center text-xs text-gray-400">
              No client enquiries found under this filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="rounded-2xl border border-white/10 bg-dark-900/90 p-5 sm:p-6 space-y-4 hover:border-electric-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{enq.name}</h3>
                      <span className="text-xs text-gray-400">({enq.email})</span>
                      {enq.status === "unread" && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          Unread
                        </span>
                      )}
                    </div>
                    {enq.phone && <div className="text-xs text-gray-400 mt-0.5">{enq.phone}</div>}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Service Interested:</span>{" "}
                    <span className="text-neon-orange font-semibold">{enq.serviceInterested}</span>
                  </div>
                  {enq.budget && (
                    <div>
                      <span className="text-gray-500">Budget:</span>{" "}
                      <span className="text-emerald-400 font-semibold">{enq.budget}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-white/5 bg-dark-950/70 p-3.5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {enq.message}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">Mark as:</span>
                    <button
                      onClick={() => handleStatusChange(enq.id, "unread")}
                      className={`px-2 py-1 rounded text-[11px] font-medium border ${
                        enq.status === "unread"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => handleStatusChange(enq.id, "read")}
                      className={`px-2 py-1 rounded text-[11px] font-medium border ${
                        enq.status === "read"
                          ? "bg-electric-500/20 border-electric-500 text-electric-300"
                          : "border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleStatusChange(enq.id, "replied")}
                      className={`px-2 py-1 rounded text-[11px] font-medium border ${
                        enq.status === "replied"
                          ? "bg-purple-500/20 border-purple-500 text-purple-300"
                          : "border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      Replied
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${enq.email}?subject=Re:%20Project%20Inquiry%20-%20Ranjith%20Kumar%20Creative%20Studio`}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Send className="h-3 w-3 text-electric-400" />
                      <span>Email Reply</span>
                    </a>

                    <button
                      onClick={() => handleDeleteEnquiry(enq.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

