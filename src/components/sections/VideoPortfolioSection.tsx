"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Clock, Eye } from "lucide-react";
import { VideoProject } from "@/types";
import VideoModal from "@/components/ui/VideoModal";

interface VideoPortfolioSectionProps {
  videos: VideoProject[];
}

export default function VideoPortfolioSection({ videos }: VideoPortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  const categories = [
    "All",
    "Commercials",
    "Reels & Shorts",
    "Cinematic",
    "YouTube",
    "Motion Graphics",
  ];

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <>
      <section id="videos" className="relative py-24 sm:py-32 bg-dark-950 border-t border-white/[0.06] overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-10 right-1/4 w-[500px] h-[500px] bg-electric-600/10 blur-[150px] rounded-full" />
        <div className="pointer-events-none absolute bottom-10 left-10 w-[400px] h-[400px] bg-neon-orange/10 blur-[140px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-neon-orange/30 bg-neon-orange/10 px-4 py-1.5 text-xs font-bold text-neon-orange uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Motion & Visual Storytelling</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Featured Video Projects
              </h2>
              <p className="text-base text-gray-400">
                A curated selection of high-retention commercials, viral vertical content, cinematic documentaries, and motion graphics designed to mesmerize.
              </p>
            </div>

            <div className="text-sm font-semibold text-gray-400">
              Showing <span className="text-white font-bold">{filteredVideos.length}</span> visual stories
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

          {/* Videos Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredVideos.map((video) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-dark-850/80 backdrop-blur-xl overflow-hidden glass-panel-hover"
                >
                  {/* Thumbnail / Video Preview Trigger */}
                  <div
                    onClick={() => setActiveVideo(video)}
                    className="relative aspect-video w-full cursor-pointer overflow-hidden bg-dark-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-electric-600/90 text-white shadow-lg shadow-electric-600/50 backdrop-blur-md group-hover:scale-115 group-hover:bg-neon-orange transition-all duration-300">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Badges on Thumbnail */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-electric-300 border border-white/10 uppercase tracking-wide">
                        {video.category}
                      </span>
                      {video.featured && (
                        <span className="rounded-lg bg-neon-orange/90 px-2 py-1 text-[11px] font-bold text-white shadow">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      {video.duration && (
                        <span className="flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-medium text-gray-200 backdrop-blur-md">
                          <Clock className="h-3 w-3 text-neon-orange" />
                          <span>{video.duration}</span>
                        </span>
                      )}
                      {video.views && (
                        <span className="flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-medium text-gray-200 backdrop-blur-md">
                          <Eye className="h-3 w-3 text-electric-400" />
                          <span>{video.views}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Video Meta Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
                    <div>
                      {video.client && (
                        <div className="text-xs font-semibold text-gray-400 mb-1">
                          Client: <span className="text-gray-200">{video.client}</span>
                        </div>
                      )}
                      <h3
                        onClick={() => setActiveVideo(video)}
                        className="text-lg font-bold text-white group-hover:text-electric-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {video.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Software tags */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {video.softwareUsed?.map((sw, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-300"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveVideo(video)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-neon-orange hover:text-white transition-colors"
                      >
                        <span>Watch</span>
                        <Play className="h-3 w-3 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-dark-850/50">
              <p className="text-gray-400">No video projects found in this category.</p>
            </div>
          )}

        </div>
      </section>

      {/* Video Preview Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.videoUrl}
          title={activeVideo.title}
          category={activeVideo.category}
          description={activeVideo.description}
        />
      )}
    </>
  );
}

