// schemas/footer.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Lead The Way.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bodyText",
      title: "Body Text",
      type: "text",
      rows: 3,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      initialValue: "© Rezenate 2026. All rights reserved.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer Section" }),
  },
});