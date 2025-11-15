"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";


type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar?: string;
  screenshot?: string;
};

type ReviewsProps = {
  reviews: Review[];
};

interface DeleteResponse {
  success: boolean;
  error?: string;
}

export default function Reviews({ reviews }: ReviewsProps) {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);
  const totalPages = Math.ceil(reviewsList.length / itemsPerPage);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showScroll, setShowScroll] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", text: "" });
  

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const isAdmin = (user?.user_metadata as { role?: string })?.role === "admin";


  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этот отзыв?")) return;

    if (!isAdmin) {
      alert("У вас нет прав на удаление");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Ошибка при удалении: " + error.message);
    } else {
      setReviewsList((prev) => prev.filter((r) => r.id !== id));
    }
  };


  const currentReviews = reviewsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });


  const handleSaveReview = async () => {
    if (!newReview.name || !newReview.text) {
      alert("Заполните все поля");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const saved: Review = await res.json();
      setReviewsList((prev) => [saved, ...prev]);
      setShowNewReviewModal(false);
      setNewReview({ name: "", text: "" });
      setCurrentPage(1);
    } catch (err) {
      alert("Ошибка при сохранении отзыва");
    }
  };


  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviewsList(data);
        } else {
          setReviewsList([]);
        }
      })
      .catch(() => setReviewsList([]));
  }, []);


  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-24 min-h-screen text-white bg-[url('/assets/leaves.jpg')] bg-cover bg-center bg-no-repeat">

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
          <span className="text-accent">О</span>тзывы
        </h2>

        <div className="flex justify-center mb-12">
          <button
            onClick={() => setShowNewReviewModal(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-[#a50a0a] transition"
          >
            Оставить свой отзыв
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentReviews.map((review, index) => (
              <motion.div
                key={review.id ?? `${review.name}-${index}`}
                className="relative group bg-dark-glass p-6 overflow-hidden rounded-xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReview(review)}
              >
                {/* SVG рамка */}
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
               
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(review.id);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400 z-20"
                    title="Удалить отзыв"
                  >
                    Удалить отзыв
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

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
                title="Close review"
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

      <AnimatePresence>
        {showNewReviewModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewReviewModal(false)}
          >
            <motion.div
              className="bg-[#111] text-white rounded-xl max-w-lg w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowNewReviewModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                title="Закрыть модальное окно"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">Ваш отзыв</h3>
              <input
                type="text"
                placeholder="Имя"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                className="w-full mb-3 p-2 rounded bg-[#1a1a1a] text-white"
              />
              <textarea
                placeholder="Текст отзыва"
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
                className="w-full mb-3 p-2 rounded bg-[#1a1a1a] text-white resize-none"
                rows={5}
              />
              <button
                onClick={handleSaveReview}
                className="w-full py-2 bg-accent rounded hover:bg-[#a50a0a] transition"
              >
                Сохранить
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
