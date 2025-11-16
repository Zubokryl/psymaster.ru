"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Article } from "../types";

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const videoRefs = useRef<Map<HTMLVideoElement, boolean>>(new Map());

  const registerVideo = (el: HTMLVideoElement | null) => {
    if (!el) return;
    videoRefs.current.set(el, false);
  };

  // IntersectionObserver для видео
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((_v, el) => observer.observe(el));
    return () => videoRefs.current.forEach((_v, el) => observer.unobserve(el));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-[#0f1a2b] text-white rounded-xl max-w-3xl w-full p-8 shadow-2xl shadow-[#8a0404]/40 overflow-y-auto max-h-[80vh] border border-[#8a0404]/50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          title="Close"
        >
          <X size={24} />
        </button>

        <h3 className="text-3xl font-bold mb-4">{article.title}</h3>

        {article.media_url && (
          <div className="mb-6 w-full max-h-[400px] flex items-center justify-center rounded-lg overflow-hidden bg-black/40 border border-gray-700 shadow-md shadow-black/30">
            {article.media_type === "image" ? (
              <img
                src={article.media_url}
                alt={article.title}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={article.media_url}
                controls
                preload="metadata"
                poster="/video-placeholder.jpg"
                className="max-h-full max-w-full object-contain"
                playsInline
                muted
                loop
                ref={registerVideo}
              />
            )}
          </div>
        )}

        <div
          className="prose prose-invert max-w-full text-gray-300"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </motion.div>
    </motion.div>
  );
}
