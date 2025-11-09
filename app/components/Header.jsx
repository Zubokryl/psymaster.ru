"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("adminLoggedIn") === "true");
  }, []);

  const links = [
    { name: "Главная", href: "/" },
    { name: "Мои статьи", href: "/articles" },
    { name: "Отзывы", href: "/reviews" },
    { name: "Чат", href: "/chat" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsAdmin(false);
    router.push("/admin/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center p-4 relative">
        {/* Мобильный бургер */}
        <div className="md:hidden absolute left-4 top-4 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-3xl focus:outline-none"
            aria-label="Открыть/закрыть меню"
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

        {/* Меню по центру для десктопа */}
        <ul className="hidden md:flex mx-auto space-x-8 text-white font-medium">
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

        {/* Кнопка входа/выхода для десктопа */}
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block bg-red-700/80 px-4 py-2 rounded hover:bg-red-600 transition absolute right-4"
          >
            Выйти (админ)
          </button>
        ) : (
          <Link
            href="/admin/login"
            className="hidden md:inline-block bg-[#1e2a5c] px-4 py-2 rounded hover:bg-[#16204a] transition text-white font-medium absolute right-4"
          >
            Вход для админа
          </Link>
        )}

        {/* Мобильное меню */}
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

                {/* Кнопка входа/выхода для мобильного меню */}
                <li>
                  {isAdmin ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3 bg-red-700/80 rounded hover:bg-red-600 transition"
                    >
                      Выйти (админ)
                    </button>
                  ) : (
                    <Link
                      href="/admin/login"
                      className="w-full block py-2 px-3 bg-[#1e2a5c] rounded hover:bg-[#16204a] transition text-white font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Вход для админа
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}



