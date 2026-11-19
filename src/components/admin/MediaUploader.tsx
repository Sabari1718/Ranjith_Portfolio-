"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Check,
  X,
  Sliders,
} from "lucide-react";

interface MediaUploaderProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
  enableCrop?: boolean; // Enable Instagram-style pan & zoom adjustment
  cropAspect?: "circle" | "1:1" | "9:16" | "4:5";
}

export default function MediaUploader({
  label,
  currentUrl,
  onUploadComplete,
  folder = "ranjith-portfolio",
  accept = "image/*,video/*",
  enableCrop = true,
  cropAspect = "circle",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper Modal States
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  // Crop / Adjust Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUrl) {
      setPreview(currentUrl);
    }
  }, [currentUrl]);

  // When user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMsg(null);

    // If it's an image and enableCrop is on, open the adjustment / crop modal
    if (file.type.startsWith("image/") && enableCrop) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result as string);
        setRawFile(file);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } else {
      // Non-image or crop disabled: direct upload
      processAndUploadBlob(file, file.name);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Dragging / Panning handlers inside Cropper
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Crop & Export via HTML5 Canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current || !cropAreaRef.current) {
      setShowCropModal(false);
      return;
    }

    try {
      const img = imageRef.current;
      const cropArea = cropAreaRef.current;

      const cropRect = cropArea.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Output size: 1000x1000 crisp square
      const targetSize = 1000;
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setShowCropModal(false);
        return;
      }

      // Calculate source image coordinates corresponding to cropRect
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      const sourceX = (cropRect.left - imgRect.left) * scaleX;
      const sourceY = (cropRect.top - imgRect.top) * scaleY;
      const sourceW = cropRect.width * scaleX;
      const sourceH = cropRect.height * scaleY;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        0,
        0,
        targetSize,
        targetSize
      );

      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPreview(croppedDataUrl);
      setShowCropModal(false);

      // Convert to blob and upload
      canvas.toBlob(
        (blob) => {
          if (blob) {
            processAndUploadBlob(blob, rawFile?.name || "profile.jpg", croppedDataUrl);
          } else {
            onUploadComplete(croppedDataUrl);
            setSuccessMsg("Adjusted photo applied successfully!");
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error("Error cropping image:", err);
      setShowCropModal(false);
    }
  };

  // Upload or fallback to Data URL
  const processAndUploadBlob = async (blob: Blob, fileName: string, fallbackDataUrl?: string) => {
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    let localDataUrl = fallbackDataUrl || "";
    if (!localDataUrl && blob.type.startsWith("image/")) {
      localDataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(blob);
      });
      setPreview(localDataUrl);
    }

    try {
      const formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setPreview(data.url);
        onUploadComplete(data.url);
        setSuccessMsg("Photo uploaded and adjusted successfully!");
      } else {
        if (localDataUrl) {
          setPreview(localDataUrl);
          onUploadComplete(localDataUrl);
          setSuccessMsg("Adjusted photo ready!");
        } else {
          setError(data.error || "Upload failed");
        }
      }
    } catch {
      if (localDataUrl) {
        setPreview(localDataUrl);
        onUploadComplete(localDataUrl);
        setSuccessMsg("Adjusted photo ready!");
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
        {/* Preview circle / block */}
        {preview && (
          <div className="relative group flex-shrink-0">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-electric-500/50 bg-dark-950 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            </div>

            {/* Adjust Button if an image is already uploaded */}
            {enableCrop && (
              <button
                type="button"
                onClick={() => {
                  setRawImageSrc(preview);
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setShowCropModal(true);
                }}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                title="Adjust / Reposition Photo"
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>
            )}
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

      {/* INSTAGRAM-STYLE PHOTO ADJUSTMENT / CROP MODAL */}
      {showCropModal && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-dark-900 p-6 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="h-5 w-5 text-neon-orange" />
                <h3 className="text-sm font-bold text-white">Adjust & Position Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Drag photo to reposition inside the circle. Use zoom slider for perfect framing (Instagram style).
            </p>

            {/* Interactive Crop Viewport */}
            <div className="relative flex items-center justify-center bg-black/90 rounded-2xl h-72 sm:h-80 overflow-hidden select-none border border-white/10">
              {/* Circular Overlay Mask */}
              <div
                ref={cropAreaRef}
                className="pointer-events-none absolute z-20 h-56 w-56 sm:h-64 sm:w-64 rounded-full border-2 border-electric-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ring-2 ring-neon-orange/40"
              />

              {/* Grid guides inside circle */}
              <div className="pointer-events-none absolute z-20 h-56 w-56 sm:h-64 sm:w-64 rounded-full flex flex-col justify-between opacity-30">
                <div className="border-b border-white/40 h-1/3" />
                <div className="border-b border-white/40 h-1/3" />
              </div>
              <div className="pointer-events-none absolute z-20 h-56 w-56 sm:h-64 sm:w-64 rounded-full flex justify-between opacity-30">
                <div className="border-r border-white/40 w-1/3" />
                <div className="border-r border-white/40 w-1/3" />
              </div>

              {/* Draggable & Zoomable Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={rawImageSrc}
                alt="Adjust preview"
                draggable={false}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  cursor: isDragging ? "grabbing" : "grab",
                  transition: isDragging ? "none" : "transform 0.05s ease-out",
                }}
                className="max-h-none max-w-none origin-center"
              />

              {/* Move hint badge */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-gray-300 backdrop-blur-sm pointer-events-none">
                <Move className="h-3 w-3 text-neon-orange" />
                <span>Drag to pan</span>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="h-4 w-4 text-electric-400" />
                  <span>Zoom / Scale: {Math.round(zoom * 100)}%</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <ZoomOut className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-electric-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <ZoomIn className="h-4 w-4 text-electric-400 flex-shrink-0" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-5 py-2 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Check className="h-4 w-4" />
                <span>Apply & Set Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
