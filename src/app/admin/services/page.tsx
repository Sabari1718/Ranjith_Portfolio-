"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Flame,
  Search,
  Check,
  DollarSign,
} from "lucide-react";
import { Service } from "@/types";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Status filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const emptyForm: Omit<Service, "id"> = {
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    icon: "Film",
    features: ["Narrative pacing optimization", "Export in 4K resolution"],
    popular: false,
    order: 0,
    price: "",
    imageUrl: "",
    active: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [featuresInput, setFeaturesInput] = useState("Narrative pacing optimization\nExport in 4K resolution");

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success) setServices(data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && s.active !== false) ||
          (statusFilter === "inactive" && s.active === false);

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          (s.fullDescription && s.fullDescription.toLowerCase().includes(q)) ||
          (s.features && s.features.some((f) => f.toLowerCase().includes(q)));

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [services, searchQuery, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFeaturesInput("Narrative pacing optimization\nExport in 4K resolution");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      icon: service.icon,
      features: service.features || [],
      popular: service.popular,
      order: service.order,
      price: service.price || "",
      imageUrl: service.imageUrl || "",
      active: service.active !== false,
    });
    setFeaturesInput((service.features || []).join("\n"));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...formData,
      features: featuresInput.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "Service updated successfully!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchServices();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update service" });
        }
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: "New service created!" });
          setModalOpen(false);
          try {
            localStorage.setItem("portfolio_updated", Date.now().toString());
          } catch {}
          fetchServices();
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create service" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Service deleted successfully" });
        setDeleteConfirmId(null);
        try {
          localStorage.setItem("portfolio_updated", Date.now().toString());
        } catch {}
        fetchServices();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete service" });
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
            <Briefcase className="h-6 w-6 text-purple-400" />
            <span>Services Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage creative editing, post-production, branding, and color grading services offered to clients.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
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

      {/* Search and Status Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/90 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services by name, description, features..."
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
            All ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              statusFilter === "active"
                ? "bg-emerald-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Active ({services.filter((s) => s.active !== false).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              statusFilter === "inactive"
                ? "bg-gray-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Inactive ({services.filter((s) => s.active === false).length})
          </button>
        </div>
      </div>

      {/* Services List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
              service.active === false
                ? "border-white/5 bg-dark-900/50 opacity-60"
                : service.popular
                ? "border-electric-500/40 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-850 shadow-lg shadow-electric-600/10"
                : "border-white/10 bg-dark-900/90"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-500/10 text-electric-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {service.active === false && (
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-400">
                      Inactive
                    </span>
                  )}
                  {service.popular && (
                    <span className="flex items-center gap-1 rounded bg-neon-orange/20 px-2 py-0.5 text-[10px] font-bold text-neon-orange">
                      <Flame className="h-3 w-3" />
                      <span>Popular</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">{service.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{service.shortDescription}</p>
                {service.price && (
                  <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Starting from {service.price}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Included Features:
                </span>
                <ul className="space-y-1">
                  {service.features?.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <Check className="h-3.5 w-3.5 text-electric-400 flex-shrink-0" />
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/10">
              <span className="text-[11px] text-gray-500">Order: {service.order}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                  title="Edit Service"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  title="Delete Service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
            <h3 className="text-lg font-bold text-white">Delete Service?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              Are you sure you want to delete this service offering? It will no longer appear on your website.
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
                <Briefcase className="h-5 w-5 text-purple-400" />
                <span>{editingId ? "Edit Service" : "Add New Service"}</span>
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
                    Service Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cinematic Video Editing"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Starting Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹15,000 / $250"
                    className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Short Summary Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="High-energy editing, precision cuts, narrative flow..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed breakdown of workflows, deliverables, and turnaround times..."
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              {/* Service Image (optional) */}
              <div className="space-y-1.5">
                <MediaUploader
                  label="Service Image / Cover (Optional)"
                  currentUrl={formData.imageUrl || ""}
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                  accept="image/*"
                />
                <input
                  type="text"
                  placeholder="Or enter direct image URL"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Key Features / Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Pacing and narrative cutting&#10;Dynamic sound design&#10;Color grading and correction"
                  className="w-full rounded-xl border border-white/10 bg-dark-950 px-4 py-2 text-xs text-white font-mono focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-neon-orange focus:ring-neon-orange"
                  />
                  <label htmlFor="popular" className="text-xs font-semibold text-gray-300">
                    Badge as Popular
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-dark-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="active" className="text-xs font-semibold text-gray-300">
                    Active on Website
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
                  <span>{editingId ? "Update Service" : "Save Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
