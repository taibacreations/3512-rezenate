// src/app/layout.tsx
import type { Metadata } from "next";
import { BBH_Bartle, Boldonse, Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutShell";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "../sanity/lib/image";

const boldonse = Boldonse({ weight: "400", variable: "--font-boldonse" });
const outfit   = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "500"] });
const bartie   = BBH_Bartle({ variable: "--font-bartie", subsets: ["latin"], weight: "400" });

// Fetch SEO settings and build Next.js Metadata object
export async function generateMetadata(): Promise<Metadata> {
  const s = await client.fetch(siteSettingsQuery, {}, { cache: "no-store" });

  if (!s) {
    // Fallback if Sanity document hasn't been created yet
    return {
      title:       "Rezenate | Lead The Way",
      description: "Rezenate partners with founders and boards to introduce exceptional leaders.",
    };
  }

  const ogImageUrl = s.ogImage
    ? urlFor(s.ogImage).width(1200).height(630).url()
    : undefined;

  const twitterImageUrl = s.twitterImage
    ? urlFor(s.twitterImage).width(1200).height(628).url()
    : ogImageUrl; // fall back to OG image

  const faviconUrl = s.favicon
    ? urlFor(s.favicon).width(512).height(512).url()
    : "/favicon.ico";

  const appleIconUrl = s.appleIcon
    ? urlFor(s.appleIcon).width(180).height(180).url()
    : undefined;

  return {
    title:       s.metaTitle       ?? "Rezenate | Lead The Way",
    description: s.metaDescription ?? "Rezenate partners with founders and boards to introduce exceptional leaders.",

    ...(s.canonicalUrl && {
      alternates: { canonical: s.canonicalUrl },
    }),

    ...(s.noIndex && {
      robots: { index: false, follow: false },
    }),

    openGraph: {
      type:        "website",
      title:       s.ogTitle       ?? s.metaTitle       ?? "Rezenate | Lead The Way",
      description: s.ogDescription ?? s.metaDescription ?? "",
      ...(s.canonicalUrl && { url: s.canonicalUrl }),
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: s.metaTitle ?? "Rezenate" }],
      }),
    },

    twitter: {
      card:        (s.twitterCard as "summary" | "summary_large_image") ?? "summary_large_image",
      title:       s.ogTitle       ?? s.metaTitle       ?? "Rezenate | Lead The Way",
      description: s.ogDescription ?? s.metaDescription ?? "",
      ...(s.twitterHandle && { site: s.twitterHandle, creator: s.twitterHandle }),
      ...(twitterImageUrl && { images: [twitterImageUrl] }),
    },

    icons: {
      icon:  faviconUrl,
      ...(appleIconUrl && { apple: appleIconUrl }),
    },

    ...(s.themeColor && {
      other: { "theme-color": s.themeColor },
    }),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${boldonse.variable} ${outfit.variable} ${bartie.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <main>
          <LayoutWrapper>{children}</LayoutWrapper>
        </main>
      </body>
    </html>
  );
}