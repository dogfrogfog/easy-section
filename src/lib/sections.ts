import "server-only";
import fs from "node:fs";
import path from "node:path";
import { dataFileSchema } from "./zod-schemas";
import { slugify } from "./slug";
import type { Section } from "./types";

const DATA_DIR = path.join(process.cwd(), "data-source");
const FILE_PATTERN = /^(\d{4}-\d{2}-\d{2})_([a-z0-9-]+)_sections\.json$/i;

let cache: Section[] | null = null;

export function getAllSections(): Section[] {
  if (cache) return cache;

  if (!fs.existsSync(DATA_DIR)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const sections: Section[] = [];
  const seenSlugs = new Set<string>();

  for (const file of files) {
    const match = file.match(FILE_PATTERN);
    if (!match) {
      throw new Error(
        `data-source/${file}: filename must match YYYY-MM-DD_<project>_sections.json`,
      );
    }
    const [, addedAt, project] = match;
    const fullPath = path.join(DATA_DIR, file);
    const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    const parsed = dataFileSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `data-source/${file}: invalid JSON — ${parsed.error.message}`,
      );
    }

    for (const r of parsed.data) {
      const slug = r.slug ?? `${project}-${slugify(r.name)}`;
      if (seenSlugs.has(slug)) {
        throw new Error(
          `Duplicate section slug "${slug}" — set an explicit slug to disambiguate.`,
        );
      }
      seenSlugs.add(slug);
      sections.push({
        ...r,
        slug,
        tags: r.tags ?? [],
        categories: r.categories ?? [],
        effects: r.effects ?? [],
        testPageUrl: r.testPageUrl ?? null,
        promptOverride: r.promptOverride ?? null,
        project,
        addedAt,
      });
    }
  }

  sections.sort((a, b) =>
    a.addedAt === b.addedAt
      ? a.name.localeCompare(b.name)
      : b.addedAt.localeCompare(a.addedAt),
  );

  cache = sections;
  return cache;
}

export function getSectionBySlug(slug: string): Section | undefined {
  return getAllSections().find((s) => s.slug === slug);
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function getAllTags(): string[] {
  return uniqueSorted(getAllSections().flatMap((s) => s.tags));
}

export function getAllCategories(): string[] {
  return uniqueSorted(getAllSections().flatMap((s) => s.categories));
}

export function getAllEffects(): string[] {
  return uniqueSorted(getAllSections().flatMap((s) => s.effects));
}

export function getAllCmsTargets(): string[] {
  return uniqueSorted(
    getAllSections()
      .map((s) => s.cmsTarget)
      .filter((v): v is string => Boolean(v)),
  );
}

export function getAllProjects(): string[] {
  return uniqueSorted(getAllSections().map((s) => s.project));
}
