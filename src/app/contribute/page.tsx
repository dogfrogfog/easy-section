import type { Metadata } from "next";
import { Wand2, Camera, FileJson, GitPullRequest } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import {
  CONTRIBUTE_PROMPT,
  REPO_FULL_NAME,
} from "@/lib/contribute-prompt";

export const metadata: Metadata = {
  title: "Contribute · easy-section",
  description:
    "Copy a prompt, paste it into your coding agent, and let it open a PR with your section.",
};

export default function ContributePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <header>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Contribute a section
        </h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          Copy the prompt below, paste it into your coding agent (Claude Code,
          Cursor, etc.) inside a project where you just shipped a CMS section,
          and let it open the PR for you.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Step
          icon={<Wand2 className="h-4 w-4" />}
          n={1}
          title="Copy the prompt"
          body="Click the button on the prompt below."
        />
        <Step
          icon={<FileJson className="h-4 w-4" />}
          n={2}
          title="Paste in your agent"
          body="Run it in the project the section came from."
        />
        <Step
          icon={<Camera className="h-4 w-4" />}
          n={3}
          title="Approve as it goes"
          body="It'll extract layout, schema, and a screenshot."
        />
        <Step
          icon={<GitPullRequest className="h-4 w-4" />}
          n={4}
          title="It opens the PR"
          body={`Pushed to ${REPO_FULL_NAME} via gh CLI.`}
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              The prompt
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Self-contained. No prerequisites except a checked-out project and
              the GitHub CLI (<code className="font-mono text-xs">gh</code>)
              authenticated.
            </p>
          </div>
          <CopyButton
            value={CONTRIBUTE_PROMPT}
            label="Copy prompt"
            size="default"
          />
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--background)]">
            <div className="text-xs font-medium text-[var(--muted-foreground)]">
              contribute-prompt.md
            </div>
            <CopyButton value={CONTRIBUTE_PROMPT} label="Copy" size="sm" />
          </div>
          <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-auto p-4 max-h-[60vh]">
            {CONTRIBUTE_PROMPT}
          </pre>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[var(--border)] p-5 sm:p-6 text-sm text-[var(--muted-foreground)] space-y-2">
        <p className="font-medium text-[var(--foreground)]">Prefer to do it by hand?</p>
        <p>
          The same JSON shape, naming convention, and validation rules are
          documented in{" "}
          <code className="font-mono text-xs">data-source/README.md</code> in
          the repo. The build refuses bad files, so a successful{" "}
          <code className="font-mono text-xs">pnpm build</code> means it&apos;s
          good to push.
        </p>
      </section>
    </div>
  );
}

function Step({
  icon,
  n,
  title,
  body,
}: {
  icon: React.ReactNode;
  n: number;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-xs font-medium">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
          {n}
        </span>
        <span className="inline-flex items-center gap-1">
          {icon}
          <span>{title}</span>
        </span>
      </div>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
