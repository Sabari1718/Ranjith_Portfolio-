"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Palette } from "lucide-react";
import { GraphicDesign } from "@/types";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface GraphicDesignSectionProps {
  designs: GraphicDesign[];
}

export default function GraphicDesignSection({ designs }: GraphicDesignSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeDesign, setActiveDesign] = useState<GraphicDesign | null>(null);

  const categories = [
    "All",
    "Logo & Branding",
    "Posters & Print",
    "Thumbnails",
    "Social Media",
    "Advertising",
    "Creative Artwork",
  ];

  const filteredDesigns =
    selectedCategory === "All"
      ? designs
      : designs.filter((d) => d.category === selectedCategory);

  return (
    <>
      <section id="designs" className="relative py-24 sm:py-32 bg-dark-900 border-t border-white/[0.06] overflow-hidden">
        {/* Ambient lighting */}
        <div className="pointer-events-none absolute top-1/3 left-1/3 w-[550px] h-[550px] bg-electric-600/10 blur-[160px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 right-10 w-[400px] h-[400px] bg-neon-orange/10 blur-[130px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-bold text-electric-300 uppercase tracking-widest">
                <Palette className="h-3.5 w-3.5" />
                <span>Graphic Design & Art Direction</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Brand & Graphic Portfolio
              </h2>
              <p className="text-base text-gray-400">
                Bold visual identities, scroll-stopping social ad creatives, high-CTR YouTube thumbnails, and modern typography curated to convert.
              </p>
            </div>

            <div className="text-sm font-semibold text-gray-400">
              Showing <span className="text-white font-bold">{filteredDesigns.length}</span> artworks
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 pb-8">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-electric-600 to-neon-orange text-white shadow-lg shadow-electric-600/25 scale-105"
                      : "border border-white/10 bg-dark-850/60 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Responsive Gallery Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredDesigns.map((design) => (
                <motion.div
                  layout
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setActiveDesign(design)}
                  className="group relative cursor-pointer rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl overflow-hidden glass-panel-hover flex flex-col"
                >
                  {/* Artwork Image Container */}
                  <div className={`relative w-full overflow-hidden bg-dark-950 ${
                    design.aspectRatio === "vertical" ? "aspect-[4/5]" : design.aspectRatio === "horizontal" ? "aspect-[16/10]" : "aspect-square"
                  }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Quick Lightbox Zoom Icon on Hover */}
                    <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4 text-electric-400" />
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-electric-300 border border-white/10 uppercase tracking-wider">
                        {design.category}
                      </span>
                    </div>

                    {design.featured && (
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-lg bg-neon-orange/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                          Featured Design
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caption Meta */}
                  <div className="p-5 flex flex-1 flex-col justify-between">
                    <div>
                      {design.client && (
                        <div className="text-[11px] font-semibold text-gray-400 mb-1">
                          Client: <span className="text-gray-200">{design.client}</span>
                        </div>
                      )}
                      <h3 className="text-base font-bold text-white group-hover:text-electric-300 transition-colors line-clamp-1">
                        {design.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {design.description}
                      </p>
                    </div>

                    {/* Tools badges */}
                    {design.toolsUsed && design.toolsUsed.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                        {design.toolsUsed.map((tool, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredDesigns.length === 0 && (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-dark-850/50">
              <p className="text-gray-400">No graphic design items found in this category.</p>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Modal */}
      {activeDesign && (
        <ImageLightbox
          isOpen={Boolean(activeDesign)}
          onClose={() => setActiveDesign(null)}
          imageUrl={activeDesign.imageUrl}
          title={activeDesign.title}
          category={activeDesign.category}
          description={activeDesign.description}
          client={activeDesign.client}
          toolsUsed={activeDesign.toolsUsed}
        />
      )}
    </>
  );
}

