"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cpu,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Filter,
  Video,
  Sparkles,
  PenTool,
  Sliders,
  Layout,
  Volume2,
  Box,
} from "lucide-react";
import { Skill } from "@/types";

const CATEGORIES = [
  "All",
  "Video Editing",
  "Motion Graphics",
  "Graphic Design",
  "Color Grading",
  "Audio & 3D",
] as const;

const AVAILABLE_ICONS = [
  { name: "Video", label: "Video / Premiere / DaVinci", Icon: Video },
  { name: "Sparkles", label: "Motion / VFX / After Effects", Icon: Sparkles },
  { name: "Layout", label: "Design / UI / Photoshop", Icon: Layout },
  { name: "PenTool", label: "Vector / Illustrator / Pen", Icon: PenTool },
  { name: "Sliders", label: "Color Grading / Wheels", Icon: Sliders },
  { name: "Volume2", label: "Audio / Sound Design", Icon: Volume2 },
  { name: "Box", label: "3D / Blender / CGI", Icon: Box },
  { name: "Cpu", label: "Arsenal / Software / Other", Icon: Cpu },
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search and Category
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const emptyForm: Omit<Skill, "id"> = {
    name: "",
    category: "Video Editing",
    proficiency: 90,
    iconName: "Video",
    experienceYears: 4,
    featured: true,
    order: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills?t=" + Date.now(), {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setSkills(data.data);
      }
    } catch (err) {
      console.error("Fetch skills error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return skills
      .filter((s) => {
        const matchesCat =
          selectedCategory === "All" || s.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.iconName.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [skills, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      order: skills.length > 0 ? Math.max(...skills.map((s) => s.order ?? 0)) + 1 : 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconName: skill.iconName || "Video",
      experienceYears: skill.experienceYears,
      featured: skill.featured ?? true,
      order: skill.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleCategoryChange = (newCategory: any) => {
    let suggestedIcon = formData.iconName;
    if (newCategory === "Video Editing") suggestedIcon = "Video";
    else if (newCategory === "Motion Graphics") suggestedIcon = "Sparkles";
    else if (newCategory === "Graphic Design") suggestedIcon = "Layout";
    else if (newCategory === "Color Grading") suggestedIcon = "Sliders";
    else if (newCategory === "Audio & 3D") suggestedIcon = "Volume2";

    setFormData({
      ...formData,
      category: newCategory,
      iconName: suggestedIcon,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Software / Skill name is required" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/skills/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Skill updated successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          // Immediate optimistic UI update
          setSkills((prev) =>
            prev.map((s) => (s.id === editingId ? { ...formData, id: editingId } : s))
          );
          fetchSkills();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update skill" });
        }
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "New skill created successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          // Immediate optimistic UI update
          if (data.data) {
            setSkills((prev) => [...prev, data.data]);
          }
          fetchSkills();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create skill" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while saving skill" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Immediate optimistic update
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirmId(null);

      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Skill deleted successfully" });
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
        fetchSkills();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete skill" });
        fetchSkills();
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
      fetchSkills();
    }
  };

  const getCardIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "video":
        return Video;
      case "sparkles":
        return Sparkles;
      case "layout":
        return Layout;
      case "pentool":
        return PenTool;
      case "sliders":
        return Sliders;
      case "volume2":
        return Volume2;
      case "box":
        return Box;
      default:
        return Cpu;
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
            <Cpu className="h-6 w-6 text-neon-orange" />
            <span>Skills & Software Tools</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your proficiency in industry-leading creative software. Any changes added here automatically update on the main website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Skill / Tool</span>
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

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/90 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search software (e.g. Premiere Pro, DaVinci Resolve, Photoshop)..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="h-3.5 w-3.5 text-gray-500 ml-1 mr-1 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-electric-600 text-white shadow-sm shadow-electric-600/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const Icon = getCardIcon(skill.iconName);
          return (
            <div
              key={skill.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-dark-900/90 p-5 hover:border-white/20 transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-500/10 border border-electric-500/20 text-electric-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{skill.name}</h3>
                      <span className="text-[11px] text-gray-400">{skill.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-neon-orange px-2 py-0.5 rounded-full bg-neon-orange/10 border border-neon-orange/20">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-dark-950">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-electric-500 to-neon-orange transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{skill.experienceYears} Years Exp.</span>
                  <span className="text-[10px] text-gray-500">Order #{skill.order ?? 0}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => openEditModal(skill)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  title="Edit Skill"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(skill.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Skill"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-dark-900/40">
          <Cpu className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-300">No skills found</h3>
          <p className="text-xs text-gray-500 mt-1">Try another search or click &quot;Add New Skill / Tool&quot; to add one.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Skill?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              Are you sure you want to remove this skill? It will immediately disappear from both the admin dashboard and the public homepage.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-neon-orange" />
                <span>{editingId ? "Edit Skill / Tool" : "Add New Skill / Tool"}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Software / Tool Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adobe Premiere Pro, DaVinci Resolve, Photoshop"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="Video Editing">Video Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Color Grading">Color Grading</option>
                    <option value="Audio & 3D">Audio & 3D</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Icon Representation
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.name} — {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Proficiency Level
                    </label>
                    <span className="text-xs font-bold text-neon-orange">{formData.proficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 50 })}
                    className="w-full accent-electric-500 cursor-pointer pt-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    id="skillFeatured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-electric-600 focus:ring-electric-500"
                  />
                  <label htmlFor="skillFeatured" className="text-xs font-semibold text-gray-300 cursor-pointer">
                    Feature on Homepage
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
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : editingId ? "Update Skill" : "Save Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
