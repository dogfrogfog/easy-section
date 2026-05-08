"use client";

import { LayoutGrid, LayoutList, Rows3 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "grid" | "list" | "large";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as ViewMode)}
      className="flex items-center gap-1"
      aria-label="View mode"
    >
      <ToggleGroupItem value="grid" aria-label="Grid">
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden md:inline">Grid</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List">
        <LayoutList className="h-4 w-4" />
        <span className="hidden md:inline">List</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="large" aria-label="Large rows">
        <Rows3 className="h-4 w-4" />
        <span className="hidden md:inline">Large</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
