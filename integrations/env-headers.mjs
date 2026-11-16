import { writeFile } from "node:fs/promises";

export function envHeaders() {
  return {
    name: "env-headers",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        if (process.env.SITE_ENV === "production") return;
        const file = new URL("_headers", dir);
        await writeFile(file, "/*\n  X-Robots-Tag: noindex, nofollow\n");
      },
    },
  };
}
