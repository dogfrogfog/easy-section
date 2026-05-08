You are helping me contribute one or more CMS sections I just built to the easy-section gallery (https://github.com/dogfrogfog/easy-section). Drive the whole flow end-to-end. Ask only when truly blocked.

The flow is:
1. Identify candidate sections (cheap scan, no big reads).
2. For each section, dispatch a Task subagent that reads its files and returns the JSON object — in parallel. This keeps the main context small and turnaround fast.
3. Capture screenshots (sequential, main agent — dev server is shared state).
4. Combine results into a single data file and open a PR with the GitHub CLI.

# 1. Identify the section(s) — light scan only

Without reading whole files into your own context, locate candidate section components and their matching schema. For each, write down:

- a short `name` (Title Case) and a project-relative `componentPath`
- the matching `schemaPath` if you can spot it. Search hints:
  - Payload: `payload.config.ts`, `collections/`, `blocks/`, `fields/`
  - Sanity: `sanity.config.*`, `schemas/`, `schemaTypes/`
  - Storyblok: `storyblok/components/`
  - Contentful / Strapi / Directus: their respective config dirs
- the `cmsTarget` (`payload` | `sanity` | `storyblok` | `contentful` | `strapi` | `directus` | `wordpress`)

Show me the list and confirm before going further. Also confirm the `<project-slug>` (lowercase, dashes, e.g. `acme-store`) — used for the filename and screenshot folder.

# 2. Extract each section's JSON — dispatch subagents in PARALLEL

**If exactly one section**: do the work inline (read the files, build the JSON object).

**If two or more sections**: dispatch one Task subagent per section in a single message (multiple Task calls in one assistant turn = parallel execution). Reasons:
- Each subagent gets its own 200k context, so we don't blow up the main context with every project's source.
- Subagents return only the small JSON object, not the source.
- Total wall-clock time scales with the largest section, not the sum.

## Subagent prompt template

Pass this verbatim to each subagent, with `{name}`, `{componentPath}`, `{schemaPath}`, `{cmsTarget}` filled in:

> You are extracting a single CMS section into the easy-section JSON shape. Read the two files below and return ONLY the JSON object — no markdown, no commentary, no screenshot, no PR work. Anything else in your reply is wasted tokens.
>
> Section: **{name}**
> Component: `{componentPath}`
> Schema: `{schemaPath}`
> Target CMS: `{cmsTarget}`
>
> Return an object matching exactly this shape:
>
> ```jsonc
> {
>   "name": "{name}",
>   "description": "<one or two sentences you write>",
>   "preview": "previews/<DATE>_<PROJECT>/<slug>.png",  // leave the placeholder; main will replace
>   "tags": ["..."],          // free-form, lowercase
>   "categories": ["..."],    // landing | pricing | blog | product | ...
>   "effects": ["..."],       // animations / scroll behaviours
>   "cmsTarget": "{cmsTarget}",
>   "layout": {
>     "language": "tsx",       // or jsx | vue | astro | svelte
>     "code": "...the cleaned section source, no unrelated wrappers/imports..."
>   },
>   "schema": {
>     "fields": [
>       { "name": "title", "type": "string", "title": "Title", "required": true }
>       // group fields nest under `fields`; arrays under `of`
>     ]
>   }
> }
> ```
>
> Field types you can use: `string`, `text`, `number`, `boolean`, `url`, `image`, `richText`, `reference`, `select` (+ `options: string[]`), `array` (+ `of: SchemaField[]`), `group` (+ `fields: SchemaField[]`), `object` (+ `fields: SchemaField[]`).
>
> Rules:
> - Trim the layout to the section component itself; drop unrelated wrappers and imports.
> - Preserve nested schema groups exactly.
> - Drop CMS-specific options that don't translate (icons, custom validators, conditional logic).
> - Do not paste API keys, internal URLs, real customer copy, or proprietary identifiers. Sanitize names if needed.
> - Do not include `project` or `addedAt` — derived from the filename.
> - Reply with the JSON object and nothing else.

When all subagents return, you'll have a list of JSON objects.

# 3. Screenshots — sequential, main agent only

For each section, find an existing screenshot in `docs/`, `screenshots/`, or `public/`. If none exists, start the dev server, navigate to a page that uses the section, capture at ~1600×900, and save to a temp path. Do this one at a time — the dev server is shared state, can't be parallelized.

Then, in each section JSON, replace the `previews/<DATE>_<PROJECT>/<slug>.png` placeholder with the real path.

# 4. Open the PR with the GitHub CLI

Prereqs: `gh auth status` must show you logged in. If it doesn't, run `gh auth login` and finish that first.

```bash
set -euo pipefail

DATE="$(date +%F)"                     # YYYY-MM-DD
PROJECT="<project-slug>"               # lowercase, dashes only
BRANCH="data/$PROJECT-$DATE"

TMP="$(mktemp -d)"
cd "$TMP"

# Fork (or reuse your fork) and clone it. "origin" points at your fork,
# "upstream" at dogfrogfog/easy-section. This works whether you have push
# access or not — collaborators just end up with a personal fork too,
# which is fine.
gh repo fork dogfrogfog/easy-section --clone --remote
cd easy-section

# Branch from the latest upstream main, not your fork's potentially stale main.
git fetch upstream
git checkout -b "$BRANCH" upstream/main

mkdir -p "public/previews/${DATE}_${PROJECT}"
# Copy each captured screenshot into public/previews/${DATE}_${PROJECT}/
# matching the filenames you put in each section's `preview` field.
cp /path/to/<slug>.png "public/previews/${DATE}_${PROJECT}/<slug>.png"

# Write the JSON file. It must be an ARRAY of section objects — one entry
# per section the subagents returned, in the order you confirmed above.
cat > "data-source/${DATE}_${PROJECT}_sections.json" <<'JSON'
[
  /* paste the combined JSON objects from the subagents here */
]
JSON

# Validate locally — the build will fail loudly on a malformed file.
pnpm install
pnpm build

git add public/previews data-source
git commit -m "data: $PROJECT sections"
git push -u origin "$BRANCH"

# Open the PR against the upstream repo from your fork's branch.
gh pr create \
  --repo dogfrogfog/easy-section \
  --base main \
  --head "$(gh api user -q .login):$BRANCH" \
  --title "data: add $PROJECT sections" \
  --body "Adds $PROJECT sections to the gallery."
```

# 5. Hard rules

- Filename **must** match `^\d{4}-\d{2}-\d{2}_[a-z0-9-]+_sections\.json$`.
- The data file is a JSON **array** at the top level — even for a single section.
- The `preview` path is relative to `public/` (no leading slash).
- Never paste API keys, internal URLs, real customer copy, or anything proprietary into `layout.code` or the schema. Sanitize identifiers if needed.
- If `pnpm build` fails, **fix the JSON before pushing** — don't push a broken file and let CI catch it.
- One file per project per upload. Several sections from the same project? One file, multiple objects in the array.

When the PR is open, reply with the PR URL.
