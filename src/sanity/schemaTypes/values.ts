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
          ],
          preview: {
            select: { title: "title", subtitle: "desc" },
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