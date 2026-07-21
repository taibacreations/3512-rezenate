// src/sanity/lib/queries.ts

import { client } from "./client";

export const HEADER_QUERY = `*[_type == "header"][0]{
  logoMark,
  wordmarkImage { asset->{ url } },
  wordmarkAlt,
  navLinks[] {
    label,
    href
  },
  ctaLabel,
  ctaHref
}`;

// ── TypeScript type ────────────────────────────────────────────────────────
export type HeaderData = {
  logoMark?: string;
  wordmarkImage?: { asset?: { url?: string } };
  wordmarkAlt?: string;
  navLinks?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
};

// ── Fetcher (no-store — Next.js 15 cache bypass) ──────────────────────────
export async function getHeaderData(): Promise<HeaderData> {
  return client.fetch<HeaderData>(
    HEADER_QUERY,
    {},
    {
      // Next.js 15 fetch cache directive — no caching at all
      cache: "no-store",
    },
  );
}

export const siteSettingsQuery = `coalesce(
  *[_id == "siteSettings"][0],
  *[_type == "siteSettings"][0]
){
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterHandle,
  twitterImage,
  favicon,
  appleIcon,
  themeColor,
  noIndex
}`;

// lib/queries/banner.ts
import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-06-01",
  useCdn: false,
});

export const BANNER_QUERY = `*[_type == "banner"][0]{
  headingPlain,
  headingItalic,
  paragraph,
  accentColor
}`;

export type BannerData = {
  headingPlain?: string;
  headingItalic?: string;
  paragraph?: string;
  accentColor?: string;
};

export async function getBannerData(): Promise<BannerData> {
  return client.fetch<BannerData>(BANNER_QUERY, {}, { cache: "no-store" });
}
export const PHILOSOPHY_QUERY = `*[_type == "philosophy"][0]{
  headingPlain,
  headingItalic,
  para1,
  para2,
  para3,
  quoteText,
  quoteAuthor,
  accentColor
}`;

export type PhilosophyData = {
  headingPlain?: string;
  headingItalic?: string;
  para1?: string;
  para2?: string;
  para3?: string;
  quoteText?: string;
  quoteAuthor?: string;
  accentColor?: string;
};

export async function getPhilosophyData(): Promise<PhilosophyData> {
  return client.fetch<PhilosophyData>(
    PHILOSOPHY_QUERY,
    {},
    { cache: "no-store" },
  );
}

export const VALUES_QUERY = `*[_type == "values"][0]{
  headingPlain,
  headingItalic,
  items[] {
    id,
    title,
    desc,
    expanded,
    iconImage { asset->{ url } },
    iconSvg
  },
  accentColor
}`;
 
export type ValueItem = {
  id:        string;
  title:     string;
  desc:      string;
  expanded:  string;
  iconImage?: { asset?: { url?: string } };
  iconSvg?:  string;
};
 
export type ValuesData = {
  headingPlain?:  string;
  headingItalic?: string;
  items?:         ValueItem[];
  accentColor?:   string;
};
 
export async function getValuesData(): Promise<ValuesData> {
  return sanityClient.fetch<ValuesData>(VALUES_QUERY, {}, { cache: "no-store" });
}


export const PARTNERS_QUERY = `*[_type == "partners"][0]{
  headingPlain,
  headingItalic,
  subParagraph,
  items[] {
    num,
    title,
    subtitle,
    description
  },
  accentColor
}`;
 
export type PartnerItem = {
  num:         string;
  title:       string;
  subtitle:    string;
  description: string;
};
 
export type PartnersData = {
  headingPlain?:  string;
  headingItalic?: string;
  subParagraph?:  string;
  items?:         PartnerItem[];
  accentColor?:   string;
};
 
export async function getPartnersData(): Promise<PartnersData> {
  return sanityClient.fetch<PartnersData>(PARTNERS_QUERY, {}, { cache: "no-store" });
}
export const FOUNDERS_QUERY = `*[_type == "founders"][0]{
  headingPlain,
  headingItalic,
  subParagraph,
  founders[] {
    photo { asset->{ url } },
    name,
    quote,
    bio
  },
  accentColor
}`;
 
export type FounderItem = {
  photo?: { asset?: { url?: string } };
  name:   string;
  quote:  string;
  bio:    string;
};
 
export type FoundersData = {
  headingPlain?:  string;
  headingItalic?: string;
  subParagraph?:  string;
  founders?:      FounderItem[];
  accentColor?:   string;
};
 
export async function getFoundersData(): Promise<FoundersData> {
  return client.fetch<FoundersData>(FOUNDERS_QUERY, {}, { cache: "no-store" });
}
export const CTA_QUERY = `*[_type == "cta"][0]{
  headingPlain,
  headingItalic,
  paragraph,
  buttonText,
  buttonLink,
  accentColor
}`;
 
export type CtaData = {
  headingPlain?:  string;
  headingItalic?: string;
  paragraph?:     string;
  buttonText?:    string;
  buttonLink?:    string;
  accentColor?:   string;
};
 
export async function getCtaData(): Promise<CtaData> {
  return client.fetch<CtaData>(CTA_QUERY, {}, { cache: "no-store" });
}
export const FOOTER_QUERY = `*[_type == "footer"][0]{
  headingPlain,
  headingItalic,
  paragraph,
  copyrightText,
  accentColor
}`;
 
export type FooterData = {
  headingPlain?:  string;
  headingItalic?: string;
  paragraph?:     string;
  copyrightText?: string;
  accentColor?:   string;
};
 
export async function getFooterData(): Promise<FooterData> {
  return client.fetch<FooterData>(FOOTER_QUERY, {}, { cache: "no-store" });
}


export const LOADING_QUERY = `*[_type == "loading"][0]{
  headingPlain,
  headingItalic,
  tagline,
  loadingLabel
}`;
 
export type LoadingData = {
  headingPlain?:  string;
  headingItalic?: string;
  tagline?:       string;
  loadingLabel?:  string;
};
 
export async function getLoadingData(): Promise<LoadingData> {
  return sanityClient.fetch<LoadingData>(LOADING_QUERY, {}, { cache: "no-store" });
}