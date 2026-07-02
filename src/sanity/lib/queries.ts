// src/sanity/lib/queries.ts

export const bannerQuery = `*[_type == "banner"][0]{
  heading,
  bannerLogo,
  bannerWaveImage
}`;

export const philosophyQuery = `*[_type == "philosophy"][0]{
  backgroundImage,
  quotes[]{
    text,
    align
  }
}`;

export const valuesQuery = `*[_type == "values"][0]{
  heading,
  items[]{
    name,
    shortDescription,
    longDescription,
    image
  }
}`;

export const partnersQuery = `*[_type == "partners"][0]{
  heading,
  subheading,
  stages[]{
    number,
    title,
    heading,
    text,
    image
  }
}`;

export const foundersQuery = `*[_type == "founders"][0]{
  heading,
  subheading,
  founders[]{
    name,
    role,
    bio,
    quote,
    photo,
    cardStyle
  },
  backgroundImage,
  ringImage,
  blurImage
}`;


export const ctaQuery = `*[_type == "cta"][0]{
  heading, paragraph, buttonText, buttonLink, gradientImage, bgImage
}`;

export const footerQuery = `*[_type == "footer"][0]{
  heading,
  bodyText,
  copyrightText,
  backgroundImage
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  logoImage,
  contactEmail
}`;