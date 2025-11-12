"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user?.user_metadata?.role === "admin") {
      router.push("/admin/articles"); // редирект админа в админку
    } else {
      setError("У вас нет прав администратора");
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg space-y-4 w-96">
        <h1 className="text-2xl font-bold text-center">Вход для администратора</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-red-700 rounded hover:bg-red-600 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

