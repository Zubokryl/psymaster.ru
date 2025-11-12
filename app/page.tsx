import Header from "./components/Header";
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";


export const metadata = {
  title: "Помощь при алкогольной зависимости",
  description: "Помощь при алкогольной зависимости. Консультации онлайн и очно. Психолог Денис Горбунов.",
};

export default function HomePage() {
  return (
    <>
      {/* Хедер будет фиксированным сверху */}
      <Header />

      <main className="min-h-screen bg-[#0b0b0b] text-white">
        <Hero />
        <HelpSection />
      </main>
    </>
  );
}



