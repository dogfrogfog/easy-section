"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Section } from "@/lib/types";
import type { ViewMode } from "@/components/view-toggle";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  section: Section;
  view: ViewMode;
  onOpen: (slug: string) => void;
}

export function SectionCard({ section, view, onOpen }: SectionCardProps) {
  if (view === "list") return <ListCard section={section} onOpen={onOpen} />;
  if (view === "large") return <LargeCard section={section} onOpen={onOpen} />;
  return <GridCard section={section} onOpen={onOpen} />;
}

function CardShell({
  className,
  children,
  onClick,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group text-left w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] transition-all hover:border-[var(--primary)]/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Preview({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative bg-[var(--muted)] overflow-hidden",
        className,
      )}
    >
      <Image
        src={`/${src}`}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function TagList({ tags, max = 4 }: { tags: string[]; max?: number }) {
  const visible = tags.slice(0, max);
  const rest = tags.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((t) => (
        <Badge key={t} variant="muted" className="font-normal">
          {t}
        </Badge>
      ))}
      {rest > 0 && (
        <Badge variant="muted" className="font-normal">
          +{rest}
        </Badge>
      )}
    </div>
  );
}

function GridCard({
  section,
  onOpen,
}: {
  section: Section;
  onOpen: (slug: string) => void;
}) {
  return (
    <CardShell onClick={() => onOpen(section.slug)} ariaLabel={`Open ${section.name}`}>
      <Preview src={section.preview} alt={section.name} className="aspect-video" />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{section.name}</h3>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
          {section.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <TagList tags={section.tags} max={3} />
          <span className="text-xs text-[var(--muted-foreground)] shrink-0 ml-2">
            {section.project}
          </span>
        </div>
      </div>
    </CardShell>
  );
}

function ListCard({
  section,
  onOpen,
}: {
  section: Section;
  onOpen: (slug: string) => void;
}) {
  return (
    <CardShell
      onClick={() => onOpen(section.slug)}
      ariaLabel={`Open ${section.name}`}
      className="flex flex-col sm:flex-row"
    >
      <Preview
        src={section.preview}
        alt={section.name}
        className="sm:w-72 sm:shrink-0 aspect-video sm:aspect-[4/3]"
      />
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">
              {section.name}
            </h3>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-2">
              <span>{section.project}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {section.addedAt}
              </span>
              {section.cmsTarget && (
                <>
                  <span>·</span>
                  <span>{section.cmsTarget}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
          {section.description}
        </p>
        <div className="mt-auto pt-2">
          <TagList tags={[...section.tags, ...section.effects]} max={6} />
        </div>
      </div>
    </CardShell>
  );
}

function LargeCard({
  section,
  onOpen,
}: {
  section: Section;
  onOpen: (slug: string) => void;
}) {
  return (
    <CardShell onClick={() => onOpen(section.slug)} ariaLabel={`Open ${section.name}`}>
      <Preview
        src={section.preview}
        alt={section.name}
        className="aspect-[16/8] sm:aspect-[16/7]"
      />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-semibold text-xl leading-tight">{section.name}</h3>
          <span className="text-xs text-[var(--muted-foreground)]">
            {section.project} · {section.addedAt}
            {section.cmsTarget ? ` · ${section.cmsTarget}` : ""}
          </span>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] max-w-3xl">
          {section.description}
        </p>
        <TagList tags={[...section.tags, ...section.effects]} max={10} />
      </div>
    </CardShell>
  );
}
