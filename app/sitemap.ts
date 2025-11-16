// app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabaseServer } from './lib/supabase-server';

type Article = {
  id: string;
  updated_at?: string | null;
};

type Review = {
  id: number;
  updated_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: '/', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: '/articles', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: '/reviews', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: '/chat', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  let articleUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabaseServer
      .from<Article>('articles')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    if (Array.isArray(articles)) {
      articleUrls = articles.map((article: Article) => ({
        url: `/articles/${article.id}`,
        lastModified: article.updated_at ? new Date(article.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Ошибка при получении статей для sitemap:', err);
    // не бросаем ошибку, чтобы сборка не падала
  }

  let reviewUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: reviews } = await supabaseServer
      .from<Review>('reviews')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    if (Array.isArray(reviews)) {
      reviewUrls = reviews.map((review: Review) => ({
        url: `/reviews/${review.id}`,
        lastModified: review.updated_at ? new Date(review.updated_at) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error('Ошибка при получении отзывов для sitemap:', err);
  }

  return [...staticUrls, ...articleUrls, ...reviewUrls];
}
