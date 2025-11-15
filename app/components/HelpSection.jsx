"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "./helpSection.css"; 

const DENIS_PHONE_NUMBER = "+79831465722";

const handleCall = () => {
  window.location.href = `tel:${DENIS_PHONE_NUMBER}`;
};

const situations = [
  "Сложные жизненные ситуации",
  "Проблемы в семье",
  "Потеря мотивации",
  "Стресс и тревога"
];

const goals = [
  "Развитие личностного потенциала",
  "Принятие важных решений",
  "Эмоциональная стабилизация",
  "Улучшение отношений"
];

const diplomas = [
  "/assets/diploma1.jpg",
  "/assets/diploma2.jpg",
  "/assets/diploma3.jpg",
  "/assets/diploma4.jpg"
];

export default function HelpSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);
  const prevImage = () => setCurrentIndex((currentIndex - 1 + diplomas.length) % diplomas.length);
  const nextImage = () => setCurrentIndex((currentIndex + 1) % diplomas.length);

  return (
  <section className="help-section relative py-24 bg-dark overflow-hidden">
    {/* Ситуации */}
    <div className="container mx-auto px-4">
      <motion.h2
        className="font-heading text-3xl md:text-5xl mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="text-accent">Т</span>вой шанс, когда...
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {situations.map((situation, index) => (
          <motion.div
            key={index}
            className="relative group bg-dark-glass p-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <svg
              className="absolute inset-0 w-full h-full text-gray-800 opacity-90 group-hover:text-accent transition-all duration-300"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 16 0 L 190 0 L 200 10 L 210 0 L 384 0 A 16 16 0 0 1 400 16 L 400 184 A 16 16 0 0 1 384 200 L 210 200 L 200 190 L 190 200 L 16 200 A 16 16 0 0 1 0 184 L 0 16 A 16 16 0 0 1 16 0 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <p className="relative font-body text-xl text-gray-300 z-10">{situation}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* О себе */}
    <div className="container mx-auto px-4 mt-20 max-w-5xl">
      <motion.p
        className="text-xl md:text-2xl text-center text-gray-300 max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Я индивидуальный <span className="text-accent">коуч</span> и <span className="text-accent">психолог</span>, специализирующийся на работе с людьми, пережившими <span className="text-accent">зависимость</span>.
      </motion.p>

      <motion.h3
        className="font-heading text-3xl md:text-5xl text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <span className="text-accent">П</span>омогу
      </motion.h3>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            className="relative group bg-dark-glass p-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <svg
              className="absolute inset-0 w-full h-full text-gray-800 opacity-90 group-hover:text-accent transition-all duration-300"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 16 0 L 190 0 L 200 10 L 210 0 L 384 0 A 16 16 0 0 1 400 16 L 400 184 A 16 16 0 0 1 384 200 L 210 200 L 200 190 L 190 200 L 16 200 A 16 16 0 0 1 0 184 L 0 16 A 16 16 0 0 1 16 0 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <p className="relative text-gray-300 font-body text-xl z-10">{goal}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Опыт работы */}
    <div className="container mx-auto px-4 mt-20 max-w-4xl">
      <motion.h2
        className="font-heading text-3xl md:text-5xl text-center mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <span className="text-accent">О</span>пыт работы: <span className="text-accent font-semibold">5 лет</span>
      </motion.h2>

      <motion.p
        className="text-gray-300 text-center text-2xl md:text-3xl max-w-3xl mx-auto mb-16 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Я профессиональный психолог-консультант с пятилетним стажем.
      </motion.p>
    </div>

    {/* Галерея дипломов */}
    <div className="container mx-auto px-4 mt-16 max-w-5xl">
      <motion.h2
        className="font-heading text-3xl md:text-5xl text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <span className="text-accent">Д</span>ипломы
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {diplomas.map((src, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-xl border-[1px] border-gray-700 hover:border-accent transition-all cursor-pointer p-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.05,
              borderColor: '#FF3C3C',
              boxShadow: '0 0 10px rgba(255,60,60,0.3)',
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            onClick={() => { setCurrentIndex(index); setIsOpen(true); }}
          >
            <Image
              src={src}
              alt={`Диплом ${index + 1}`}
              width={300}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-white text-3xl font-bold z-50"
            >
              ×
            </button>

            <motion.div
              className="relative max-w-3xl max-h-[90vh] flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Image
                src={diplomas[currentIndex]}
                alt={`Диплом ${currentIndex + 1}`}
                width={600}
                height={800}
                className="rounded-lg object-contain"
              />

              {/* Навигация */}
              <button
                onClick={() => setCurrentIndex((currentIndex - 1 + diplomas.length) % diplomas.length)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-4 py-2"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentIndex((currentIndex + 1) % diplomas.length)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-4 py-2"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Предложения */}
    <div>
      <motion.h2
        className="font-heading text-3xl md:text-5xl text-center mb-10 mt-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <span className="text-accent">Ч</span>то я могу предложить
      </motion.h2>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {[
          "Индивидуальная консультация по вопросам личностного роста.",
          "Психологическая поддержка в сложных ситуациях.",
          "Эффективные методики коррекции.",
        ].map((item, index) => (
          <motion.div
            key={index}
            className="relative group bg-dark-glass p-6 overflow-hidden rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <svg
              className="absolute inset-0 w-full h-full text-gray-800 opacity-90 group-hover:text-accent transition-all duration-300 pointer-events-none"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 16 0 L 190 0 L 200 10 L 210 0 L 384 0 A 16 16 0 0 1 400 16 L 400 184 A 16 16 0 0 1 384 200 L 210 200 L 200 190 L 190 200 L 16 200 A 16 16 0 0 1 0 184 L 0 16 A 16 16 0 0 1 16 0 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <p className="relative text-gray-300 font-body text-lg z-10">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Заключение */}
    <motion.p
      className="text-gray-300 text-center text-2xl md:text-3xl max-w-3xl mx-auto mb-16 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      Моя работа основана на глубоком понимании человеческой природы.
    </motion.p>

    {/* Контакты */}
    <motion.h2
      className="font-heading text-3xl md:text-5xl text-center mb-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <span className="text-accent font-semibold">С</span>вяжитесь со мной уже сегодня
    </motion.h2>

    <motion.p
      className="text-center text-2xl font-semibold mb-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <a
        href="tel:+79831465722"
        className="text-accent hover:text-white transition"
      >
        +7 (983) 146-57-22
      </a>
    </motion.p>

    <motion.p
      className="text-gray-300 text-center mb-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <a
        href="mailto:denis.gorbunov@example.com"
        className="text-accent hover:text-white transition"
      >
        denis.gorbunov@example.com
      </a>
    </motion.p>

    <motion.p
      className="text-gray-400 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Онлайн или лично — в Красноярском крае.
    </motion.p>

    {/* Декоративный элемент */}
    <motion.div
      className="absolute -left-20 top-1/2 opacity-20"
      animate={{ opacity: [0.2, 0.1, 0.2], scale: [1, 0.98, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <Image src="/assets/glass1.svg" width={200} height={400} alt="" />
    </motion.div>
  </section>
);
}
