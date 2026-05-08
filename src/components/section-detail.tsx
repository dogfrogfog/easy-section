"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar, ChevronDown, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CopyButton } from "@/components/copy-button";
import { SchemaTree } from "@/components/schema-tree";
import { buildPrompt, SUPPORTED_CMS } from "@/lib/prompt";
import type { Section } from "@/lib/types";

interface SectionDetailProps {
  section: Section | null;
  onClose: () => void;
}

export function SectionDetail({ section, onClose }: SectionDetailProps) {
  const open = section !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl w-[min(960px,94vw)] h-[min(820px,90vh)] p-0">
        {section && <SectionDetailInner key={section.slug} section={section} />}
      </DialogContent>
    </Dialog>
  );
}

function SectionDetailInner({ section }: { section: Section }) {
  const [cms, setCms] = React.useState<string>(
    section.cmsTarget ?? SUPPORTED_CMS[0],
  );
  const prompt = React.useMemo(
    () => buildPrompt(section, { cms }),
    [section, cms],
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DialogHeader className="pr-12 shrink-0">
        <DialogTitle className="text-2xl">{section.name}</DialogTitle>
        <DialogDescription className="text-base">
          {section.description}
        </DialogDescription>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted-foreground)] pt-2">
          <span>{section.project}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {section.addedAt}
          </span>
          {section.cmsTarget && (
            <>
              <span>·</span>
              <span>Originally: {section.cmsTarget}</span>
            </>
          )}
        </div>
      </DialogHeader>

      <div className="relative bg-[var(--muted)] border-b border-[var(--border)] h-[280px] shrink-0">
        <Image
          src={`/${section.preview}`}
          alt={section.name}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-contain"
        />
      </div>

      <div className="flex flex-col min-h-0 flex-1">
        <Tabs
          defaultValue="layout"
          className="flex flex-col min-h-0 flex-1"
        >
          <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-[var(--border)] shrink-0">
            <TabsList>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="prompt">
                <Wand2 className="h-3.5 w-3.5" />
                <span className="ml-1">Prompt</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="layout"
            className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden"
          >
            <CodePane
              title={`Layout (${section.layout.language})`}
              copyValue={section.layout.code}
              copyLabel="Copy code"
            >
              <pre className="text-sm leading-relaxed font-mono whitespace-pre h-full overflow-auto p-5">
                {section.layout.code}
              </pre>
            </CodePane>
          </TabsContent>

          <TabsContent
            value="schema"
            className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden"
          >
            <CodePane
              title="Schema"
              copyValue={JSON.stringify(section.schema, null, 2)}
              copyLabel="Copy schema"
            >
              <div className="h-full overflow-auto p-5 space-y-5">
                <SchemaTree fields={section.schema.fields} />
                <details className="text-sm text-[var(--muted-foreground)]">
                  <summary className="cursor-pointer hover:text-[var(--foreground)]">
                    Raw JSON
                  </summary>
                  <pre className="font-mono whitespace-pre mt-2 p-4 rounded-lg bg-[var(--muted)] overflow-auto text-sm">
                    {JSON.stringify(section.schema, null, 2)}
                  </pre>
                </details>
              </div>
            </CodePane>
          </TabsContent>

          <TabsContent
            value="prompt"
            className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden"
          >
            <CodePane
              title={<CmsPicker value={cms} onChange={setCms} />}
              copyValue={prompt}
              copyLabel="Copy prompt"
            >
              <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap h-full overflow-auto p-5">
                {prompt}
              </pre>
            </CodePane>
          </TabsContent>
        </Tabs>

        <div className="border-t border-[var(--border)] px-5 py-3 flex flex-wrap gap-1.5 shrink-0">
          {section.tags.map((t) => (
            <Badge key={t} variant="muted" className="font-normal">
              {t}
            </Badge>
          ))}
          {section.effects.map((e) => (
            <Badge key={e} variant="outline" className="font-normal">
              {e}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodePane({
  title,
  copyValue,
  copyLabel,
  children,
}: {
  title: React.ReactNode;
  copyValue: string;
  copyLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--muted)]/40 shrink-0">
        <div className="text-sm font-medium text-[var(--muted-foreground)]">
          {title}
        </div>
        <CopyButton value={copyValue} label={copyLabel} />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function CmsPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span>Target CMS:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
            {value} <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {SUPPORTED_CMS.map((c) => (
            <DropdownMenuItem key={c} onSelect={() => onChange(c)}>
              {c}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
