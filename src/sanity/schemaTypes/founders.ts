import { defineField, defineType } from "sanity";

export default defineType({
  name: "founders",
  title: "Founders Section",
  type: "document",
  fields: [
    defineField({ name: "heading",    title: "Section Heading", type: "string", initialValue: "THE FOUNDERS" }),
    defineField({ name: "subheading", title: "Subheading",      type: "string", initialValue: "Rezenate is founder-led. We believe that leadership can be both strong and kind." }),
    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
      validation: (R) => R.required().min(1).max(2),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name",  title: "Name & Title",   type: "string", description: 'e.g. "Zak — The Alchemist"', validation: (R) => R.required() }),
            defineField({ name: "role",  title: "Role",           type: "string", validation: (R) => R.required() }),
            defineField({ name: "bio",   title: "Bio",            type: "text",   rows: 3, validation: (R) => R.required() }),
            defineField({ name: "quote", title: "Personal Quote", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "photo",
              title: "Photo (optional)",
              type: "image",
              options: { hotspot: true },
              description: "If left empty, the brand SVG mark will be shown instead",
              // no validation = optional
            }),
            defineField({
              name: "cardStyle",
              title: "Card Style",
              type: "string",
              options: {
                list: [
                  { title: "Dark — Purple background", value: "dark"  },
                  { title: "Light — White background",  value: "light" },
                ],
                layout: "radio",
              },
              initialValue: "dark",
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        },
      ],
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Start a Conversation",
    }),
    defineField({
      name: "ctaButtonLink",
      title: "CTA Button Link",
      type: "string",
      initialValue: "#footer",
    }),
  ],
  preview: { prepare: () => ({ title: "Founders Section" }) },
});