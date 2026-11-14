"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Building,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { Education } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm: Omit<Education, "id"> = {
    institution: "",
    degree: "",
    department: "",
    startYear: "2018",
    endYear: "2022",
    grade: "",
    description: "",
    logoUrl: "",
    order: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/admin/education");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) {
        setEducationList(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      order: educationList.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      department: edu.department || "",
      startYear: edu.startYear,
      endYear: edu.endYear,
      grade: edu.grade || "",
      description: edu.description || "",
      logoUrl: edu.logoUrl || "",
      order: edu.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/education/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Education record updated successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchEducation();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update record" });
        }
      } else {
        const res = await fetch("/api/admin/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Education entry created successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchEducation();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create entry" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete education record: "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Record deleted successfully!" });
        setEducationList((prev) => prev.filter((item) => item.id !== id));
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete record" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete record" });
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educationList.length) return;

    const updated = [...educationList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setEducationList(updated);

    try {
      const orderedIds = updated.map((e) => e.id);
      await fetch("/api/admin/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      setMessage({ type: "success", text: "Display order updated!" });
    } catch {
      setMessage({ type: "error", text: "Failed to update order" });
      fetchEducation();
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-400">Loading Education Timeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-neon-orange" />
            <span>Education Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add, edit, reorder, or remove your academic qualifications, degrees, and specialized institute certifications.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education Record</span>
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

      {/* Education List */}
      <div className="space-y-4">
        {educationList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-dark-900/60 p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-500/10 text-electric-400">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Education Records Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                Your portfolio does not have any education records listed yet. Click the button below to add your first degree or course.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-4 py-2 text-xs font-bold text-white hover:bg-electric-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Education</span>
            </button>
          </div>
        ) : (
          educationList.map((edu, index) => (
            <div
              key={edu.id}
              className="group rounded-2xl border border-white/10 bg-dark-900/90 p-5 sm:p-6 hover:border-electric-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Logo or Icon */}
                <div className="h-12 w-12 flex-shrink-0 rounded-xl border border-white/10 bg-dark-950 flex items-center justify-center overflow-hidden">
                  {edu.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={edu.logoUrl} alt={edu.institution} className="h-full w-full object-cover" />
                  ) : (
                    <GraduationCap className="h-6 w-6 text-neon-orange" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-electric-300 transition-colors">
                      {edu.degree}
                    </h3>
                    {edu.grade && (
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold text-neon-orange flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-neon-orange/80" />
                      <span>{edu.institution}</span>
                    </span>
                    {edu.department && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="text-gray-300">{edu.department}</span>
                      </>
                    )}
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1 text-electric-300">
                      <Calendar className="h-3 w-3" />
                      <span>{edu.startYear} - {edu.endYear}</span>
                    </span>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                {/* Order Up / Down */}
                <div className="flex items-center gap-1 mr-2 bg-dark-950 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => handleMoveOrder(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, "down")}
                    disabled={index === educationList.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => openEditModal(edu)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 text-electric-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(edu.id, edu.degree)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-dark-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-neon-orange" />
                <span>{editingId ? "Edit Education Record" : "Add Education Record"}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Institution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Institution / College Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. Loyola College of Arts & Sciences"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Degree */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Degree / Course Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Visual Communication"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Department / Specialization
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Digital Filmmaking, Editing & Motion Design"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Year Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Start Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    placeholder="2016"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    End Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    placeholder="2019 or Present"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Grade / Percentage (Optional)
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. First Class with Distinction (8.8 CGPA)"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Description / Key Learnings (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize course focus, thesis, or specialized software learned..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Institution Logo */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <MediaUploader
                  label="Institution Logo (Optional)"
                  currentUrl={formData.logoUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, logoUrl: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or paste Logo Image URL"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-3 py-2 text-xs text-white"
                />
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
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : editingId ? "Update Record" : "Add Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

