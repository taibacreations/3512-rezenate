// sanity/schemas/footer.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "Lead The",
    }),
    defineField({
      name: "headingItalic",
      title: "Heading — Italic / accent part",
      type: "string",
      initialValue: "way",
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "text",
      rows: 3,
      initialValue:
        "10% of every retainer supports a cause our clients care about. We also make a matching donation to a charity chosen by their new leader, because good business should always leave the world better than it found it.",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      initialValue: "© Rezenate 2025. All rights reserved.",
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
    prepare: ({ title }) => ({ title: `Footer — "${title}"` }),
  },
});