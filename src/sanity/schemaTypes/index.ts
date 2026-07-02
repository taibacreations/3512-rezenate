import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from "./siteSettings";
import banner from "./banner";
import philosophy from "./philosophy";
import values from "./values";
import partners from "./partners";
import founders from "./founders";
import footer from "./footer";
import cta from './cta';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, banner, philosophy, values, partners, founders, cta, footer],
}
