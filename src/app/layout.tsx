import type { Metadata } from "next";
import {
  BBH_Bartle,
  Boldonse,
  Outfit,
} from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutShell";

const boldonse = Boldonse({
  weight: "400",
  variable: "--font-boldonse",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const bartie = BBH_Bartle({
  variable: "--font-bartie",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rezenate",
  description: "Rezenate | Lead The Way",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${boldonse.variable} ${outfit.variable} ${bartie.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main>
          <LayoutWrapper>{children}</LayoutWrapper>
        </main>
      </body>
    </html>
  );
}