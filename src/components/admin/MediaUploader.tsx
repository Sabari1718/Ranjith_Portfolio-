"use client";

import { useState, useRef } from "react";
import { UploadCloud, AlertCircle, Loader2 } from "lucide-react";

interface MediaUploaderProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
}

export default function MediaUploader({
  label,
  currentUrl,
  onUploadComplete,
  folder = "ranjith-portfolio",
  accept = "image/*,video/*",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPreview(data.url);
        onUploadComplete(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error while uploading");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Preview block if image */}
        {preview && (
          <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-dark-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex-1 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-dark-900/60 p-4 hover:border-electric-500 hover:bg-dark-900 transition-all text-center"
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-electric-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading to Cloud/Server...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <UploadCloud className="h-4 w-4 text-electric-400" />
                <span>Click to upload new file or drag & drop</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

