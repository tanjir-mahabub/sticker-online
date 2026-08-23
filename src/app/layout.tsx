import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import "./studio.css";
import ReduxProvider from "@/redux/Provider";

const RedHatDisplay = Red_Hat_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Stickora Studio — Browser Sticker Design Engine",
  description: "A production-minded sticker design studio built with Next.js, TypeScript, Fabric.js, and robust canvas interactions.",
  keywords: ["sticker editor", "Fabric.js", "Next.js", "creative tooling", "canvas editor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={RedHatDisplay.className + ' font-normal text-[15px] bg-[#fafafa] text-so-black scroll-smooth overflow-x-hidden antialiased'}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
