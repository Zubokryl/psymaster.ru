"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/app/lib/supabaseClient";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminArticleEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams ? searchParams.get("id") : null;

  const [form, setForm] = useState({
    title: "",
    content: "",
    media_url: "",
    media_type: "image",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Проверка админа
  useEffect(() => {
  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.role !== "admin") {
      router.push("/admin/login");
    }
  };

  checkAdmin();
}, []);

  // При наличии id — подгружаем статью
  useEffect(() => {
    if (articleId) fetchArticle(articleId);
  }, [articleId]);

  async function fetchArticle(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?id=${id}`);
      const data = await res.json();
      if (data && !data.error) {
        // подстраховка: некоторые поля могут быть undefined
        setForm({
          title: data.title ?? "",
          content: data.content ?? "",
          media_url: data.media_url ?? "",
          media_type: data.media_type ?? "image",
        });
      } else {
        console.error("Ошибка загрузки статьи:", data?.error || "no-data");
        alert("Не удалось загрузить статью.");
      }
    } catch (err) {
      console.error("Ошибка загрузки статьи:", err);
      alert("Ошибка при загрузке статьи.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        media_url: reader.result,
        media_type: file.type.startsWith("video") ? "video" : "image",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // защита: только админ может отправлять
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      alert("Доступ только для админа.");
      router.push("/admin/login");
      return;
    }

    if (!form.title || !form.content) {
      alert("Пожалуйста, заполните заголовок и контент.");
      return;
    }

    setSaving(true);
    try {
      const method = articleId ? "PUT" : "POST";
      // если есть articleId — приводим к числу, если нужно
      const body = articleId ? { id: articleId, ...form } : form;

      const res = await fetch("/api/articles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (result?.error) {
        console.error("API error:", result.error);
        alert("Ошибка от API: " + result.error);
      } else {
        alert(articleId ? "Статья обновлена!" : "Статья добавлена!");
        // после сохранения — редирект на страницу со списком статей (или на /admin)
        router.push("/articles"); // показываем пользователям список статей
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      alert("Ошибка при сохранении статьи.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-[url('/assets/decorative-background-with-smoke.jpg')] bg-cover bg-fixed bg-center text-white font-sans">
      <div className="max-w-4xl mx-auto bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-xl shadow-black/40">
        <h1 className="text-4xl mb-8 font-bold text-center drop-shadow-lg flex items-center justify-center gap-2">
          {articleId ? "Редактирование статьи" : "Новая статья"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          {/* Заголовок */}
          <input
            type="text"
            placeholder="Заголовок статьи"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/60 outline-none transition"
          />

          {/* Контент — ReactQuill */}
          <div className="bg-gray-900/70 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              className="min-h-[200px] text-white"
            />
          </div>

          {/* Медиа: URL и файл (file -> data URL) */}
<div className="flex flex-col md:flex-row gap-4 items-start">
  <input
    type="text"
    placeholder="URL картинки или видео"
    value={form.media_url}
    onChange={(e) => setForm({ ...form, media_url: e.target.value })}
    className="flex-1 p-3 rounded-lg bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/60 outline-none transition"
  />

  <input
    type="file"
    accept="image/*,video/*"
    onChange={handleFileUpload}
    className="flex-1 p-3 rounded-lg bg-gray-900/70 text-white border border-gray-700 cursor-pointer transition"
  />

  <select
    value={form.media_type}
    onChange={(e) => setForm({ ...form, media_type: e.target.value })}
    className="p-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white"
  >
    <option value="image">Изображение</option>
    <option value="video">Видео</option>
  </select>

  {/* Кнопка удалить медиа */}
  {form.media_url && (
    <button
      type="button"
      onClick={() => setForm({ ...form, media_url: "", media_type: "image" })}
      className="mt-2 md:mt-0 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition text-white"
    >
      Удалить фото/видео
    </button>
  )}
</div>


          {/* Кнопка Сохранить */}
          <button
            type="submit"
            disabled={saving || loading}
            className="w-full mt-2 py-3 text-lg rounded-lg font-semibold bg-gradient-to-r from-[#ab1313] to-[#750404] shadow-lg shadow-black/30 hover:scale-[1.02] transition flex justify-center items-center gap-2 disabled:opacity-60"
          >
            <Image
              src={articleId ? "/assets/save.png" : "/assets/add.png"}
              alt="icon"
              width={24}
              height={24}
            />
            {saving ? "Сохраняем..." : articleId ? "Сохранить изменения" : "Добавить статью"}
          </button>
        </form>
      </div>
    </div>
  );
}
