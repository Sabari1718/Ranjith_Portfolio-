"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Palette,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Filter,
  ExternalLink,
  Star,
} from "lucide-react";
import { GraphicDesign } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

const CATEGORIES = [
  "All",
  "Logo & Branding",
  "Posters & Print",
  "Social Media",
  "Thumbnails",
  "Advertising",
  "Creative Artwork",
] as const;

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<GraphicDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const emptyForm: Omit<GraphicDesign, "id" | "createdAt"> = {
    title: "",
    description: "",
    category: "Logo & Branding",
    imageUrl: "",
    client: "",
    toolsUsed: ["Adobe Photoshop", "Illustrator"],
    featured: false,
    aspectRatio: "square",
    order: 0,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [toolsInput, setToolsInput] = useState("Adobe Photoshop, Illustrator");

  const fetchDesigns = async () => {
    try {
      const res = await fetch("/api/admin/designs");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) setDesigns(data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const filteredDesigns = useMemo(() => {
    return designs
      .filter((d) => {
        const matchesCategory =
          selectedCategory === "All" || d.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          d.title.toLowerCase().includes(q) ||
          (d.client && d.client.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q) ||
          (d.toolsUsed && d.toolsUsed.some((t) => t.toLowerCase().includes(q)));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [designs, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setToolsInput("Adobe Photoshop, Illustrator");
    setModalOpen(true);
  };

  const openEditModal = (design: GraphicDesign) => {
    setEditingId(design.id);
    setFormData({
      title: design.title,
      description: design.description,
      category: design.category,
      imageUrl: design.imageUrl,
      client: design.client || "",
      toolsUsed: design.toolsUsed || [],
      featured: design.featured,
      aspectRatio: design.aspectRatio || "square",
      order: design.order,
    });
    setToolsInput((design.toolsUsed || []).join(", "));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...formData,
      toolsUsed: toolsInput.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/designs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Graphic design updated successfully!" });
          setModalOpen(false);
          fetchDesigns();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update design" });
        }
      } else {
        const res = await fetch("/api/admin/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "New graphic design added!" });
          setModalOpen(false);
          fetchDesigns();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to add design" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/designs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Design deleted successfully" });
        setDeleteConfirmId(null);
        fetchDesigns();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete design" });
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
            <Palette className="h-6 w-6 text-neon-orange" />
            <span>Graphic Design Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage branding, posters, social media creatives, thumbnails, and vector artwork shown on the portfolio.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Graphic Design</span>
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
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search designs by title, client, tools..."
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="h-3.5 w-3.5 text-gray-500 ml-1 mr-1 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-neon-orange text-white shadow-sm shadow-neon-orange/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Designs Count Summary */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredDesigns.length}</strong> of {designs.length} graphic designs
        </span>
        {designs.filter((d) => d.featured).length > 0 && (
          <span className="flex items-center gap-1 text-neon-orange text-[11px] font-medium">
            <Star className="h-3 w-3 fill-neon-orange" />
            <span>{designs.filter((d) => d.featured).length} Featured Designs</span>
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredDesigns.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-12 text-center">
          <Palette className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-3 text-sm font-bold text-white">No graphic designs found</h3>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your search query or category filter, or upload a new creative design.
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-dark-900/90 overflow-hidden hover:border-white/20 transition-all shadow-lg"
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/3] w-full bg-dark-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.imageUrl}
                alt={design.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 rounded bg-black/75 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-neon-orange uppercase">
                {design.category}
              </span>
              {design.featured && (
                <span className="absolute top-2.5 right-2.5 rounded bg-electric-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md shadow-electric-600/30">
                  Featured
                </span>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-white text-base line-clamp-1">{design.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{design.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Client: {design.client || "Creative Concept"}</span>
                  <span className="capitalize">{design.aspectRatio} format</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {design.toolsUsed?.map((t, i) => (
                    <span
                      key={i}
                      className="rounded bg-white/5 border border-white/5 px-1.5 py-0.5 text-[10px] text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <a
                  href={design.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-neon-orange hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Full Image</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(design)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    title="Edit Design"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(design.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Design"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
            <h3 className="text-lg font-bold text-white">Delete Graphic Design?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              This will permanently delete this design asset from the database and remove it from the public portfolio.
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
                <Palette className="h-5 w-5 text-neon-orange" />
                <span>{editingId ? "Edit Graphic Design" : "Add New Graphic Design"}</span>
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
                  Design Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Zenith Cyberpunk Visual Identity"
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="Logo & Branding">Logo & Branding</option>
                    <option value="Posters & Print">Posters & Print</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Thumbnails">Thumbnails</option>
                    <option value="Advertising">Advertising</option>
                    <option value="Creative Artwork">Creative Artwork</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. RedBull, Aura Fitness, Personal"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <div className="space-y-1.5">
                <MediaUploader
                  label="Design Artwork Image"
                  currentUrl={formData.imageUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or enter direct image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe typography, color palettes, visual concept..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Tools Used (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="Photoshop, Illustrator, InDesign, Blender"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Aspect Ratio Layout
                  </label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="square">Square (1:1 - Instagram Post / Logo)</option>
                    <option value="vertical">Vertical (9:16 / 4:5 - Story / Poster)</option>
                    <option value="horizontal">Horizontal (16:9 - Banner / Header)</option>
                  </select>
                </div>
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
                    id="designFeatured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-neon-orange focus:ring-neon-orange"
                  />
                  <label htmlFor="designFeatured" className="text-xs font-semibold text-gray-300">
                    Feature in Design Highlights
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
                  <span>{editingId ? "Update Design" : "Save Design"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
