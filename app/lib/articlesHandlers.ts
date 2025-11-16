// lib/articlesHandlers.ts
import { mutate } from "swr";
import type { Article } from "../types";
import { useRouter } from "next/navigation";

export const handleEdit = (router: ReturnType<typeof useRouter>, article: Article) => {
  router.push(`/admin/articles?id=${article.id}`);
};

export const handleDelete = async (articles: Article[], id: string) => {
  if (!confirm("Вы уверены, что хотите удалить статью?")) return;
  try {
    const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Ошибка при удалении");
    mutate(
      "/api/articles",
      articles.filter((a) => a.id !== id),
      false
    );
    alert("Статья удалена");
  } catch (err) {
    console.error(err);
    alert("Ошибка при удалении статьи");
  }
};
