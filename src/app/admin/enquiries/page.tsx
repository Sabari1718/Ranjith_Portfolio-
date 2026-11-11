"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { Enquiry } from "@/types";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) setEnquiries(data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "unread" | "read" | "replied") => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: `Enquiry marked as ${newStatus}` });
        fetchEnquiries();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Enquiry deleted successfully" });
        fetchEnquiries();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete enquiry" });
    }
  };

  const filteredEnquiries =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-emerald-400" />
            <span>Client Inquiries & Leads</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage and respond to project requests received through the portfolio contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(["all", "unread", "read", "replied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === status
                  ? "bg-electric-600 text-white shadow-md shadow-electric-600/30"
                  : "border border-white/10 bg-dark-900 text-gray-400 hover:text-white"
              }`}
            >
              {status} ({status === "all" ? enquiries.length : enquiries.filter((e) => e.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold ${
            message.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Inquiries Cards */}
      <div className="space-y-4">
        {filteredEnquiries.map((enq) => {
          const whatsappClean = enq.phone?.replace(/[^0-9]/g, "");
          const whatsappReply = whatsappClean ? `https://wa.me/${whatsappClean}` : null;
          const emailReply = `mailto:${enq.email}?subject=Re:%20Project%20Inquiry%20-%20Ranjith%20Kumar%20Portfolio`;

          return (
            <div
              key={enq.id}
              className={`rounded-2xl border transition-all ${
                enq.status === "unread"
                  ? "border-emerald-500/40 bg-dark-900/95 shadow-lg shadow-emerald-500/5"
                  : "border-white/10 bg-dark-900/70"
              } p-6 sm:p-7 space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white">{enq.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        enq.status === "unread"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : enq.status === "replied"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                      <Mail className="h-3.5 w-3.5 text-electric-400" />
                      <a href={`mailto:${enq.email}`} className="hover:underline">{enq.email}</a>
                    </span>
                    {enq.phone && (
                      <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                        <Phone className="h-3.5 w-3.5 text-neon-orange" />
                        <span>{enq.phone}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as "unread" | "read" | "replied")}
                    className="rounded-xl border border-white/10 bg-dark-950 px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
                  >
                    <option value="unread">Mark Unread</option>
                    <option value="read">Mark Read</option>
                    <option value="replied">Mark Replied</option>
                  </select>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message Details Pill Bar */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-gray-300">
                  <Briefcase className="h-3.5 w-3.5 text-electric-400" />
                  <span>Service: <strong>{enq.serviceInterested}</strong></span>
                </span>
                {enq.budget && (
                  <span className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-gray-300">
                    <DollarSign className="h-3.5 w-3.5 text-neon-orange" />
                    <span>Budget: <strong>{enq.budget}</strong></span>
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="rounded-xl border border-white/5 bg-dark-950 p-4 text-xs sm:text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {enq.message}
              </div>

              {/* Quick reply actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={emailReply}
                  onClick={() => handleStatusChange(enq.id, "replied")}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-electric-400" />
                  <span>Reply via Email</span>
                </a>

                {whatsappReply && (
                  <a
                    href={whatsappReply}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleStatusChange(enq.id, "replied")}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Reply on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEnquiries.length === 0 && (
        <div className="text-center py-16 border border-white/10 rounded-2xl bg-dark-900/40">
          <p className="text-gray-400 text-sm">No inquiries match the selected filter.</p>
        </div>
      )}
    </div>
  );
}

