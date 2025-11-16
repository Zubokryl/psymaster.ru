// app/page.tsx
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";

export const metadata = {
  title: "Психолог при алкогольной зависимости. Помощь бросить пить онлайн и очно",
  description:
    "Профессиональная помощь при алкогольной зависимости. Психолог Денис Горбунов помогает бросить пить без кодировки. Онлайн и очные консультации, поддержка созависимых, работа с рецидивами. Конфиденциально.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Hero />
      <HelpSection />
    </main>
  );
}
