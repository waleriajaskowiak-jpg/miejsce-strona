import type { APIRoute } from "astro";
import { IS_PROD } from "../lib/env.js";

export const GET: APIRoute = () => {
  const lines = ["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /dziekujemy/"];
  if (IS_PROD) {
    lines.push("", "Sitemap: https://miejsce.to/sitemap.xml");
  }
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
