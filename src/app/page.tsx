import EgnaStickers from "@/components/Homepage/EgnaStickers";
import GuideSection from "@/components/Homepage/GuideSection";
import Header from "@/components/Homepage/Header";
import Hero from "@/components/Homepage/Hero";


export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <Header />
      <Hero />
      <EgnaStickers />
      <GuideSection />
    </main>
  );
}
