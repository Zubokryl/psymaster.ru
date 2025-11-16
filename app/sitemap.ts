// app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabaseServer } from './lib/supabase-server';

type Article = {
  id: string;
  title: string;
  content: string;
  media_url?: string;
  media_type?: "image" | "video";
  updated_at?: string | null;
};

type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar?: string;
  screenshot?: string;
  updated_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Статические URL
  const staticUrls: MetadataRoute.Sitemap = [
    { url: '/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: '/articles', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: '/reviews', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: '/chat', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 2. Динамические статьи
  const { data: articles, error: articleError } = await supabaseServer
    .from<Article>('articles')
    .select('id, updated_at')
    .order('updated_at', { ascending: false });

  if (articleError) console.error('Ошибка при получении статей для sitemap:', articleError);

  const articleUrls: MetadataRoute.Sitemap = articles?.map((article: Article) => ({
    url: `/articles/${article.id}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || [];

  // 3. Динамические отзывы
  const { data: reviews, error: reviewError } = await supabaseServer
    .from<Review>('reviews')
    .select('id, updated_at')
    .order('updated_at', { ascending: false });

  if (reviewError) console.error('Ошибка при получении отзывов для sitemap:', reviewError);

  const reviewUrls: MetadataRoute.Sitemap = reviews?.map((review: Review) => ({
    url: `/reviews/${review.id}`,
    lastModified: review.updated_at ? new Date(review.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  })) || [];

  return [...staticUrls, ...articleUrls, ...reviewUrls];
}
