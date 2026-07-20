// sanity/schemas/header.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "logoMark",
      title: "Logo Mark (SVG paths color)",
      type: "string",
      description: "Fill color for logo SVG paths (default: #9564F4)",
      initialValue: "#9564F4",
    }),
    defineField({
      name: "wordmarkImage",
      title: "Wordmark Image",
      type: "image",
      description: "The text logo beside the icon (e.g. 'Rezenate')",
      options: { hotspot: false },
    }),
    defineField({
      name: "wordmarkAlt",
      title: "Wordmark Alt Text",
      type: "string",
      initialValue: "Rezenate",
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href (anchor or path)", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Button Href",
      type: "string",
      initialValue: "#contact",
    }),
  ],
  preview: {
    select: { title: "wordmarkAlt" },
    prepare: ({ title }) => ({ title: `Header — ${title}` }),
  },
});