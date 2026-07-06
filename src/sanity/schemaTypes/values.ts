import { defineField, defineType } from "sanity";

export default defineType({
  name: "values",
  title: "Values Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "The way we work should reflect the way we live.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "items",
      title: "Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Value Name",
              type: "string",
              description: 'e.g. "Meraki"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "shortDescription",
              title: "Short Description",
              type: "string",
              description: "One line shown on the card",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "longDescription",
              title: "Long Description",
              type: "text",
              rows: 4,
              description: "Shown in the expanded overlay",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "image",
              title: "Card Background Image (optional)",
              type: "image",
              options: { hotspot: true },
              description: "If left empty, gradient + letter overlay will be shown",
              // no validation = optional
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "shortDescription", media: "image" },
          },
        },
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Values Section" }),
  },
});