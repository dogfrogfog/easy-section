export type WellKnownSchemaFieldType =
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "url"
  | "image"
  | "richText"
  | "reference"
  | "select"
  | "array"
  | "group"
  | "object";

export interface SchemaField {
  name: string;
  type: string;
  title?: string;
  description?: string;
  required?: boolean;
  options?: string[];
  of?: SchemaField[];
  fields?: SchemaField[];
}

export interface SectionSchema {
  fields: SchemaField[];
}

export interface SectionLayout {
  language: string;
  code: string;
}

export interface RawSection {
  slug?: string;
  name: string;
  description: string;
  preview: string;
  tags?: string[];
  categories?: string[];
  effects?: string[];
  cmsTarget?: string;
  testPageUrl?: string | null;
  layout: SectionLayout;
  schema: SectionSchema;
  promptOverride?: string | null;
}

export interface Section extends RawSection {
  slug: string;
  tags: string[];
  categories: string[];
  effects: string[];
  project: string;
  addedAt: string;
}
