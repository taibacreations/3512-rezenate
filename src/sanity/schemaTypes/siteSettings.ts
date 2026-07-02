// schemas/siteSettings.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "SEO & Meta Settings",
  type: "document",
  fields: [
    // ── Basic Meta ──────────────────────────────────────────────────────
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Shown in browser tab and search results. Keep under 60 characters.",
      initialValue: "Rezenate | Lead The Way",
      validation: (R) => R.required().max(60).warning("Should be under 60 characters"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Shown in search engine results. Keep between 150–160 characters.",
      initialValue: "Rezenate partners with founders and boards to introduce leaders who strengthen culture and build momentum.",
      validation: (R) => R.required().max(160).warning("Should be under 160 characters"),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "The preferred URL for this site e.g. https://rezenate.com",
    }),

    // ── Open Graph (Facebook / LinkedIn) ────────────────────────────────
    defineField({
      name: "ogTitle",
      title: "OG Title",
      type: "string",
      description: "Title shown when shared on Facebook, LinkedIn. Defaults to Meta Title if left empty.",
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      type: "text",
      rows: 3,
      description: "Description shown when shared on Facebook, LinkedIn. Defaults to Meta Description if left empty.",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "Image shown when shared on Facebook, LinkedIn. Recommended: 1200×630px.",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),

    // ── Twitter / X Card ─────────────────────────────────────────────────
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      options: {
        list: [
          { title: "Summary (small image)", value: "summary" },
          { title: "Summary Large Image (big image)", value: "summary_large_image" },
        ],
        layout: "radio",
      },
      initialValue: "summary_large_image",
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter / X Handle",
      type: "string",
      description: "Your Twitter handle e.g. @rezenate (optional)",
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter Image",
      type: "image",
      description: "Image shown on Twitter/X cards. Recommended: 1200×628px. Defaults to OG Image if left empty.",
      options: { hotspot: true },
    }),

    // ── Favicon ──────────────────────────────────────────────────────────
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description: "Browser tab icon. Upload a square image (PNG or SVG, min 512×512px recommended). Next.js will generate all sizes automatically.",
      options: { hotspot: false },
    }),
    defineField({
      name: "appleIcon",
      title: "Apple Touch Icon",
      type: "image",
      description: "Icon shown when site is added to iPhone/iPad home screen. Square, 180×180px recommended.",
      options: { hotspot: false },
    }),

    // ── Extra ────────────────────────────────────────────────────────────
    defineField({
      name: "themeColor",
      title: "Browser Theme Color",
      type: "string",
      description: "Hex color for mobile browser UI bar e.g. #9564F4",
      initialValue: "#9564F4",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "Turn on to add noindex — use while site is in development.",
      initialValue: false,
    }),
  ],
  preview: {
    prepare: () => ({ title: "SEO & Meta Settings" }),
  },
});