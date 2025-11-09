"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    media_url: "",
    media_type: "image",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) router.push("/admin/login");
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return alert("Заполни заголовок и контент!");

    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;

    const res = await fetch("/api/articles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (result.error) alert(result.error);
    else {
      alert(editingId ? "Статья обновлена!" : "Статья добавлена!");
      setForm({ title: "", content: "", media_url: "", media_type: "image" });
      setEditingId(null);
      fetchArticles();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Удалить статью?")) return;
    const res = await fetch("/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    if (result.error) alert(result.error);
    else fetchArticles();
  };

  const handleEdit = (article) => {
    setForm(article);
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        media_url: reader.result,
        media_type: file.type.startsWith("video") ? "video" : "image",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-[url('/assets/decorative-background-with-smoke.jpg')] bg-cover bg-fixed bg-center text-white font-sans">
      <div className="max-w-4xl mx-auto bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-xl shadow-black/40">
        <h1 className="text-4xl mb-8 font-bold text-center drop-shadow-lg flex items-center justify-center gap-2">
          <Image src="/assets/headers.png" alt="Header" width={36} height={36} />
          Админ-панель: статьи
        </h1>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <input
            type="text"
            placeholder="Заголовок статьи"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/60 outline-none transition"
          />

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
            className="bg-gray-900/70 text-white rounded-lg"
          />

          <div className="flex flex-col md:flex-row gap-4">
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
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 text-lg rounded-lg font-semibold bg-gradient-to-r from-[#ab1313] to-[#750404] shadow-lg shadow-black/30 hover:scale-[1.02] transition"
          >
            <Image
              src={editingId ? "/assets/save.png" : "/assets/add.png"}
              alt="icon"
              width={24}
              height={24}
            />
            {editingId ? "Сохранить" : "Добавить"}
          </button>
        </form>

        {/* Список статей */}
        <h2 className="text-3xl mb-6 text-center font-semibold flex items-center justify-center gap-2">
          <Image src="/assets/headers.png" alt="Articles" width={50} height={50} />
          Опубликованные статьи
        </h2>

        <div className="space-y-6">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-gray-900/70 border border-gray-800 p-6 rounded-xl shadow-lg shadow-black/40"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">{a.title}</h3>

              {a.content && (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {a.content}
                </ReactMarkdown>
              )}

              {a.media_url &&
                (a.media_type === "image" ? (
                  <img
                    src={a.media_url}
                    alt={a.title}
                    className="mt-2 rounded-lg w-3/4 border border-gray-700"
                  />
                ) : (
                  <video
                    src={a.media_url}
                    controls
                    className="mt-2 rounded-lg w-3/4 border border-gray-700"
                  />
                ))}

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEdit(a)}
                  className="bg-blue-700/80 px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="bg-red-700/80 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <p className="text-center text-gray-400 italic">Пока нет статей...</p>
          )}
        </div>
      </div>
    </div>
  );
}
