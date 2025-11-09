"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Главная", href: "/" },
    { name: "Мои статьи", href: "/articles" },
    { name: "Отзывы", href: "/reviews" },
    { name: "Чат", href: "/chat" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50 transition-all duration-300">
      <div className="container mx-auto flex justify-center p-4">
        <nav className="flex-1 flex justify-center md:justify-center">
          <ul className="hidden md:flex space-x-8 text-white font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-accent" : "hover:text-accent"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Мобильное меню */}
          <div className="md:hidden absolute left-4 top-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark-glass/50 text-white px-6 py-4 shadow-md absolute top-full left-0 w-full">
          <ul className="flex flex-col space-y-3 text-left">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`transition-colors duration-300 text-lg ${
                      isActive ? "text-accent" : "hover:text-accent"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

