import EgnaStickers from "@/components/Homepage/EgnaStickers";
import GuideSection from "@/components/Homepage/GuideSection";
import Header from "@/components/Homepage/Header";
import Hero from "@/components/Homepage/Hero";
import SliderSection from "@/components/Homepage/SliderSection";


export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <Header />
      <Hero />
      <SliderSection />
      <EgnaStickers />
      <GuideSection />
    </main>
  );
}
