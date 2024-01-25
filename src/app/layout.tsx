import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const inter = Red_Hat_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sticker Online App",
  description: "Du designar, vi trycker och skickar dina stickers på nolltid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + ' font-normal text-[15px] text-so-black antialiased'}>{children}</body>
    </html>
  );
}
