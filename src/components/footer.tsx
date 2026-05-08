export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 text-base text-[var(--muted-foreground)]">
        <p>Internal CMS section gallery.</p>
        <a
          href="https://focusreactive.com"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 hover:text-[var(--foreground)] transition-colors"
        >
          <span>Powered by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/focus-reactive-logo.svg"
            alt="Focus Reactive"
            className="h-7 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}
