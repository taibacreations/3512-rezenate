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
              validation: (R) => R.required(),
            }),
            defineField({
              name: "text",
              title: "Stage Body Text",
              type: "text",
              rows: 4,
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

    // ── Trust Strip ──────────────────────────────────────────
    defineField({
      name: "trustSignals",
      title: "Trust Strip Signals",
      type: "array",
      description: "4 trust signals shown in the strip below the stages",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "Replacement Guarantee"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "detail",
              title: "Detail",
              type: "string",
              description: 'e.g. "If it doesn\'t work out, we make it right."',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Type",
              type: "string",
              description: "shield-check | dollar | shield | person",
              options: {
                list: [
                  { title: "Shield with Check (Guarantee)", value: "shield-check" },
                  { title: "Dollar Sign (Fees)",            value: "dollar"       },
                  { title: "Shield (Values)",               value: "shield"       },
                  { title: "Person (Founder-Led)",          value: "person"       },
                ],
                layout: "radio",
              },
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "detail" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "How We Partner Section" }),
  },
});