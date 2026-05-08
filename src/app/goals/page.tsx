import type { Metadata } from "next";
import { Calendar, Target, Sparkles, Repeat } from "lucide-react";

export const metadata: Metadata = {
  title: "Goals · easy-section",
  description: "Why this gallery exists and how we use it.",
};

export default function GoalsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Goals
        </h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          Why this gallery exists, and how it pays for itself every time we use it.
        </p>
      </header>

      <div className="space-y-10">
        <Goal
          icon={<Calendar className="h-5 w-5" />}
          title="Estimate better"
        >
          <p>
            When we sell a section as a 4-hour task, the developer should
            deliver in 4 hours. Today, every section starts cold — we
            re-discover the same problems on each project, and time slips.
          </p>
          <p>
            With this gallery, the estimate is grounded in something concrete:
            a section that already exists. The developer copies the layout, the
            schema, and a Claude prompt that wires both into the project&apos;s
            CMS. The unknown shrinks; the estimate gets honest.
          </p>
        </Goal>

        <Goal
          icon={<Sparkles className="h-5 w-5" />}
          title="Build better sections"
        >
          <p>
            Speed isn&apos;t the only win. As patterns accumulate here, the
            quality bar rises with them.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--muted-foreground)]">
            <li>Schemas stay simple — fewer fields, sensible defaults.</li>
            <li>Configurations favour the user, not the developer.</li>
            <li>Approaches that proved themselves get reused; the rest gets pruned.</li>
          </ul>
        </Goal>

        <Goal
          icon={<Repeat className="h-5 w-5" />}
          title="Decide once"
          subtitle="Best practices, captured the moment a pattern emerges"
        >
          <p>
            The third goal is the one that compounds. The moment we see
            ourselves making the same call twice — a hero with a parallax, a
            CTA group, a pricing table — that decision belongs here, and we
            don&apos;t make it cold again.
          </p>
          <p>
            As the catalogue grows, this page will host short, opinionated
            best-practice notes: how we name fields, when to use groups vs.
            arrays, which primitives to reuse, how to handle responsive
            previews. One pattern, decided once, written down once.
          </p>

          <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-5 text-sm text-[var(--muted-foreground)]">
            <p className="font-medium text-[var(--foreground)] mb-1">
              Coming soon
            </p>
            <p>
              Specific best-practice notes will be added here as the catalogue
              surfaces shared patterns. If you spot a decision being made twice
              in <code className="font-mono text-xs">data-source/</code>, write
              it down here.
            </p>
          </div>
        </Goal>

        <Goal
          icon={<Target className="h-5 w-5" />}
          title="How to use it"
        >
          <ol className="list-decimal pl-5 space-y-2 text-[var(--muted-foreground)]">
            <li>
              Open the home page, search or filter for a section close to what
              you need.
            </li>
            <li>
              Open it. Copy the layout code, the schema, and the Claude prompt.
            </li>
            <li>
              Paste the prompt into Claude Code in your project. Adjust for
              project-specific primitives and tokens.
            </li>
            <li>
              When you finish a project, drop a new file into{" "}
              <code className="font-mono text-xs">data-source/</code> so the
              next person benefits.
            </li>
          </ol>
        </Goal>
      </div>
    </div>
  );
}

function Goal({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="space-y-3 text-[var(--foreground)]/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
