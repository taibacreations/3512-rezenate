// sanity/schemas/loading.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "loading",
  title: "Loading Screen",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      initialValue: "lead the way",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Leadership that resonates. Impact that lasts.",
    }),
    defineField({
      name: "loadingLabel",
      title: "Loading Label",
      type: "string",
      initialValue: "Loading",
    }),
  ],
  preview: {
    select: { title: "headingPlain" },
    prepare: ({ title }) => ({ title: `Loading Screen — "${title}"` }),
  },
});