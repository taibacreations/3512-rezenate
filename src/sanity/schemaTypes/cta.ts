// schemas/cta.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Leadership shapes the way people experience work and therefore life.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "text",
      rows: 3,
      initialValue: "If this resonates, let's have a conversation. We reply within a day — always personally.",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "Start a Private Conversation",
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "string",
      description: 'e.g. "mailto:hello@rezenate.com" or "#footer"',
      initialValue: "#footer",
    }),
  ],
  preview: {
    prepare: () => ({ title: "CTA Section" }),
  },
});