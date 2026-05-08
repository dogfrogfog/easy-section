"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface FacetGroup {
  key: string;
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function Filters({
  groups,
  onClearAll,
  totalSelected,
}: {
  groups: FacetGroup[];
  onClearAll: () => void;
  totalSelected: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {groups.map((g) => (
        <FacetDropdown key={g.key} group={g} />
      ))}
      {totalSelected > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-[var(--muted-foreground)]"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

function FacetDropdown({ group }: { group: FacetGroup }) {
  if (group.options.length === 0) return null;
  const count = group.selected.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span>{group.label}</span>
          {count > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-[10px] min-w-5 justify-center">
              {count}
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {group.options.map((opt) => {
          const checked = group.selected.includes(opt);
          return (
            <DropdownMenuCheckboxItem
              key={opt}
              checked={checked}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(c) => {
                if (c) group.onChange([...group.selected, opt]);
                else group.onChange(group.selected.filter((v) => v !== opt));
              }}
            >
              {opt}
            </DropdownMenuCheckboxItem>
          );
        })}
        {count > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => group.onChange([])}
              className="text-[var(--muted-foreground)] justify-center"
            >
              Clear {group.label.toLowerCase()}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
