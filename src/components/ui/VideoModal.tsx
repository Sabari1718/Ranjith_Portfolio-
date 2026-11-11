"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  category?: string;
  description?: string;
}

function getEmbedUrl(url: string): { type: "youtube" | "vimeo" | "video"; embedUrl: string } {
  if (!url) return { type: "video", embedUrl: "" };

  // YouTube matchers
  const ytRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo matcher
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+)\/video\/|)(\d+))/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=a855f7`,
    };
  }

  // Direct MP4 or Cloudinary video
  return {
    type: "video",
    embedUrl: url,
  };
}

export default function VideoModal({ isOpen, onClose, videoUrl, title, category, description }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { type, embedUrl } = getEmbedUrl(videoUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-electric-500/30 bg-dark-900 shadow-2xl shadow-electric-500/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-dark-850/80">
            <div className="flex items-center space-x-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric-500/20 text-electric-400">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white tracking-wide">{title}</h3>
                {category && <span className="text-xs font-medium text-neon-orange uppercase tracking-wider">{category}</span>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Open original video link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black">
            {type === "youtube" || type === "vimeo" ? (
              <iframe
                src={embedUrl}
                title={title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Optional description footer */}
          {description && (
            <div className="px-5 py-3 text-xs text-gray-400 bg-dark-900 border-t border-white/5">
              {description}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

