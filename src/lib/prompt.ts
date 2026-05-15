import type { Section, SchemaField } from "./types";

export const SUPPORTED_CMS = ["payload", "sanity", "storyblok"] as const;
export type SupportedCms = (typeof SUPPORTED_CMS)[number];

export interface BuildPromptOptions {
  cms?: SupportedCms;
}

export function buildPrompt(section: Section, opts: BuildPromptOptions = {}): string {
  if (section.promptOverride) return section.promptOverride;

  const cms =
    opts.cms ??
    (isSupportedCms(section.cmsTarget) ? section.cmsTarget : SUPPORTED_CMS[0]);

  const effects =
    section.effects.length > 0 ? section.effects.join(", ") : "none";
  const schemaJson = JSON.stringify(section.schema, null, 2);
  const guide = CMS_GUIDES[cms];

  return `You are a CMS section implementer for a ${guide.name} project.
Implement the **${section.name}** section.

Description: ${section.description}
Effects/animations: ${effects}

Use the layout below as the starting point. Reuse existing primitives in the project (\`Image\`, \`Link\`, button components, container/section wrappers) and design tokens from the project's Tailwind config — do not hardcode colors, spacing, or typography.

**Target: ${guide.name}**
${guide.where}

Map each schema field to the matching ${guide.name} field type, preserving names and nesting exactly:
${formatFieldMapping(section.schema.fields, guide.typeMap)}

Type reference for ${guide.name}:
${guide.typeReference}

${guide.notes}

Do not invent fields that are not in the schema; do not drop fields that are. Required fields must be marked required in the ${guide.name} schema.

---
**Layout (\`${section.layout.language}\`):**
\`\`\`${section.layout.language}
${section.layout.code}
\`\`\`

**Schema:**
\`\`\`json
${schemaJson}
\`\`\`
`;
}

function isSupportedCms(value: string | undefined): value is SupportedCms {
  return (
    value !== undefined &&
    (SUPPORTED_CMS as readonly string[]).includes(value)
  );
}

function formatFieldMapping(
  fields: SchemaField[],
  typeMap: Record<string, string>,
  depth = 0,
): string {
  const indent = "  ".repeat(depth);
  return fields
    .map((f) => {
      const mapped = typeMap[f.type] ?? `(map "${f.type}" manually)`;
      const head = `${indent}- \`${f.name}\` (${f.type}) → ${mapped}`;
      const children = f.fields?.length
        ? "\n" + formatFieldMapping(f.fields, typeMap, depth + 1)
        : "";
      const arrayOf = f.of?.length
        ? "\n" + formatFieldMapping(f.of, typeMap, depth + 1)
        : "";
      return head + children + arrayOf;
    })
    .join("\n");
}

interface CmsGuide {
  name: string;
  where: string;
  typeMap: Record<string, string>;
  typeReference: string;
  notes: string;
}

const CMS_GUIDES: Record<SupportedCms, CmsGuide> = {
  payload: {
    name: "Payload CMS",
    where:
      "Create a Block under `src/blocks/<BlockName>/` with `config.ts` (the Payload block config) and `Component.tsx` (the React renderer). Register the block in the page builder's `blocks: []` array in the parent collection.",
    typeMap: {
      string: "`text`",
      text: "`textarea`",
      number: "`number`",
      boolean: "`checkbox`",
      url: "`text` with a URL validator",
      image: "`upload` (relationTo: 'media')",
      richText: "`richText` (Lexical editor)",
      reference: "`relationship`",
      select: "`select` with `options`",
      array: "`array` (use nested `fields` for the row shape)",
      group: "`group`",
      object: "`group`",
    },
    typeReference:
      "Payload field types: `text`, `textarea`, `number`, `checkbox`, `email`, `date`, `select`, `radio`, `upload`, `relationship`, `richText`, `array`, `group`, `blocks`, `tabs`, `row`, `collapsible`, `json`, `code`, `point`.",
    notes:
      "Export the block as `export const <Name>Block: Block = { slug: '...', fields: [...] }`. Use `BlockField` typing from `payload`. If the layout uses an image, accept the populated `Media` doc and pass `doc.url` / `doc.alt` to `next/image`. For rich text, render with `@payloadcms/richtext-lexical/react`'s `RichText` component.",
  },
  sanity: {
    name: "Sanity",
    where:
      "Create the schema at `schemas/sections/<sectionName>.ts` using `defineType` and `defineField` from `sanity`. Add it to the array exported from `schemas/index.ts`. Place the React renderer next to your other section components (e.g. `components/sections/<SectionName>.tsx`) and wire it into your Portable Text / page-builder renderer keyed by `_type`.",
    typeMap: {
      string: "`string`",
      text: "`text`",
      number: "`number`",
      boolean: "`boolean`",
      url: "`url`",
      image: "`image` (enable `hotspot: true`)",
      richText: "`array` of `block` (Portable Text)",
      reference: "`reference`",
      select: "`string` with `options.list`",
      array: "`array` with `of: [...]`",
      group: "`object` with nested `fields`",
      object: "`object` with nested `fields`",
    },
    typeReference:
      "Sanity built-in types: `string`, `text`, `number`, `boolean`, `date`, `datetime`, `url`, `slug`, `image`, `file`, `reference`, `array`, `object`, `block` (rich text), `geopoint`.",
    notes:
      "Use `defineType({ name, title, type: 'object', fields: [...] })` for the section (it's an object embedded in a page-builder array, not a document). Mark required fields with `validation: (Rule) => Rule.required()`. Query images with the GROQ projection `{ ..., image { asset->{ url, metadata }, alt, hotspot } }` and render with `@sanity/image-url`. For rich text use `@portabletext/react`'s `PortableText`.",
  },
  storyblok: {
    name: "Storyblok",
    where:
      "Create a nestable Block (component) in Storyblok with technical name `<section-name>` (kebab-case). Define its fields in the Block Library (or via `storyblok.config.js` / the Management API if your project uses code-defined schemas). On the Next.js side, add a renderer at `components/blocks/<SectionName>.tsx` and register it in your `getStoryblokApi()` / `storyblokInit` `components` map.",
    typeMap: {
      string: "`text`",
      text: "`textarea`",
      number: "`number`",
      boolean: "`boolean`",
      url: "`multilink` (or `text` for a plain URL)",
      image: "`asset` with `filetypes: ['images']`",
      richText: "`richtext`",
      reference: "`multilink` or `option`/`options` with `source: stories`",
      select: "`option` with `options`",
      array: "`bloks` (whitelist the row block) — define the row as its own nestable block",
      group: "no native group — flatten fields or define a child nestable block referenced via `bloks`",
      object: "no native object — flatten fields or define a child nestable block referenced via `bloks`",
    },
    typeReference:
      "Storyblok field types: `text`, `textarea`, `richtext`, `markdown`, `number`, `boolean`, `option`, `options`, `asset`, `multiasset`, `multilink`, `bloks` (nested components), `datetime`, `table`, `section`, `tab`.",
    notes:
      "Wrap the root element with `{...storyblokEditable(blok)}` so the visual editor's click-to-edit works. Render rich text with `renderRichText` from `@storyblok/react`. For `asset` fields, the value is an object — read `blok.image.filename` and `blok.image.alt`. Storyblok has no `group`/`object` primitive, so nested groups in the source schema must be either flattened (prefix the field names) or extracted into their own nestable block referenced via a `bloks` field.",
  },
};
