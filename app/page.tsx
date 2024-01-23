import Image from "next/image";
import Header from "@/app/ui/Homepage/Header";
import Hero from "./ui/Homepage/Hero";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <Header />
      <Hero />
    </main>
  );
}
