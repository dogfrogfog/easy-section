# easy-section

Internal gallery of reusable CMS section examples. Search, filter, and copy the layout, schema, and a Claude prompt that wires both into your CMS.

- **Why** → see [`/goals`](src/app/goals/page.tsx) on the deployed site
- **How to add a section** → use the agent prompt at **[`CONTRIBUTE_PROMPT.md`](./CONTRIBUTE_PROMPT.md)**
- **Data format reference** → [`data-source/README.md`](./data-source/README.md)

## Adding a section

The fast path: copy the prompt at [`CONTRIBUTE_PROMPT.md`](./CONTRIBUTE_PROMPT.md), paste it into Claude Code (Haiku 4.5 is fine and fast) running inside the project where you just shipped the section, and let it open the PR.

The slow path: drop a `YYYY-MM-DD_<project>_sections.json` file into `data-source/` and matching screenshots into `public/previews/<date>_<project>/`. The build globs the folder — no registry to update.

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # validates every data-source JSON file via Zod
pnpm lint
```

## Stack

Next.js 16 (App Router, React 19) · Tailwind v4 · Radix-based shadcn-style UI · `next-themes` · fully static (no API routes, no DB).
