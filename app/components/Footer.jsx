// app/components/Footer.jsx
"use client";

import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full py-4 text-white text-center backdrop-blur-md bg-black/10 transition-colors duration-300 hover:bg-black/20"
      style={{ fontSize: "clamp(0.75rem, 1.5vw, 1rem)" }}
    >
      Made by{" "}
      <a
        href="https://t.me/yourscamproof"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500 hover:underline transition-colors duration-300"
      >
        Zubokryl
      </a>
    </footer>
  );
}
