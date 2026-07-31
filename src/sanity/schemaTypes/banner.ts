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
      description: 'e.g. "Leadership changes everything"',
      initialValue: "Leadership changes everything",
    }),
    defineField({
      name: "paragraph",
      title: "Sub-paragraph",
      type: "text",
      rows: 3,
      initialValue:
        "We partner with organisations and leaders to attract, assess and support exceptional leadership that creates lasting impact.",
    }),
  ],
  preview: {
    select: { title: "headingPlain" },
    prepare: ({ title }) => ({
      title: `Banner — "${title}"`,
    }),
  },
});