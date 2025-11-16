import { MetadataRoute } from "next";
import { supabaseAdmin } from "./lib/supabase-admin";

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

  // ARTICLES
  try {
    const { data: articles, error: articleErr } = await supabaseAdmin
      .from("articles")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    if (articleErr) throw articleErr;

    articleUrls =
      articles?.map((a) => ({
        url: `/articles/${a.id}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })) ?? [];
  } catch (err) {
    console.error("Ошибка загрузки статей sitemap:", err);
  }

  // REVIEWS
  try {
    const { data: reviews, error: reviewErr } = await supabaseAdmin
      .from("reviews")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    if (reviewErr) throw reviewErr;

    reviewUrls =
      reviews?.map((r) => ({
        url: `/reviews/${r.id}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      })) ?? [];
  } catch (err) {
    console.error("Ошибка загрузки отзывов sitemap:", err);
  }

  return [...staticUrls, ...articleUrls, ...reviewUrls];
}



