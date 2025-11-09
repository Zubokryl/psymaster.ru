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
        <nav className="flex-1 flex justify-center md:justify-center relative">
          {/* Десктопное меню */}
          <ul className="hidden md:flex space-x-8 text-white font-medium">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`transition-colors duration-300 ${
                    pathname === link.href ? "text-accent" : "hover:text-accent"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Мобильный бургер — теперь просто точка */}
          <div className="md:hidden absolute left-4 top-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-3xl focus:outline-none"
            >
              <span
                className={`transition-colors duration-300 ${
                  isOpen ? "text-accent" : "text-white"
                }`}
              >
                ●
              </span>
            </button>
          </div>

          {/* Выпадающее меню */}
          {isOpen && (
            <div className="md:hidden absolute top-16 left-4 z-40">
              <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 shadow-lg inline-block min-w-[150px] max-w-xs">
                <ul className="flex flex-col space-y-2 text-white">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`block text-base sm:text-sm transition-colors duration-300 ${
                          pathname === link.href ? "text-accent" : "hover:text-accent"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}




