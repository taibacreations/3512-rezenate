// schemas/banner.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'The large heading — e.g. "Lead The Way"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bannerLogo",
      title: "Banner Logo (3D graphic)",
      type: "image",
      description: "The large 3D logo graphic in the centre of the banner",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bannerWaveImage",
      title: "Banner Wave Image",
      type: "image",
      description: "The wave/landscape image that sits behind the heading",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Banner: ${title}` }),
  },
});