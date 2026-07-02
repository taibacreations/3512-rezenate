// schemas/header.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "logoImage",
      title: "Logo Wordmark",
      type: "image",
      description: "The REZENATE wordmark shown below the SVG icon",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactButtonText",
      title: "Contact Button Text",
      type: "string",
      initialValue: "Contact us",
      description: "Text shown in the pill button top-left (desktop only)",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      description: "Order matters — these appear in the mobile menu top to bottom",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "href",
              title: "Link Target",
              type: "string",
              description: 'Section anchor e.g. "#home", "#founders", or a full URL',
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Header" }),
  },
});