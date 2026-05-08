import type { Section } from "./types";

export interface BuildPromptOptions {
  cms?: string;
}

const DEFAULT_CMS = "your CMS";

export function buildPrompt(section: Section, opts: BuildPromptOptions = {}): string {
  if (section.promptOverride) return section.promptOverride;

  const cms = opts.cms ?? section.cmsTarget ?? DEFAULT_CMS;
  const effects =
    section.effects.length > 0 ? section.effects.join(", ") : "none";
  const schemaJson = JSON.stringify(section.schema, null, 2);

  return `You are a CMS section implementer for a ${cms} project.
Implement the **${section.name}** section.

Description: ${section.description}
Effects/animations: ${effects}

Use the layout below as the starting point. Reuse existing primitives in the project (\`Image\`, \`Link\`, button components, container/section wrappers) and design tokens from the project's Tailwind config — do not hardcode colors, spacing, or typography.

Map the schema to ${cms}'s field types. Preserve nested groups exactly. Do not invent fields that are not in the schema; do not drop fields that are.

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

export const SUPPORTED_CMS = [
  "payload",
  "sanity",
  "storyblok",
  "contentful",
  "strapi",
  "wordpress",
  "directus",
] as const;
