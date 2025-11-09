import Header from "./components/Header";
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";


export const metadata = {
  title: "Денис — помощь при алкогольной зависимости",
  description: "Психолог Денис. Помощь при алкогольной зависимости. Консультации онлайн и очно.",
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



