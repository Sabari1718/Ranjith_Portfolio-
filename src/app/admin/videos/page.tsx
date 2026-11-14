"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
  Star,
  Upload,
  Link as LinkIcon,
  Film,
  Sparkles,
  Loader2,
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

/**
 * Automatically captures a high-resolution video frame from a video file or blob URL,
 * and extracts the video duration in mm:ss format.
 */
function extractVideoFrameAndDuration(
  fileOrUrl: File | string
): Promise<{ thumbnailDataUrl: string; durationFormatted: string; durationSec: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const sourceUrl = typeof fileOrUrl === "string" ? fileOrUrl : URL.createObjectURL(fileOrUrl);
    video.src = sourceUrl;

    const cleanup = () => {
      if (typeof fileOrUrl !== "string") {
        URL.revokeObjectURL(sourceUrl);
      }
    };

    video.onloadedmetadata = () => {
      // Seek to ~1.0s or middle for best poster frame
      const targetTime = Math.min(1.0, video.duration > 0.5 ? video.duration * 0.25 : 0.1);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxW = 1280;
        const maxH = 720;
        let w = video.videoWidth || 1280;
        let h = video.videoHeight || 720;

        if (w > maxW || h > maxH) {
          if (w / h > maxW / maxH) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          } else {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
        }

        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.85);

        // Format duration
        const totalSec = Math.round(video.duration || 0);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const durationFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

        cleanup();
        resolve({
          thumbnailDataUrl,
          durationFormatted,
          durationSec: totalSec,
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Unable to parse video metadata"));
    };
  });
}

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

  // Video Mode: "upload" (file) or "link" (YouTube / Vimeo / Direct URL)
  const [videoInputMode, setVideoInputMode] = useState<"upload" | "link">("upload");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const videoFileInputRef = useRef<HTMLInputElement>(null);

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
    setVideoInputMode("upload");
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
    // Detect mode
    const isLink =
      video.videoUrl.includes("youtube") ||
      video.videoUrl.includes("youtu.be") ||
      video.videoUrl.includes("vimeo");
    setVideoInputMode(isLink ? "link" : "upload");
    setModalOpen(true);
  };

  // Video File Selection Handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadProgress("Analyzing video & generating thumbnail frame...");

    try {
      // 1. Auto capture video frame and duration
      try {
        const frameData = await extractVideoFrameAndDuration(file);
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: prev.thumbnailUrl || frameData.thumbnailDataUrl,
          duration: frameData.durationFormatted || prev.duration,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
      } catch (thumbErr) {
        console.warn("Could not extract frame automatically:", thumbErr);
      }

      setUploadProgress("Uploading video file...");

      // 2. Upload file to backend (/api/upload)
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "ranjith-portfolio/videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setFormData((prev) => ({
            ...prev,
            videoUrl: data.url,
          }));
          setMessage({
            type: "success",
            text: `Video "${file.name}" uploaded successfully!`,
          });
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } else {
        throw new Error("Server rejected video upload");
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      // Fallback: If file is under 25MB, generate object URL or data URL
      const fallbackUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        videoUrl: fallbackUrl,
      }));
      setMessage({
        type: "error",
        text: `Server upload notice: ${err?.message || "Using local preview"}. You can also paste a direct YouTube / Vimeo link!`,
      });
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress("");
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.title || !formData.title.trim()) {
      setMessage({ type: "error", text: "Please enter a project title" });
      return;
    }

    if (!formData.videoUrl || !formData.videoUrl.trim()) {
      setMessage({ type: "error", text: "Please upload a video file or enter a video link" });
      return;
    }

    // Auto-generate thumbnail from YouTube if link is YouTube and thumbnail is empty
    let finalThumbnail = formData.thumbnailUrl;
    if (!finalThumbnail) {
      const ytMatch = formData.videoUrl.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
      );
      if (ytMatch && ytMatch[1]) {
        finalThumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
      } else {
        finalThumbnail = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
      }
    }

    const payload = {
      ...formData,
      thumbnailUrl: finalThumbnail,
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
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
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
          setMessage({ type: "success", text: "New video project created successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
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
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
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
            Upload actual video files (.mp4, .webm, .mov) or add YouTube/Vimeo links showcased on your website.
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
          <Film className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No video projects found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search terms or filter to see more projects."
              : "Click the 'Add Video Project' button above to showcase your first video."}
          </p>
        </div>
      )}

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group relative flex flex-col rounded-2xl border border-white/10 bg-dark-900/80 overflow-hidden hover:border-electric-500/50 transition-all duration-300"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video w-full bg-dark-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnailUrl || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"}
                alt={video.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="rounded-md bg-black/75 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-electric-300 uppercase tracking-wide">
                  {video.category}
                </span>
                {video.featured && (
                  <span className="rounded-md bg-neon-orange px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                    Featured
                  </span>
                )}
              </div>

              {video.duration && (
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                  {video.duration}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-electric-300 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {video.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
                <span>Client: <strong className="text-gray-300">{video.client || "Personal"}</strong></span>
                <span>{video.year || "2026"}</span>
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
                <span>{editingId ? "Edit Video Project" : "Add Video Project"}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Hypercar Commercial Cut"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Video Source Switcher: Upload File vs Video Link */}
              <div className="space-y-2 rounded-2xl border border-electric-500/30 bg-electric-500/5 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Film className="h-4 w-4 text-neon-orange" />
                    <span>Video Content <span className="text-red-400">*</span></span>
                  </label>

                  {/* Mode Tabs */}
                  <div className="flex items-center rounded-xl bg-dark-950 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setVideoInputMode("upload")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                        videoInputMode === "upload"
                          ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload Video File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode("link")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                        videoInputMode === "link"
                          ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>YouTube / Vimeo Link</span>
                    </button>
                  </div>
                </div>

                {/* Upload File Input */}
                {videoInputMode === "upload" ? (
                  <div className="space-y-3 pt-2">
                    <div
                      onClick={() => !isUploadingVideo && videoFileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-dark-950/70 p-6 text-center cursor-pointer transition-colors ${
                        isUploadingVideo ? "opacity-60 cursor-not-allowed" : "hover:border-electric-500 hover:bg-dark-950"
                      }`}
                    >
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/mov,video/*"
                        className="hidden"
                        onChange={handleVideoFileChange}
                      />

                      {isUploadingVideo ? (
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-electric-400" />
                          <span className="text-xs font-bold text-white">{uploadProgress || "Uploading video..."}</span>
                          <span className="text-[11px] text-gray-400">Please wait while the video frame is processed...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-500/20 text-electric-400">
                            <Upload className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white">Click to Select & Upload Video File</span>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Supports MP4, WebM, MOV files. Video thumbnail & duration are captured automatically!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {formData.videoUrl && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-gray-400">Current Video URL / Path:</label>
                        <input
                          type="text"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="Video URL or storage path"
                          className="w-full rounded-xl border border-white/10 bg-dark-950 px-3 py-1.5 text-xs text-electric-300 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Video Link Input */
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="Paste YouTube, Vimeo or direct video link (e.g. https://www.youtube.com/watch?v=...)"
                      className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-400">
                      YouTube thumbnails and durations are parsed automatically when saved!
                    </p>
                  </div>
                )}

                {/* Video Preview Player inside Modal */}
                {formData.videoUrl && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-dark-950 p-2 overflow-hidden">
                    <span className="text-[11px] font-bold text-electric-300 block mb-1.5">
                      Live Video Preview:
                    </span>
                    {formData.videoUrl.includes("youtube") || formData.videoUrl.includes("youtu.be") ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                        <iframe
                          src={
                            formData.videoUrl.includes("shorts/")
                              ? `https://www.youtube.com/embed/${formData.videoUrl.split("shorts/")[1]?.split("?")[0]}`
                              : formData.videoUrl.includes("v=")
                              ? `https://www.youtube.com/embed/${formData.videoUrl.split("v=")[1]?.split("&")[0]}`
                              : `https://www.youtube.com/embed/${formData.videoUrl.split("/").pop()}`
                          }
                          className="h-full w-full border-0"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        src={formData.videoUrl}
                        controls
                        className="aspect-video w-full rounded-lg bg-black object-contain max-h-56"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>

              {/* Category & Client */}
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

              {/* Optional Custom Thumbnail (Auto-extracted or custom) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Cover / Thumbnail (Auto-Generated or Custom)
                  </label>
                  {formData.thumbnailUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Frame Ready
                    </span>
                  )}
                </div>
                <MediaUploader
                  label="Custom Cover Image (Optional)"
                  currentUrl={formData.thumbnailUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or enter direct thumbnail image URL (optional)"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project cut, pace, grading, sound design..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Duration, Year, Views */}
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

              {/* Software Used */}
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

              {/* Order & Featured */}
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

              {/* Modal Actions */}
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
                  disabled={isUploadingVideo}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 disabled:opacity-50"
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
