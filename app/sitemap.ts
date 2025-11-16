// app/sitemap.ts
import { MetadataRoute } from "next";
import { supabaseAdmin } from "./lib/supabase-admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = "https://psymaster-ru.vercel.app";

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${domain}/`, lastModified: now },
    { url: `${domain}/articles`, lastModified: now },
    { url: `${domain}/reviews`, lastModified: now },
    { url: `${domain}/chat`, lastModified: now },
  ];

  // ------ ARTICLES ------
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  const articleUrls =
    articles?.map((a: any) => ({
      url: `${domain}/articles/${a.id}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : now,
    })) ?? [];

  // ------ REVIEWS ------
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  const reviewUrls =
    reviews?.map((r: any) => ({
      url: `${domain}/reviews/${r.id}`,
      lastModified: r.updated_at ? new Date(r.updated_at) : now,
    })) ?? [];

  return [...staticUrls, ...articleUrls, ...reviewUrls];
}
