// schemas/philosophy.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "philosophy",
  title: "Philosophy Section",
  type: "document",
  fields: [
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description: "The background image that slowly scrolls (section2-bg.webp)",
      options: { hotspot: true },
    }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      description: "Each quote is one scroll step. Order matters.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Quote Text",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "align",
              title: "Text Alignment",
              type: "string",
              options: {
                list: [
                  { title: "Left (logo on right)", value: "left" },
                  { title: "Right (logo on left)", value: "right" },
                ],
                layout: "radio",
              },
              initialValue: "left",
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "align" },
          },
        },
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Philosophy Section" }),
  },
});