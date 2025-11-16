// app/layout.tsx
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Психолог при алкогольной зависимости. Помощь бросить пить онлайн и очно.",
  description:
    "Профессиональная помощь при алкогольной зависимости. Психолог Денис помогает бросить пить без кодировки. Онлайн и очные консультации, поддержка созависимых, работа с рецидивами. Конфиденциально.",
  alternates: {
    canonical: "https://psymaster-ru.vercel.app/",
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable}`}>
      <head>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Денис Горбунов",
      "jobTitle": "Психолог-консультант по алкогольной зависимости",
      "image": "https://psymaster-ru.vercel.app/assets/Denis.png",
      "url": "https://psymaster-ru.vercel.app/",
      "email": "denis.gorbunov@example.com",
      "telephone": "+7 (983) 146-57-22",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Красноярский край",
        "addressCountry": "RU"
      },
      "description": "Психолог Денис Горбунов. Профессиональная помощь при алкогольной зависимости. Онлайн и очные консультации. Поддержка родственников, работа с рецидивами, помощь при созависимости. Индивидуальные консультации по личностному росту, семейным отношениям и профессиональной самореализации.",
      "knowsAbout": [
        "Алкогольная зависимость",
        "Созависимость",
        "Профилактика рецидивов",
        "Психологическая поддержка",
        "Стресс",
        "Семейные конфликты",
        "Мотивация",
        "Личностный рост"
      ],
      "makesOffer": [
        {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": "0",
          "itemOffered": {
            "@type": "Service",
            "name": "Первая консультация",
            "description": "Бесплатная ознакомительная консультация психолога.",
            "serviceType": "Психологическая консультация",
            "areaServed": { "@type": "Country", "name": "Россия" },
            "availableChannel": [
              { "@type": "ServiceChannel", "serviceMode": "InPerson" },
              { "@type": "ServiceChannel", "serviceMode": "Online" }
            ]
          }
        },
        {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": "3000",
          "itemOffered": {
            "@type": "Service",
            "name": "Индивидуальная консультация по вопросам личностного роста, семейных отношений, профессиональной самореализации",
            "description": "Помощь в развитии личности, разрешении семейных конфликтов и карьерной самореализации.",
            "serviceType": "Психологическая консультация",
            "areaServed": { "@type": "Country", "name": "Россия" },
            "availableChannel": [
              { "@type": "ServiceChannel", "serviceMode": "InPerson" },
              { "@type": "ServiceChannel", "serviceMode": "Online" }
            ]
          }
        },
        {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": "3000",
          "itemOffered": {
            "@type": "Service",
            "name": "Психологическая поддержка в сложных жизненных ситуациях",
            "description": "Сопровождение при кризисах, стрессах и трудных периодах жизни.",
            "serviceType": "Психологическая консультация",
            "areaServed": { "@type": "Country", "name": "Россия" },
            "availableChannel": [
              { "@type": "ServiceChannel", "serviceMode": "InPerson" },
              { "@type": "ServiceChannel", "serviceMode": "Online" }
            ]
          }
        },
        {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": "3000",
          "itemOffered": {
            "@type": "Service",
            "name": "Эффективные методики психологической коррекции и консультирования",
            "description": "Применение научно обоснованных техник для решения психологических проблем.",
            "serviceType": "Психологическая коррекция",
            "areaServed": { "@type": "Country", "name": "Россия" },
            "availableChannel": [
              { "@type": "ServiceChannel", "serviceMode": "InPerson" },
              { "@type": "ServiceChannel", "serviceMode": "Online" }
            ]
          }
        }
      ],
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "Diploma", "educationalLevel": "Психологическое образование", "image": "https://psymaster-ru.vercel.app/assets/diploma1.jpg", "description": "Диплом 1" },
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "Diploma", "educationalLevel": "Психологическое образование", "image": "https://psymaster-ru.vercel.app/assets/diploma2.jpg", "description": "Диплом 2" },
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "Diploma", "educationalLevel": "Психологическое образование", "image": "https://psymaster-ru.vercel.app/assets/diploma3.jpg", "description": "Диплом 3" },
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "Diploma", "educationalLevel": "Психологическое образование", "image": "https://psymaster-ru.vercel.app/assets/diploma4.jpg", "description": "Диплом 4" }
      ],
      "affiliation": {
        "@type": "ProfessionalService",
        "name": "Кабинет психологической помощи",
        "priceRange": "0-3000 RUB",
        "serviceType": "Психологическая консультация",
        "areaServed": "Россия"
      },
      "experience": {
        "@type": "ProfessionalExperience",
        "yearsOfExperience": 5,
        "description": "Профессиональный психолог-консультант с пятилетним стажем."
      }
              
            })
          }}
        />
      </head>

      <body className="flex flex-col min-h-screen text-white font-body antialiased bg-[#0b0b0b]">
        <Header />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
