import Header from "@/components/Homepage/Header";
import Hero from "@/components/Homepage/Hero";


export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <Header />
      <Hero />
    </main>
  );
}
