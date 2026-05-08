"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { SectionCard } from "@/components/section-card";
import { SectionDetail } from "@/components/section-detail";
import type { Section } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GalleryProps {
  sections: Section[];
  facets: {
    tags: string[];
    categories: string[];
    cms: string[];
    effects: string[];
    projects: string[];
  };
}

const VALID_VIEWS: ViewMode[] = ["grid", "list", "large"];

function readList(sp: URLSearchParams, key: string): string[] {
  const v = sp.get(key);
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

export function Gallery({ sections, facets }: GalleryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tags = readList(searchParams, "tags");
  const categories = readList(searchParams, "categories");
  const cms = readList(searchParams, "cms");
  const effects = readList(searchParams, "effects");
  const projects = readList(searchParams, "projects");
  const viewParam = searchParams.get("view");
  const view: ViewMode = VALID_VIEWS.includes(viewParam as ViewMode)
    ? (viewParam as ViewMode)
    : "grid";
  const openSlug = searchParams.get("section");

  // Local search state. We seed it from the URL on mount (so a shared
  // ?q=hero link works) and write back to the URL on a short debounce so
  // every filtered view stays shareable. We deliberately do not sync URL
  // -> state continuously: that would fight the user's keystrokes.
  const [q, setQ] = React.useState(() => searchParams.get("q") ?? "");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set("q", value);
      else next.delete("q");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, 220);
  }

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value && value.length > 0) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setListParam(key: string, values: string[]) {
    setParam(key, values.length ? values.join(",") : null);
  }

  function clearAll() {
    const next = new URLSearchParams();
    if (view !== "grid") next.set("view", view);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sections.filter((s) => {
      if (needle) {
        const hay = [
          s.name,
          s.description,
          s.project,
          ...(s.tags ?? []),
          ...(s.categories ?? []),
          ...(s.effects ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (tags.length && !tags.every((t) => s.tags.includes(t))) return false;
      if (
        categories.length &&
        !categories.every((c) => s.categories.includes(c))
      )
        return false;
      if (cms.length && !(s.cmsTarget && cms.includes(s.cmsTarget)))
        return false;
      if (effects.length && !effects.every((e) => s.effects.includes(e)))
        return false;
      if (projects.length && !projects.includes(s.project)) return false;
      return true;
    });
  }, [sections, q, tags, categories, cms, effects, projects]);

  const totalSelected =
    tags.length + categories.length + cms.length + effects.length + projects.length;

  const openSection = openSlug
    ? sections.find((s) => s.slug === openSlug) ?? null
    : null;

  function openModal(slug: string) {
    setParam("section", slug);
  }
  function closeModal() {
    setParam("section", null);
  }

  return (
    <section id="gallery" className="container mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-4">
        <SearchBar value={q} onChange={handleSearchChange} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Filters
            totalSelected={totalSelected}
            onClearAll={clearAll}
            groups={[
              {
                key: "tags",
                label: "Tags",
                options: facets.tags,
                selected: tags,
                onChange: (v) => setListParam("tags", v),
              },
              {
                key: "categories",
                label: "Categories",
                options: facets.categories,
                selected: categories,
                onChange: (v) => setListParam("categories", v),
              },
              {
                key: "cms",
                label: "CMS",
                options: facets.cms,
                selected: cms,
                onChange: (v) => setListParam("cms", v),
              },
              {
                key: "effects",
                label: "Effects",
                options: facets.effects,
                selected: effects,
                onChange: (v) => setListParam("effects", v),
              },
              {
                key: "projects",
                label: "Projects",
                options: facets.projects,
                selected: projects,
                onChange: (v) => setListParam("projects", v),
              },
            ]}
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted-foreground)]">
              {filtered.length} of {sections.length}
            </span>
            <ViewToggle
              value={view}
              onChange={(v) =>
                setParam("view", v === "grid" ? null : v)
              }
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <div
          className={cn(
            view === "grid" &&
              "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            view === "list" && "flex flex-col gap-4",
            view === "large" && "grid gap-6 grid-cols-1 lg:grid-cols-2",
          )}
        >
          {filtered.map((s) => (
            <SectionCard
              key={s.slug}
              section={s}
              view={view}
              onOpen={openModal}
            />
          ))}
        </div>
      )}

      <SectionDetail section={openSection} onClose={closeModal} />
    </section>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-4 border border-dashed border-[var(--border)] rounded-lg">
      <SearchX className="h-10 w-10 text-[var(--muted-foreground)]" />
      <div>
        <h3 className="font-medium">No sections match</h3>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Try removing a filter or clearing your search.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
