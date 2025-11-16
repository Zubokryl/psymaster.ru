"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabaseClient";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "../components/Pagination";
import { handleEdit, handleDelete } from "../lib/articlesHandlers";
import type { Metadata } from "next";
import type { Article } from "../types";


export const metadata: Metadata = {
  title: "Статьи — Психолог Денис Горбунов",
  alternates: {
    canonical: "https://psymaster-ru.vercel.app/articles",
  },
};


const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Articles({ initialArticles = [] }: { initialArticles?: Article[] }) {
  const { data, error } = useSWR("/api/articles", fetcher, {
    fallbackData: initialArticles,
    refreshInterval: 60000,
  });

  interface SupaUser extends User {
    user_metadata: {
      role?: string;
    };
  }

  const [user, setUser] = useState<SupaUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user as SupaUser | null));
  }, []);

  const isAdmin = user?.user_metadata?.role === "admin";

  const articles: Article[] = Array.isArray(data) ? data : [];

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showScroll, setShowScroll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 9;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const paginatedArticles = articles.length
  ? articles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
  : [];


  const router = useRouter();

  // Скролл кнопка вверх
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const videoRefs = new Map<HTMLVideoElement, boolean>();
  const registerVideo = (el: HTMLVideoElement | null) => {
    if (!el) return;
    videoRefs.set(el, false);
  };

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

    videoRefs.forEach((_v, el) => observer.observe(el));

    return () => videoRefs.forEach((_v, el) => observer.unobserve(el));
  }, []);

  if (error)
    return <p className="text-center text-red-400 py-24">Ошибка загрузки статей</p>;
  if (!articles.length)
    return (
      <p className="text-center text-gray-400 py-24 animate-pulse">
        Загрузка статей...
      </p>
    );

  return (
    <section className="py-24 min-h-screen text-white bg-cover bg-center bg-no-repeat articles-background">
      <div className="container mx-auto px-4">
        {/* Сетка статей */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {paginatedArticles.map((article: Article) => (
            <motion.div
              key={article.id}
              className="relative group bg-dark-glass p-6 overflow-hidden rounded-xl cursor-pointer flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedArticle(article)}
            >
              {/* SVG-рамка */}
              <svg
                className="absolute inset-0 w-full h-full text-gray-800 opacity-90 group-hover:text-[#8a0404] transition-all duration-300"
                viewBox="0 0 400 200"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="
                    M 16 0 
                    L 384 0 
                    A 16 16 0 0 1 400 16 
                    L 400 95 
                    L 385 100 
                    L 400 105 
                    L 400 184 
                    A 16 16 0 0 1 384 200 
                    L 16 200 
                    A 16 16 0 0 1 0 184 
                    L 0 105 
                    L 15 100 
                    L 0 95 
                    L 0 16 
                    A 16 16 0 0 1 16 0 
                    Z
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>

              {/* Контент карточки */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-3 text-white tracking-wide group-hover:text-[#8a0404] transition-colors">
                  {article.title}
                </h3>

                {article.media_url && (
                  <div className="mb-4 w-full h-[180px] flex items-center justify-center rounded-lg overflow-hidden bg-black/40 border border-gray-700 shadow-md shadow-black/30">
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
                        className="max-h-full max-w-full object-contain"
                        playsInline
                        muted
                        loop
                        ref={(el) => registerVideo(el)}
                      />
                    )}
                  </div>
                )}

                {/* Текст превью */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="text-gray-300 prose prose-invert prose-sm max-w-none articleContent"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>

                {/* Кнопка "Читать" */}
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2 rounded-lg font-semibold tracking-wide text-white bg-[#1d3a5f] 
                      border border-[#2a4468]/60 shadow-md shadow-black/40
                      transition-colors duration-300
                      hover:bg-white hover:text-[#2b4c73]"
                  >
                    Читать
                  </button>
                </div>

                {/* Кнопки только для админа */}
                {isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(router, article)}
                      className="flex-1 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-1"
                    >
                      <Edit size={16} /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(articles, article.id)}
                      className="flex-1 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} /> Удалить
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Кнопка наверх */}
      {showScroll && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#8a0404]/80 text-white p-3 rounded-full shadow-lg hover:bg-[#8a0404]/90 transition z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Модальное окно */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="relative bg-[#0f1a2b] text-white rounded-xl max-w-3xl w-full p-8 shadow-2xl shadow-[#8a0404]/40 overflow-y-auto max-h-[80vh] border border-[#8a0404]/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                title="Close"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-bold mb-4">{selectedArticle.title}</h3>
              <div
                className="prose prose-invert max-w-full text-gray-300 mb-6"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
