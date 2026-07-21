// sanity/schemas/partners.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "partners",
  title: "How We Partner Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "How we",
    }),
    defineField({
      name: "headingItalic",
      title: "Heading — Italic / accent part",
      type: "string",
      initialValue: "partner",
    }),
    defineField({
      name: "subParagraph",
      title: "Sub-paragraph",
      type: "text",
      rows: 3,
      initialValue:
        "We partner with founders and boards to introduce leaders who strengthen culture and build momentum without losing what makes the company human.\n Every engagement moves through five deliberate stages.",
    }),
    defineField({
      name: "items",
      title: "Partner Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "num",      title: "Number (e.g. 01)", type: "string" }),
            defineField({ name: "title",    title: "Title",            type: "string" }),
            defineField({ name: "subtitle", title: "Subtitle",         type: "string" }),
            // ── Portable Text — har Enter = naya paragraph, gap render hoga ──
            defineField({
              name: "description",
              title: "Expanded text",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: { decorators: [] },
                },
              ],
              description: "Enter dabao = naya paragraph (gap aayega). Shift+Enter = line break (gap nahi aayega).",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle" },
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
    prepare: ({ title }) => ({ title: `Partners — "${title}"` }),
  },
});