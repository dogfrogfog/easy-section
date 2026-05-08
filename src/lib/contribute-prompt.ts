import fs from "node:fs";
import path from "node:path";

export const REPO_FULL_NAME = "dogfrogfog/easy-section";

// Single source of truth: CONTRIBUTE_PROMPT.md at the repo root.
// Read at build time and bundled into the static page.
export const CONTRIBUTE_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "CONTRIBUTE_PROMPT.md"),
  "utf-8",
);
