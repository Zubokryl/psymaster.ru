// app/components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <header className="bg-black py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Психолог Денис
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className={pathname === '/' ? 'text-blue-400' : 'hover:text-gray-300'}>
            Главная
          </Link>
          <Link href="/articles" className={pathname === '/articles' ? 'text-blue-400' : 'hover:text-gray-300'}>
            Статьи
          </Link>
          {user ? (
            <>
              <Link href="/chat" className={pathname === '/chat' ? 'text-blue-400' : 'hover:text-gray-300'}>
                Чат
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
