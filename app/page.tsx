// app/page.tsx
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";

export const metadata = {
  title: "Помощь при алкогольной зависимости",
  description:
    "Коуч и психолог, специализирующийся на работе с людьми, пережившими зависимость. Консультации онлайн и очно.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Hero />
      <HelpSection />
    </main>
  );
}
