"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

export const ToggleGroup = ToggleGroupPrimitive.Root;

export function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-md px-2.5 h-8 text-sm font-medium transition-colors",
        "border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]",
        "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        "data-[state=on]:bg-[var(--primary)] data-[state=on]:text-[var(--primary-foreground)] data-[state=on]:border-[var(--primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
