// sanity/schemas/banner.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      description: 'e.g. "Leadership changes"',
      initialValue: "Leadership changes",
    }),
    defineField({
      name: "headingItalic",
      title: "Heading — Italic / accent word",
      type: "string",
      description: 'e.g. "everything"',
      initialValue: "everything",
    }),
    defineField({
      name: "paragraph",
      title: "Sub-paragraph",
      type: "text",
      rows: 3,
      initialValue:
        "We partner with organisations and leaders to attract, assess and support exceptional leadership that creates lasting impact.",
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      type: "string",
      description: "Hex color for italic word and scroll arrow",
      initialValue: "#9564F4",
    }),
  ],
  preview: {
    select: { title: "headingPlain", subtitle: "headingItalic" },
    prepare: ({ title, subtitle }) => ({
      title: `Banner — "${title} ${subtitle}"`,
    }),
  },
});