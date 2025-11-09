"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import "./helpSection.css"; 

const DENIS_PHONE_NUMBER = "+79831465722";


const handleCall = () => {
  window.location.href = `tel:${DENIS_PHONE_NUMBER}`;
};

const situations = [
  "Теряешь контроль над употреблением.",
  "Пробовал \"просто перестать\" — не вышло.",
  "Родные устали, а ты — ещё больше.",
  "Кажется, выхода нет."
];

const goals = [
  "Реабилитироваться в современном мире",
  "Найти новый смысл",
  "Устроиться на работу",
  "Жить полноценной жизнью"
];

export default function HelpSection() {
  return (
    
    <section className="help-section relative py-24 bg-dark overflow-hidden">
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

              <p className="relative font-body text-xl text-gray-300 z-10">{situation}</p>

            </motion.div>
          ))}
        </div>
      </div>
      
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

              <p className="relative font-body text-xl text-gray-300 z-10">{goal}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* ------------------------------------------------------------- */}
      
<div className="container mx-auto px-4 mt-20 max-w-4xl">
  <motion.div 
    
    className="p-8 md:p-12 bg-dark-glass-strong rounded-[20px] shadow-2xl border border-accent/20"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    
    <motion.div 
        className="relative group bg-dark-glass p-6 overflow-hidden mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
    >
       
        <p className="relative text-3xl text-gray-300 text-center z-10">
    Работаю также в <span className="text-accent font-bold">бизнес</span> и <span className="text-accent font-bold">Life</span> направлениях.
</p>
    </motion.div>
    
    {/* ⭐ Вторая фраза: УТП с Moniqa (размер скорректирован) */}
    <p className="text-2xl text-white mb-8 text-center">
      Первая коуч-сессия у меня
      <motion.span 
        // ⭐ СКОРРЕКТИРОВАН РАЗМЕР: font-moniqa text-3xl
        className="text-accent text-3xl inline-block mx-2 uppercase" 
        
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        БЕСПЛАТНА!
      </motion.span>
    </p>
    
    <div className="text-center text-gray-400 mb-6">
      <p className="text-lg font-semibold">Записаться можно по телефону:</p>
      <p className="text-2xl mt-1 mb-4">
        <a href={`tel:${DENIS_PHONE_NUMBER}`} className="text-accent hover:text-red-500 transition duration-200">
          +7 (983) 146-57-22
        </a>
      </p>
      <p className="text-xl mt-3 text-white">Жду вас в Красноярском крае.</p>
    </div>
    
    <div className="flex flex-col items-center justify-center mt-8 pt-4 border-t border-gray-700/50">

      
    </div>
    
  </motion.div>
</div>



      {/* Decorative Elements */}
      <motion.div
  className="absolute -left-20 top-1/2 opacity-20"
  animate={{ opacity: [0.2, 0.1, 0.2], scale: [1, 0.98, 1] }}
  transition={{ duration: 4, repeat: Infinity }}
>
  <img src="/assets/glass1.svg" width={200} height={400} alt="Стакан" />
</motion.div>

    </section>

  );
}