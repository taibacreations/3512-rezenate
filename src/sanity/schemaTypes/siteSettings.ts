// schemas/siteSettings.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logoImage",
      title: "Logo Image (wordmark)",
      type: "image",
      description: "The REZENATE wordmark shown below the SVG icon in the header",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "email",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});