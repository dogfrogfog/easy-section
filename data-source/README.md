# data-source/

Each `*.json` file in this folder contributes one or more sections to the gallery. **No registry to update** — drop a file in, run the build, and the sections appear.

## File naming

```
YYYY-MM-DD_<project-slug>_sections.json
```

- `YYYY-MM-DD` — the date you added the file (becomes `addedAt` on every section in the file)
- `<project-slug>` — lowercase, dash-separated project identifier (becomes `project` on every section)
- The `_sections.json` suffix is required

Example: `2026-05-08_acme-store_sections.json`

If the filename doesn't match this pattern, the build will fail loudly.

## File contents

A single JSON **array** of section objects.

```jsonc
[
  {
    "name": "Hero Banner with Parallax",
    "description": "Full-width hero with a parallax background image and animated heading.",
    "preview": "previews/2026-05-08_acme-store/hero-banner.png",
    "tags": ["hero", "banner", "parallax"],
    "categories": ["landing"],
    "effects": ["parallax-scroll", "fade-in"],
    "cmsTarget": "payload",
    "layout": {
      "language": "tsx",
      "code": "export function HeroBanner({ title, image, cta }) { /* … */ }"
    },
    "schema": {
      "fields": [
        { "name": "title", "type": "string", "title": "Title", "required": true },
        { "name": "image", "type": "image", "title": "Background image" },
        {
          "name": "cta",
          "type": "group",
          "title": "Call to action",
          "fields": [
            { "name": "label", "type": "string" },
            { "name": "href", "type": "url" }
          ]
        }
      ]
    }
  }
]
```

## Section fields

| field | required | notes |
|---|---|---|
| `name` | yes | Display name. |
| `description` | yes | One or two sentences. |
| `preview` | yes | Path under `public/`, e.g. `previews/2026-05-08_acme/hero.png`. |
| `layout.language` | yes | Code language for the layout sample (e.g. `tsx`, `jsx`, `astro`, `vue`). |
| `layout.code` | yes | Reference layout the implementer can copy. |
| `schema.fields` | yes | Array of fields. Use `type: "group"` (with nested `fields`) for grouped fields. |
| `slug` | no | Auto-generated from `<project>-<name>` if omitted. Set explicitly only to disambiguate or keep a stable URL. |
| `tags` | no | Free-form. |
| `categories` | no | E.g. `landing`, `pricing`, `blog`. |
| `effects` | no | E.g. `parallax-scroll`, `fade-in`. |
| `cmsTarget` | no | The CMS the section was originally built for (`payload`, `sanity`, `storyblok`, etc.). Defaults the prompt's target CMS. |
| `testPageUrl` | no | Live URL where the section can be previewed once the project is published. |
| `promptOverride` | no | Custom Claude prompt. If unset, the prompt is auto-generated from the data above. |

## Preview images

Drop screenshots in `public/previews/<date>_<project>/<filename>.png`. Reference them in the JSON by their path under `public/` (e.g. `previews/2026-05-08_acme-store/hero-banner.png`).

PNG and SVG both work. Aim for ~1600×900; oversized assets bloat the bundle.

## Schema field types

Reusing Sanity-style names: `string`, `text`, `number`, `boolean`, `url`, `image`, `richText`, `reference`, `select` (with `options`), `array` (with `of`), `group` (with nested `fields`), `object` (with nested `fields`).
