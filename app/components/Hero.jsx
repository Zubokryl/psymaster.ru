"use client";
import { useState, useRef, useEffect } from "react";
import "./hero.css";

const DENIS_PHONE_NUMBER = "+79831465722";

export default function Hero() {
  const videoRef = useRef(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

    const handleCall = () => {
     window.location.href = `tel:${DENIS_PHONE_NUMBER}`;
  };

  // Обработчик первого клика/касания пользователя
  const handleUserGesture = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;        // снимаем mute на DOM
      setIsMuted(false);          // обновляем UI
      video.play().catch(() => {}); // запускаем воспроизведение
    }
  };

  useEffect(() => {
    const onFirstClick = () => {
      handleUserGesture();
      document.removeEventListener("pointerdown", onFirstClick);
    };
    document.addEventListener("pointerdown", onFirstClick);
    return () => document.removeEventListener("pointerdown", onFirstClick);
  }, []);

  // Кнопка для переключения mute/unmute после первого клика
   const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  // Показ фото после окончания видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setTimeout(() => setShowPhoto(true), 500); 
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <section className="hero-section">
      
      <div className="tv-wrapper">
  {!showPhoto ? (
    <>
      <div className="tv-screen" />
      <div className="tv-container">
        <canvas id="canvas"></canvas>
        <video
          ref={videoRef}
          className="tv-video"
          src="/assets/video.mp4"
          playsInline
          autoPlay
          muted
        />
      </div>

      {/* Кнопка внутри tv-wrapper */}
      <button
        className="mute-button-outside"
        aria-label={isMuted ? "Включить звук" : "Выключить звук"}
        onClick={toggleMute}
        type="button"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </>
  ) : (
    <div className="photo-frame animate-cinematicFade">
      <img
        src="/assets/Denis.png"
        alt="Денис"
        width={520}
        height={640}
        style={{ objectFit: "cover" }}
      />
    </div>
  )}
</div>



      <div className="text-block">
        <h1 className="font-moniqa">
        <span className="text-accent">Д</span>енис <span className="text-accent">Г</span>орбунов
        </h1>


        <p className="subtitle">
          Психолог, который помогает выбраться из алкогольной зависимости.
        </p>
        <p className="desc">Без осуждения. Без иллюзий. С результатом.</p>
        <button 
          className="cta-button" 
          onClick={handleCall} 
          type="button"
          aria-label="Позвонить Денису для записи на консультацию"
        >
          Позвонить сейчас
        </button>
      </div>
    </section>
  );
}

