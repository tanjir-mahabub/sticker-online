import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const RedHatDisplay = Red_Hat_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
});

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
      <body className={RedHatDisplay.className + ' font-normal text-[15px] text-so-black antialiased'}>{children}</body>
    </html>
  );
}
