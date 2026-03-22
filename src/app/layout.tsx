import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scoop — The Flavor Sommelier",
  description: "Discover your perfect artisanal ice cream pairing, guided by an AI Sommelier.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
