"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Building,
  MapPin,
  Search,
} from "lucide-react";
import { Experience } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "current" | "past">("all");

  const emptyForm: Omit<Experience, "id"> = {
    role: "",
    company: "",
    location: "Remote / Hybrid",
    period: "2024 - Present",
    description: "",
    highlights: ["Led video editing pipelines", "Boosted average retention rate"],
    current: true,
    order: 0,
    employmentType: "Full-time",
    companyLogo: "",
    endDate: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [highlightsInput, setHighlightsInput] = useState("Led video editing pipelines\nBoosted average retention rate");

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) setExperience(data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const filteredExperience = useMemo(() => {
    return experience
      .filter((exp) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "current" && exp.current) ||
          (statusFilter === "past" && !exp.current);

        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          exp.company.toLowerCase().includes(q) ||
          exp.role.toLowerCase().includes(q) ||
          (exp.location && exp.location.toLowerCase().includes(q)) ||
          exp.description.toLowerCase().includes(q) ||
          (exp.highlights && exp.highlights.some((h) => h.toLowerCase().includes(q)));

        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [experience, searchQuery, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setHighlightsInput("Led video editing pipelines\nBoosted average retention rate");
    setModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      role: exp.role,
      company: exp.company,
      location: exp.location || "",
      period: exp.period,
      description: exp.description,
      highlights: exp.highlights || [],
      current: exp.current,
      order: exp.order,
      employmentType: exp.employmentType || "Full-time",
      companyLogo: exp.companyLogo || "",
      endDate: exp.endDate || "",
    });
    setHighlightsInput((exp.highlights || []).join("\n"));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...formData,
      highlights: highlightsInput.split("\n").map((h) => h.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/experience/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Experience record updated successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchExperience();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update experience" });
        }
      } else {
        const res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "New experience record created!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchExperience();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create experience" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Experience record deleted successfully" });
        setDeleteConfirmId(null);
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
        fetchExperience();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete experience" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

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
            <Award className="h-6 w-6 text-electric-400" />
            <span>Career Experience Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your employment history, production studio roles, creative agency contracts, and freelance career milestones.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
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

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/90 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company, job title, location, responsibilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-electric-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            All ({experience.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("current")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              statusFilter === "current"
                ? "bg-emerald-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Present Roles
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("past")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              statusFilter === "past"
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Past Roles
          </button>
        </div>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {filteredExperience.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/90 p-5 hover:border-white/20 transition-all shadow-md"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {exp.companyLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exp.companyLogo}
                    alt={exp.company}
                    className="h-7 w-7 rounded-lg object-contain bg-dark-950 p-1 border border-white/10"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-electric-600/20 text-electric-400 font-bold flex items-center justify-center text-xs">
                    {exp.company.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-white text-base">{exp.role}</h3>
                <span className="text-gray-400 text-xs">at</span>
                <span className="font-semibold text-neon-orange text-sm">{exp.company}</span>
                {exp.current && (
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Current Role
                  </span>
                )}
                {exp.employmentType && (
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-gray-400 border border-white/5">
                    {exp.employmentType}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <span>{exp.period}</span>
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span>{exp.location}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 line-clamp-2">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="text-[11px] text-gray-500 mr-2">Order: {exp.order}</span>
              <button
                onClick={() => openEditModal(exp)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                title="Edit Experience"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(exp.id)}
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                title="Delete Experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Experience Record?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              Are you sure you want to delete this career milestone?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-electric-400" />
                <span>{editingId ? "Edit Career Experience" : "Add Career Experience"}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Job Title / Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Video Editor & Colorist"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Company / Studio Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. MediaCraft Studios"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType || "Full-time"}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Time Period <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2023 - Present"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bengaluru / Remote"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Company Logo Uploader */}
              <div className="space-y-1.5">
                <MediaUploader
                  label="Company / Studio Logo"
                  currentUrl={formData.companyLogo || ""}
                  onUploadComplete={(url) => setFormData({ ...formData, companyLogo: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or enter direct company logo URL"
                  value={formData.companyLogo || ""}
                  onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Role Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe day-to-day creative responsibilities, client collaborations..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Key Achievements / Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Delivered 120+ client reels with 25M+ impressions&#10;Spearheaded brand revamps for 8 enterprise clients"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white font-mono focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="currentRole"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="currentRole" className="text-xs font-semibold text-gray-300">
                    This is my current role
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingId ? "Update Experience" : "Save Experience"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
