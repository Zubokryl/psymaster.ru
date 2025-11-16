"use client";

import React from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://psymaster.ru";

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
}

export default function SeoHead({
  title = "Психолог при алкогольной зависимости — помощь бросить пить онлайн и очно",
  description = "Профессиональная помощь при алкогольной зависимости. Психолог Денис помогает бросить пить без кодировки. Онлайн и очные консультации, поддержка созависимых, работа с рецидивами.",
  image = `${siteUrl}/assets/og-image.jpg`,
  url = siteUrl,
  keywords = [
    "психолог",
    "алкогольная зависимость",
    "как бросить пить",
    "психолог онлайн",
    "созависимость",
    "помощь алкоголикам",
  ],
}: SeoHeadProps) {
  return (
    <>
      {/* Основные мета */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="yandex-verification" content="9fba2b712663d6ad" />
      <meta name="yandex" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="shortcut icon" href="/assets/favicon.svg" type="image/svg+xml" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48x48.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png" />

      {/* Apple и PWA */}
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
      <link rel="manifest" href="/assets/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
}

