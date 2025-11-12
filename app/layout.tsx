import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";
import { Inter } from "next/font/google";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Помощь при алкогольной зависимости",
  description:
    "Психолог Денис. Консультации онлайн и очно.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={` ${inter.variable}`}>
      <body className="bg-[#0b0b0b] text-white font-body antialiased">
          <Header />
          {children}
      </body>
    </html>
  );
}

