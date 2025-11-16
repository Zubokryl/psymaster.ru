import { MetadataRoute } from "next";
import { supabaseAdmin } from "./lib/supabase-admin";

type Article = { id: string; updated_at?: string | null };
type Review = { id: number; updated_at?: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: "/", lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: "/articles", lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: "/reviews", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "/chat", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  let articleUrls: MetadataRoute.Sitemap = [];
  let reviewUrls: MetadataRoute.Sitemap = [];

  // ---------------------------
  // ARTICLES
  // ---------------------------
  try {
    const { data } = await supabaseAdmin
      .from("articles")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    const articles = (data ?? []) as Article[];

    articleUrls = articles.map((article) => ({
      url: `/articles/${article.id}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Ошибка статьи sitemap:", err);
  }

  // ---------------------------
  // REVIEWS
  // ---------------------------
  try {
    const { data } = await supabaseAdmin
      .from("reviews")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    const reviews = (data ?? []) as Review[];

    reviewUrls = reviews.map((review) => ({
      url: `/reviews/${review.id}`,
      lastModified: review.updated_at ? new Date(review.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Ошибка отзывы sitemap:", err);
  }

  return [...staticUrls, ...articleUrls, ...reviewUrls];
}
