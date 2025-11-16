"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.user_metadata?.role === "admin";


  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };


  const links = [
    { name: "Главная", href: "/" },
    { name: "Мои статьи", href: "/articles" },
    { name: "Отзывы", href: "/reviews" },
    { name: "Чат", href: "/chat" },
  ];

  if (isAdmin) links.push({ name: "Создать статью", href: "/admin/articles" });

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent md:backdrop-blur-md z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center p-4 relative">

        {/* Бургер */}
        <div className="md:hidden absolute left-4 top-4 z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl">
            <span className={isOpen ? "text-accent" : "text-white"}>●</span>
          </button>
        </div>

        {/* Десктоп меню */}
        <ul className="hidden md:flex mx-auto space-x-8 text-white font-medium pr-32">
  {links.map((link) => (
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


        {/* Правая кнопка */}
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
            className="hidden md:inline-block bg-[#1b234d] px-4 py-2 rounded hover:bg-[#161a3a] text-white font-medium transition absolute right-4"
          >
            Войти (админ)
          </Link>
        )}

        {/* Мобильное меню */}
{isOpen && (
  <div className="md:hidden fixed inset-0 z-40 flex justify-start items-start bg-[#111111] p-4">
    <div className="rounded-lg shadow-lg w-full max-w-xs">
      <ul className="flex flex-col space-y-2 text-white p-4 text-sm">
        {links.map((link) => (
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
              className="w-full text-left py-2 px-3 bg-red-700 rounded hover:bg-red-600 transition mt-2 text-sm"
            >
              Выйти (админ)
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="w-full block py-2 px-3 bg-[#1b234d] rounded hover:bg-[#161a3a] text-white font-medium mt-2 text-sm"
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
