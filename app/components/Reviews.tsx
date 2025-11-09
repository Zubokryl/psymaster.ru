"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp } from "lucide-react";

type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar?: string;       // опциональный аватар автора
  screenshot?: string;   // опциональный скриншот отзыва
};


type ReviewsProps = {
  reviews: Review[];
};

export default function Reviews({ reviews }: ReviewsProps) {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showScroll, setShowScroll] = useState(false);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="py-24 bg-[#0b0b0b] min-h-screen text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-accent">О</span>тзывы
        </h2>

        {/* Сетка отзывов */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentReviews.map((review) => (
              <motion.div
                key={review.id}
                className="relative group bg-dark-glass p-6 overflow-hidden rounded-xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReview(review)}
              >
                <svg
                  className="absolute inset-0 w-full h-full text-gray-800 opacity-90 group-hover:text-accent transition-all duration-300"
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

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">{review.name}</h3>
                  <p className="mb-2 text-gray-400 text-sm">{review.date}</p>
                  <p className="text-gray-300 line-clamp-4">{review.text}</p>
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
          className="fixed bottom-6 right-6 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-[#a50a0a] transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Модалка для отзыва */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              className="relative bg-[#111] text-white rounded-xl max-w-3xl w-full p-8 shadow-2xl overflow-y-auto max-h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-bold mb-4">{selectedReview.name}</h3>
              <p className="text-gray-400 mb-6">{selectedReview.date}</p>
              <p className="text-gray-300">{selectedReview.text}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

