import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from "./siteSettings";
import banner from "./banner";
import philosophy from "./philosophy";
import values from "./values";
import partners from "./partners";
import founders from "./founders";
import footer from "./footer";
import cta from './cta';
import header from './header';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, header, banner, philosophy, values, partners, founders, cta, footer],
}
