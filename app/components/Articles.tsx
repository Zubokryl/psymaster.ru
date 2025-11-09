// app/components/Articles.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp } from "lucide-react";

type Article = {
  id: number;
  title: string;
  content: string;
  media_url?: string;
  media_type?: "image" | "video";
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
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setArticles(data);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const currentArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="py-24 bg-[#0b0b0b] min-h-screen text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-accent">М</span>ои статьи
        </h2>

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
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>

                <div
                  className="prose prose-invert max-w-full text-gray-300 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {article.media_url && (
                  <div className="mt-4">
                    {article.media_type === "image" ? (
                      <img
                        src={article.media_url}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-700"
                      />
                    ) : (
                      <video
                        src={article.media_url}
                        controls
                        className="w-full h-48 object-cover rounded-lg border border-gray-700"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Кнопка вверх */}
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

      {/* Модалка */}
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
              {selectedArticle.media_type === "image" && (
                <img
                  src={selectedArticle.media_url}
                  alt={selectedArticle.title}
                  className="w-full rounded-lg border border-blue-400/50 shadow-lg shadow-blue-500/20"
                />
              )}
              {selectedArticle.media_type === "video" && (
                <video
                  src={selectedArticle.media_url}
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
