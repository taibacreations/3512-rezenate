// sanity/schemas/philosophy.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "philosophy",
  title: "Philosophy Section",
  type: "document",
  fields: [
    defineField({
      name: "headingPlain",
      title: "Heading — Plain part",
      type: "string",
      description: 'e.g. "Every leader influences a culture long before they change a strategy."',
      initialValue: "Every leader influences a culture long before they change a strategy.",
    }),
    defineField({
      name: "para1",
      title: "Paragraph 1",
      type: "string",
      initialValue: "Some support people to become more of themselves.",
    }),
    defineField({
      name: "para2",
      title: "Paragraph 2",
      type: "string",
      initialValue: "Others slowly ask them to become less.",
    }),
    defineField({
      name: "para3",
      title: "Paragraph 3",
      type: "string",
      initialValue: "Rezenate exists because leadership resonates.",
    }),
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "string",
      initialValue: "People buy into the leader before they buy into the vision.",
    }),
    defineField({
      name: "quoteAuthor",
      title: "Quote Author",
      type: "string",
      initialValue: "JOHN C MAXWELL",
    }),
  ],
  preview: {
    select: { title: "headingPlain" },
    prepare: ({ title }) => ({ title: `Philosophy — "${title}"` }),
  },
});