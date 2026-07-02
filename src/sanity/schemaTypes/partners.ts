// schemas/partners.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "partners",
  title: "How We Partner Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "HOW WE PARTNER",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading Paragraph",
      type: "text",
      rows: 3,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "stages",
      title: "Stages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              type: "string",
              description: 'e.g. "01"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "title",
              title: "Stage Title",
              type: "string",
              description: 'e.g. "Attract"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "heading",
              title: "Stage Heading",
              type: "string",
              description: 'e.g. "We make your story magnetic."',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "text",
              title: "Stage Body Text",
              type: "text",
              rows: 4,
              validation: (R) => R.required(),
            }),
            defineField({
              name: "image",
              title: "Hover Image",
              type: "image",
              description: "Image shown in the floating panel on desktop hover",
              options: { hotspot: true },
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "heading", media: "image" },
          },
        },
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "How We Partner Section" }),
  },
});