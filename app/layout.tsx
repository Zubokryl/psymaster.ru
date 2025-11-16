// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import SeoHead from "./components/SeoHead";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// -----------------------------------------------------------
// Автоматический домен из ENV
// -----------------------------------------------------------
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "Психолог при алкогольной зависимости — помощь бросить пить онлайн и очно",
  description:
    "Профессиональная помощь при алкогольной зависимости. Психолог Денис помогает бросить пить без кодировки. Онлайн и очные консультации, поддержка созависимых, работа с рецидивами.",
  keywords: [
    "психолог",
    "алкогольная зависимость",
    "как бросить пить",
    "психолог онлайн",
    "созависимость",
    "помощь алкоголикам",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Психолог Денис Горбунов — помощь при алкогольной зависимости",
    description:
      "Помощь бросить пить онлайн и очно. Поддержка созависимых. Психотерапия и консультации.",
    siteName: "Психолог Денис Горбунов",
    images: [
      {
        url: `${siteUrl}/assets/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Психологическая помощь при зависимости",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Психолог Денис Горбунов — помощь при алкогольной зависимости",
    description:
      "Онлайн и очная помощь бросить пить. Поддержка родственников, работа с рецидивами.",
    images: [`${siteUrl}/assets/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Используем компонент SeoHead */}
        <SeoHead />
      </head>
      <body className="flex flex-col min-h-screen text-white font-body antialiased bg-[#0b0b0b]">
        <Header />
        <main className="flex-1 relative">{children}</main>
        <Footer />

        {/* ======================================================
           JSON-LD СХЕМЫ — МАКСИМАЛЬНОЕ SEO
           ====================================================== */}

        {/* Person */}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Денис Горбунов",
              jobTitle: "Психолог-консультант по зависимостям",
              image: `${siteUrl}/assets/Denis.png`,
              url: siteUrl,
              telephone: "+79831465722",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Красноярский край",
                addressCountry: "RU",
              },
              sameAs: [
                "https://t.me/psymaster",
                "https://wa.me/79831465722",
              ],
            }),
          }}
        />

        {/* ProfessionalService */}
        <Script
          id="schema-professional-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Психологическая помощь при зависимости",
              provider: {
                "@type": "Person",
                name: "Денис Горбунов",
              },
              areaServed: "Россия",
              availableChannel: [
                { "@type": "ServiceChannel", serviceMode: "Online" },
                { "@type": "ServiceChannel", serviceMode: "InPerson" },
              ],
            }),
          }}
        />

        {/* LocalBusiness */}
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Кабинет психолога — Денис Горбунов",
              image: `${siteUrl}/assets/Denis.png`,
              telephone: "+79831465722",
              priceRange: "0-3000 RUB",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Красноярский край",
                addressCountry: "RU",
              },
            }),
          }}
        />

        {/* Offers */}
        <Script
          id="schema-offers"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Консультации психолога",
              offers: [
                {
                  "@type": "Offer",
                  priceCurrency: "RUB",
                  price: "0",
                  description: "Первая ознакомительная консультация",
                },
                {
                  "@type": "Offer",
                  priceCurrency: "RUB",
                  price: "3000",
                  description: "Индивидуальная консультация",
                },
                {
                  "@type": "Offer",
                  priceCurrency: "RUB",
                  price: "3000",
                  description:
                    "Психологическая поддержка и работа со стрессом и рецидивами",
                },
              ],
            }),
          }}
        />

        {/* FAQ */}
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Поможет ли психолог бросить пить?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Да. Методики помогают укрепить мотивацию, предотвратить рецидивы и изменить зависимое поведение.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Есть ли первая бесплатная консультация?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да, первая консультация — бесплатная.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Breadcrumbs */}
        <Script
          id="schema-breadcrumbs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Главная",
                  item: siteUrl,
                },
              ],
            }),
          }}
        />

        {/* Organization */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Психолог Денис Горбунов",
              url: siteUrl,
              logo: `${siteUrl}/assets/Denis.png`,
            }),
          }}
        />


      </body>
    </html>
  );
}
