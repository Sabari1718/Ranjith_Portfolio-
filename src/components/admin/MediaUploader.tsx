"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
}

/**
 * Resizes and compresses an image on the client side using HTML5 Canvas.
 * Ensures fast upload, prevents Vercel 4.5MB payload limit errors, and generates crisp web images.
 */
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    // If not an image or SVG/GIF, pass through
    if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
      const reader = new FileReader();
      reader.onload = () => resolve({ blob: file, dataUrl: reader.result as string });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ blob: file, dataUrl: e.target?.result as string });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: file, dataUrl });
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve({ blob: file, dataUrl: e.target?.result as string });
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    let compressedBlob: Blob = file;
    let localDataUrl: string = "";

    try {
      // 1. Client-side compression for images
      if (file.type.startsWith("image/")) {
        const result = await compressImage(file);
        compressedBlob = result.blob;
        localDataUrl = result.dataUrl;
        setPreview(localDataUrl);
      }

      // 2. Upload to server
      const formData = new FormData();
      formData.append("file", compressedBlob, file.name);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setPreview(data.url);
        onUploadComplete(data.url);
        setSuccessMsg("Image uploaded successfully!");
      } else {
        // Fallback to client-side dataUrl if server rejects
        if (localDataUrl) {
          setPreview(localDataUrl);
          onUploadComplete(localDataUrl);
          setSuccessMsg("Image loaded and ready!");
        } else {
          setError(data.error || "Upload failed");
        }
      }
    } catch (err: any) {
      console.warn("Upload network error, applying local Data URL fallback:", err);
      if (localDataUrl) {
        setPreview(localDataUrl);
        onUploadComplete(localDataUrl);
        setSuccessMsg("Image loaded and ready!");
      } else {
        setError("Network error while uploading");
      }
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
                <span>Processing & Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <UploadCloud className="h-4 w-4 text-electric-400" />
                <span>Click to select new photo or drag & drop</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <ImageIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
