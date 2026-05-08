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
      <DialogContent>
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
    <div className="flex flex-col max-h-[92vh]">
      <DialogHeader className="pr-12">
        <DialogTitle className="text-xl">{section.name}</DialogTitle>
        <DialogDescription>{section.description}</DialogDescription>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)] pt-2">
          <span>{section.project}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {section.addedAt}
          </span>
          {section.cmsTarget && (
            <>
              <span>·</span>
              <span>Originally: {section.cmsTarget}</span>
            </>
          )}
        </div>
      </DialogHeader>

      <div className="grid lg:grid-cols-[42%_58%] flex-1 min-h-0 overflow-hidden">
        <div className="relative bg-[var(--muted)] border-b lg:border-b-0 lg:border-r border-[var(--border)] aspect-video lg:aspect-auto lg:min-h-[360px]">
          <Image
            src={`/${section.preview}`}
            alt={section.name}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col min-h-0">
          <Tabs defaultValue="layout" className="flex flex-col min-h-0 flex-1">
            <div className="px-5 pt-4 flex items-center justify-between gap-3 border-b border-[var(--border)]">
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
              className="mt-0 flex-1 min-h-0 flex flex-col"
            >
              <CodePane
                title={`Layout (${section.layout.language})`}
                copyValue={section.layout.code}
                copyLabel="Copy code"
              >
                <pre className="text-xs leading-relaxed font-mono whitespace-pre overflow-auto p-4">
                  {section.layout.code}
                </pre>
              </CodePane>
            </TabsContent>

            <TabsContent
              value="schema"
              className="mt-0 flex-1 min-h-0 flex flex-col"
            >
              <CodePane
                title="Schema"
                copyValue={JSON.stringify(section.schema, null, 2)}
                copyLabel="Copy schema"
              >
                <div className="overflow-auto p-4 space-y-4">
                  <SchemaTree fields={section.schema.fields} />
                  <details className="text-xs text-[var(--muted-foreground)]">
                    <summary className="cursor-pointer hover:text-[var(--foreground)]">
                      Raw JSON
                    </summary>
                    <pre className="font-mono whitespace-pre mt-2 p-3 rounded bg-[var(--muted)] overflow-auto">
                      {JSON.stringify(section.schema, null, 2)}
                    </pre>
                  </details>
                </div>
              </CodePane>
            </TabsContent>

            <TabsContent
              value="prompt"
              className="mt-0 flex-1 min-h-0 flex flex-col"
            >
              <CodePane
                title={<CmsPicker value={cms} onChange={setCms} />}
                copyValue={prompt}
                copyLabel="Copy prompt"
              >
                <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-auto p-4">
                  {prompt}
                </pre>
              </CodePane>
            </TabsContent>
          </Tabs>

          <div className="border-t border-[var(--border)] p-4 flex flex-wrap gap-1">
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
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]/40">
        <div className="text-xs font-medium text-[var(--muted-foreground)]">
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
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
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
