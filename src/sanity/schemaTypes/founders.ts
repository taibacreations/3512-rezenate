// sanity/schemas/founders.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "founders",
  title: "Founders Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "THE",
    }),
    defineField({
      name: "headingItalic",
      title: "Heading — Italic / accent part",
      type: "string",
      initialValue: "founders",
    }),
    defineField({
      name: "subParagraph",
      title: "Sub-paragraph",
      type: "string",
      initialValue: "Rezenate is founder-led. We believe that leadership can be both strong and kind.",
    }),
    defineField({
      name: "founders",
      title: "Founder Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              description: "Founder portrait (content image)",
              options: { hotspot: true },
            }),
            defineField({ name: "name",  title: "Name & Role (e.g. Zak — The Alchemist)", type: "string" }),
            defineField({ name: "quote", title: "Quote",       type: "string" }),
            defineField({ name: "bio",   title: "Bio",         type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "name", media: "photo" },
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
    prepare: ({ title }) => ({ title: `Founders — "${title}"` }),
  },
});