"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Если уже залогинен — сразу редирект
    if (localStorage.getItem("adminLoggedIn") === "true") {
      router.push("/admin/articles");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin/articles");
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg space-y-4 w-96">
        <h1 className="text-2xl font-bold text-center">Вход для админа</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
        <button type="submit" className="w-full py-2 bg-red-700 rounded hover:bg-red-600 transition">
          Войти
        </button>
      </form>
    </div>
  );
}
