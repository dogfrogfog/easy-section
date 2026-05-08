import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 0%, var(--primary) 0%, transparent 65%)",
        }}
      />
      <div
        className="mx-auto px-6 sm:px-10 text-center max-w-3xl"
        style={{
          paddingTop: "calc(var(--section-py) * 0.7)",
          paddingBottom: "calc(var(--section-py) * 0.7)",
        }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3.5 py-1.5 text-sm text-[var(--muted-foreground)] mb-7">
          <span className="size-2 rounded-full bg-[var(--primary)]" />
          {count} sections and counting
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Build CMS sections{" "}
          <span className="text-[var(--primary)]">faster</span>.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed">
          Find a section that&apos;s already been built. Copy the layout, the
          schema, and a Claude prompt that wires both into your CMS. Ship in
          hours, not days.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href="#gallery">
              Browse the gallery <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/goals">
              <Target className="h-4 w-4" /> Read the goals
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
