"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const isAdmin = user?.user_metadata?.role === "admin";


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/"; 
  };

  const links = [
    { name: "Главная", href: "/" },
    { name: "Мои статьи", href: "/articles" },
    { name: "Отзывы", href: "/reviews" },
    { name: "Чат", href: "/chat" },
  ];

  if (isAdmin) links.push({ name: "Создать статью", href: "/admin/articles" });

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center p-4 relative">
        {/* Мобильный бургер */}
        <div className="md:hidden absolute left-4 top-4 z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl">
            <span className={isOpen ? "text-accent" : "text-white"}>●</span>
          </button>
        </div>

        {/* Меню для десктопа */}
        <ul className="hidden md:flex mx-auto space-x-8 text-white font-medium">
          {links.map(link => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`${pathname === link.href ? "text-accent" : "hover:text-accent"}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

    
        {isAdmin ? (
          <button
            onClick={logout}
            className="hidden md:inline-block bg-red-700/80 px-4 py-2 rounded hover:bg-red-600 transition absolute right-4"
          >
            Выйти (админ)
          </button>
        ) : (
          <Link
            href="/admin/login"
            className="hidden md:inline-block bg-[#1e2a5c] px-4 py-2 rounded hover:bg-[#16204a] text-white font-medium absolute right-4"
          >
            Войти (админ)
          </Link>
        )}

        {/* Мобильное меню */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-4 z-40">
            <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 shadow-lg min-w-[150px] max-w-xs">
              <ul className="flex flex-col space-y-2 text-white">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`${pathname === link.href ? "text-accent" : "hover:text-accent"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  {isAdmin ? (
                    <button
                      onClick={logout}
                      className="w-full text-left py-2 px-3 bg-red-700/80 rounded hover:bg-red-600 transition"
                    >
                      Выйти (админ)
                    </button>
                  ) : (
                    <Link
                      href="/admin/login"
                      className="w-full block py-2 px-3 bg-[#1e2a5c] rounded hover:bg-[#16204a] text-white font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Войти (админ)
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
