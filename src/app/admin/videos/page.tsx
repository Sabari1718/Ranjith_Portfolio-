"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Video,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  Play,
  X,
  Search,
  Filter,
  Eye,
  Star,
} from "lucide-react";
import { VideoProject } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

const CATEGORIES = [
  "All",
  "Commercials",
  "Cinematic",
  "Reels & Shorts",
  "YouTube",
  "Motion Graphics",
  "Music Video",
] as const;

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const emptyForm: Omit<VideoProject, "id" | "createdAt"> = {
    title: "",
    description: "",
    category: "Commercials",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "1:00",
    client: "",
    year: new Date().getFullYear().toString(),
    softwareUsed: ["Premiere Pro", "After Effects"],
    featured: false,
    order: 0,
    views: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [softwareInput, setSoftwareInput] = useState("Premiere Pro, After Effects");

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/videos");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) setVideos(data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    return videos
      .filter((v) => {
        const matchesCategory =
          selectedCategory === "All" || v.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          v.title.toLowerCase().includes(q) ||
          (v.client && v.client.toLowerCase().includes(q)) ||
          v.description.toLowerCase().includes(q) ||
          (v.softwareUsed && v.softwareUsed.some((s) => s.toLowerCase().includes(q)));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [videos, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setSoftwareInput("Premiere Pro, After Effects");
    setModalOpen(true);
  };

  const openEditModal = (video: VideoProject) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration || "",
      client: video.client || "",
      year: video.year || "",
      softwareUsed: video.softwareUsed || [],
      featured: video.featured,
      order: video.order,
      views: video.views || "",
    });
    setSoftwareInput((video.softwareUsed || []).join(", "));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...formData,
      softwareUsed: softwareInput.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/videos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Video project updated successfully!" });
          setModalOpen(false);
          fetchVideos();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update video" });
        }
      } else {
        const res = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "New video project created!" });
          setModalOpen(false);
          fetchVideos();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create video" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Video deleted successfully" });
        setDeleteConfirmId(null);
        fetchVideos();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete video" });
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
            <Video className="h-6 w-6 text-electric-400" />
            <span>Video Projects Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your commercials, Reels, YouTube videos, and motion graphics showcased on the website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Video Project</span>
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
            placeholder="Search projects by title, client, software..."
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
                  ? "bg-electric-600 text-white shadow-sm shadow-electric-600/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Count Summary */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredVideos.length}</strong> of {videos.length} video projects
        </span>
        {videos.filter((v) => v.featured).length > 0 && (
          <span className="flex items-center gap-1 text-neon-orange text-[11px] font-medium">
            <Star className="h-3 w-3 fill-neon-orange" />
            <span>{videos.filter((v) => v.featured).length} Featured on Hero / Home</span>
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-12 text-center">
          <Video className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-3 text-sm font-bold text-white">No video projects match your criteria</h3>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your search query or category filter, or add a new video project.
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

      {/* Videos List / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-dark-900/90 overflow-hidden hover:border-white/20 transition-all shadow-lg"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full bg-dark-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 rounded bg-black/75 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-electric-300 uppercase">
                {video.category}
              </span>
              {video.featured && (
                <span className="absolute top-2.5 right-2.5 rounded bg-neon-orange px-2 py-0.5 text-[10px] font-bold text-white shadow-md shadow-neon-orange/30">
                  Featured
                </span>
              )}
              {video.duration && (
                <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-gray-300">
                  {video.duration}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-white text-base line-clamp-1">{video.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{video.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Client: {video.client || "Self Project"}</span>
                  <span>{video.year || "2026"}</span>
                </div>

                {video.views && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <Eye className="h-3 w-3" />
                    <span>{video.views}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {video.softwareUsed?.map((sw, i) => (
                    <span
                      key={i}
                      className="rounded bg-white/5 border border-white/5 px-1.5 py-0.5 text-[10px] text-gray-300"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-electric-400 hover:underline"
                >
                  <Play className="h-3.5 w-3.5 fill-electric-400" />
                  <span>Preview Video</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(video)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    title="Edit Video"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(video.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Video"
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
            <h3 className="text-lg font-bold text-white">Delete Video Project?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              This will permanently delete this video project from the database and remove it from the public website.
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
                <Video className="h-5 w-5 text-electric-400" />
                <span>{editingId ? "Edit Video Project" : "Add New Video Project"}</span>
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
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Hypercar Cinematic Trailer"
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
                    <option value="Commercials">Commercials</option>
                    <option value="Cinematic">Cinematic</option>
                    <option value="Reels & Shorts">Reels & Shorts</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Music Video">Music Video</option>
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
                    placeholder="e.g. RedBull / Nike / Self"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Video URL (YouTube / Vimeo / Direct MP4) <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Thumbnail Uploader */}
              <div className="space-y-1.5">
                <MediaUploader
                  label="Thumbnail Image"
                  currentUrl={formData.thumbnailUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or enter direct thumbnail image URL"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
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
                  placeholder="Describe the project, color grading style, sound design..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 1:45"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Views / Reach
                  </label>
                  <input
                    type="text"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    placeholder="e.g. 1.2M Views"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Software Used (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={softwareInput}
                  onChange={(e) => setSoftwareInput(e.target.value)}
                  placeholder="Premiere Pro, DaVinci Resolve, After Effects"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
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
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-electric-600 focus:ring-electric-500"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-gray-300">
                    Feature on Homepage Showreel
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
                  <span>{editingId ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
