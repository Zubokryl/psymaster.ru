import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "./components/Header";
import "./globals.css";

import { Bebas_Neue, Inter } from 'next/font/google';

// Подключаем Google шрифты
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Денис — помощь при алкогольной зависимости",
  description: "Психолог Денис. Помощь при алкогольной зависимости. Консультации онлайн и очно.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-[#0b0b0b] text-white font-body antialiased">
         <Header />
        {children}
      </body>
    </html>
  );
}

