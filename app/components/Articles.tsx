"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

type Article = {
  id: number;
  title: string;
  description: string;
  content: string; // HTML-контент
  type: "image" | "video";
  media: string;
};

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showScroll, setShowScroll] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchArticles();

    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const mapped = data.map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.content.replace(/<[^>]*>/g, "").slice(0, 120), // strip HTML для превью
      content: a.content, // сохраняем HTML
      type: a.media_type,
      media: a.media_url,
    }));

    setArticles(mapped);
  };

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const currentArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-[#0b0b0b] min-h-screen text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-accent">М</span>ои статьи
        </h2>

        {/* Сетка статей */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentArticles.map((article) => (
              <motion.div
                key={article.id}
                className="relative group bg-black/40 p-6 overflow-hidden rounded-xl cursor-pointer backdrop-blur-sm shadow-lg shadow-black/50 hover:shadow-blue-500/50 transition"
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedArticle(article)}
              >
                {/* Синяя рамка SVG */}
                <svg
                  className="absolute inset-0 w-full h-full text-blue-400 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 400 200"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 16 0 L 190 0 L 200 10 L 210 0 L 384 0 A 16 16 0 0 1 400 16 L 400 184 A 16 16 0 0 1 384 200 L 210 200 L 200 190 L 190 200 L 16 200 A 16 16 0 0 1 0 184 L 0 16 A 16 16 0 0 1 16 0 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                {article.media && (
                  <div className="mb-4 relative z-10">
                    {article.type === "image" ? (
                      <img
                        src={article.media}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-700 shadow-inner shadow-black/50"
                      />
                    ) : (
                      <video
                        src={article.media}
                        controls
                        className="w-full h-48 object-cover rounded-lg border border-gray-700 shadow-inner shadow-black/50"
                      />
                    )}
                  </div>
                )}

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <div
                    className="prose prose-invert max-w-full text-gray-300 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- Пагинация --- */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-600 rounded-md hover:text-accent transition disabled:opacity-40"
            >
              ← Назад
            </button>
            <span className="text-gray-400 pt-2">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-600 rounded-md hover:text-accent transition disabled:opacity-40"
            >
              Вперед →
            </button>
          </div>
        )}
      </div>

      {/* Кнопка "вверх" */}
      {showScroll && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500/80 text-white p-3 rounded-full shadow-lg hover:bg-blue-400/90 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Модалка статьи */}
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
              className="relative bg-[#0f1a2b] text-white rounded-xl max-w-3xl w-full p-8 shadow-2xl shadow-blue-500/50 overflow-y-auto max-h-[80vh] border border-blue-400/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-bold mb-4">{selectedArticle.title}</h3>

              <div
                className="prose prose-invert max-w-full text-gray-300 mb-6"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />

              {selectedArticle.type === "image" && (
                <img
                  src={selectedArticle.media}
                  alt={selectedArticle.title}
                  className="w-full rounded-lg border border-blue-400/50 shadow-lg shadow-blue-500/20"
                />
              )}
              {selectedArticle.type === "video" && (
                <video
                  src={selectedArticle.media}
                  controls
                  className="w-full rounded-lg border border-blue-400/50 shadow-lg shadow-blue-500/20"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
