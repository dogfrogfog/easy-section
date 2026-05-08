import { z } from "zod";

const schemaFieldBase = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

type SchemaFieldZ = z.infer<typeof schemaFieldBase> & {
  of?: SchemaFieldZ[];
  fields?: SchemaFieldZ[];
};

export const schemaFieldSchema: z.ZodType<SchemaFieldZ> = schemaFieldBase.extend({
  of: z.lazy(() => z.array(schemaFieldSchema)).optional(),
  fields: z.lazy(() => z.array(schemaFieldSchema)).optional(),
});

export const sectionSchemaSchema = z.object({
  fields: z.array(schemaFieldSchema),
});

export const layoutSchema = z.object({
  language: z.string().min(1),
  code: z.string().min(1),
});

export const rawSectionSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  preview: z.string().min(1),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  effects: z.array(z.string()).optional(),
  cmsTarget: z.string().optional(),
  testPageUrl: z.string().url().nullable().optional(),
  layout: layoutSchema,
  schema: sectionSchemaSchema,
  promptOverride: z.string().nullable().optional(),
});

export const dataFileSchema = z.array(rawSectionSchema);
