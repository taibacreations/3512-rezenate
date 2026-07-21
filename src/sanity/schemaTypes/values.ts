// sanity/schemas/values.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "values",
  title: "Values Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "The way we work should reflect",
    }),
    defineField({
      name: "headingItalic",
      title: "Heading — Italic / accent part",
      type: "string",
      initialValue: "the way we live.",
    }),
    defineField({
      name: "items",
      title: "Value Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "id",       title: "Number (e.g. 01)",  type: "string" }),
            defineField({ name: "title",    title: "Title",             type: "string" }),
            defineField({ name: "desc",     title: "Short description", type: "string" }),
            defineField({ name: "expanded", title: "Expanded text",     type: "text", rows: 4 }),
            defineField({
              name: "iconImage",
              title: "Icon — Image (upload karo)",
              type: "image",
              description: "SVG ya PNG icon upload karo. Agar yeh set ho to SVG code ignore hoga.",
              options: { hotspot: false },
            }),
            defineField({
              name: "iconSvg",
              title: "Icon — SVG Code (paste karo)",
              type: "text",
              rows: 6,
              description: "Pure SVG code paste karo (e.g. <svg>...</svg>). Sirf tab use hoga jab Image upload na ho.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "desc", media: "iconImage" },
          },
        },
      ],
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      type: "string",
      initialValue: "#9564F4",
    }),
  ],
  preview: {
    select: { title: "headingPlain" },
    prepare: ({ title }) => ({ title: `Values — "${title}"` }),
  },
});