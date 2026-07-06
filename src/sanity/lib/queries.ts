// src/sanity/lib/queries.ts

// Header — tries fixed ID first, falls back to _type match
// The fixed ID "header" is set by documentId("header") in sanity.config.ts
// If the document was created before that config existed, it has a random ID
// and _type == "header" will still find it.
export const headerQuery = `coalesce(
  *[_id == "header"][0],
  *[_type == "header"][0]
){
  logoImage,
  contactButtonText,
  navLinks[]{ label, href }
}`;

export const siteSettingsQuery = `coalesce(
  *[_id == "siteSettings"][0],
  *[_type == "siteSettings"][0]
){
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterHandle,
  twitterImage,
  favicon,
  appleIcon,
  themeColor,
  noIndex
}`;

export const bannerQuery = `coalesce(
  *[_id == "banner"][0],
  *[_type == "banner"][0]
){ heading, subtitle }`;
export const philosophyQuery = `coalesce(*[_id == "philosophy"][0], *[_type == "philosophy"][0]){ backgroundImage, quotes[]{ text, align } }`;
export const valuesQuery     = `coalesce(*[_id == "values"][0],     *[_type == "values"][0])    { heading, items[]{ name, shortDescription, longDescription, image } }`;
export const partnersQuery   = `coalesce(*[_id == "partners"][0],   *[_type == "partners"][0])  { heading, subheading, stages[]{ number, title, heading, text, image } }`;
export const foundersQuery   = `coalesce(*[_id == "founders"][0],   *[_type == "founders"][0])  { heading, subheading, founders[]{ name, role, bio, quote, photo, cardStyle }, backgroundImage, ringImage, blurImage }`;
export const ctaQuery        = `coalesce(*[_id == "cta"][0],        *[_type == "cta"][0])       { heading, paragraph, buttonText, buttonLink, gradientImage, bgImage }`;
export const footerQuery     = `coalesce(*[_id == "footer"][0],     *[_type == "footer"][0])    { heading, bodyText, copyrightText, backgroundImage }`;