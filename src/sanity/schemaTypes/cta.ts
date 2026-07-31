// sanity/schemas/cta.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "Leadership shapes the way people experience work and therefore life",
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "string",
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
      initialValue: "#footer",
    }),
  ],
  preview: {
    select: { title: "headingPlain" },
    prepare: ({ title }) => ({ title: `CTA — "${title}"` }),
  },
});