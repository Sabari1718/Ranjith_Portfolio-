"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, User } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  client?: string;
  toolsUsed?: string[];
}

export default function ImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  category,
  description,
  client,
  toolsUsed,
}: LightboxProps) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-dark-900 shadow-2xl"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-dark-850/90">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neon-orange">
                {category}
              </span>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Visual Display */}
          <div className="relative flex min-h-[300px] max-h-[68vh] items-center justify-center overflow-auto bg-dark-950 p-2 sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[64vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>

          {/* Info Footer */}
          <div className="border-t border-white/10 bg-dark-850/95 px-6 py-4 text-sm text-gray-300">
            {description && <p className="mb-3 text-sm text-gray-300">{description}</p>}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              {client && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-electric-400" />
                  <span>Client: <strong className="text-gray-200">{client}</strong></span>
                </div>
              )}
              {toolsUsed && toolsUsed.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-neon-orange" />
                  <span>Tools:</span>
                  <div className="flex flex-wrap gap-1">
                    {toolsUsed.map((tool, i) => (
                      <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-gray-300 border border-white/10">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

