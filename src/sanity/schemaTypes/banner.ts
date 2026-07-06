// schemas/banner.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'The large heading — e.g. "Lead The Way"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: 'Small text below heading — e.g. "Leadership Recruitment & Consulting"',
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Banner: ${title}` }),
  },
});