import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SchemaField } from "@/lib/types";

export function SchemaTree({ fields }: { fields: SchemaField[] }) {
  return (
    <ul className="font-mono text-sm space-y-1">
      {fields.map((f, i) => (
        <FieldNode key={`${f.name}-${i}`} field={f} depth={0} />
      ))}
    </ul>
  );
}

function FieldNode({ field, depth }: { field: SchemaField; depth: number }) {
  const nested = field.fields ?? field.of;
  const hasNested = nested && nested.length > 0;
  return (
    <li>
      <div
        className="flex items-baseline gap-2 py-0.5"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {hasNested ? (
          <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0 translate-y-[2px]" />
        ) : (
          <span className="inline-block w-3.5 shrink-0" />
        )}
        <span className="text-[var(--foreground)]">{field.name}</span>
        <Badge variant="outline" className="font-mono text-[10px]">
          {field.type}
        </Badge>
        {field.required && (
          <Badge variant="default" className="font-mono text-[10px]">
            required
          </Badge>
        )}
        {field.title && (
          <span className="text-[var(--muted-foreground)] text-xs italic">
            “{field.title}”
          </span>
        )}
      </div>
      {hasNested && (
        <ul>
          {nested!.map((f, i) => (
            <FieldNode key={`${f.name}-${i}`} field={f} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
