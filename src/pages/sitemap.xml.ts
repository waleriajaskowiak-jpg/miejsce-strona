import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL("https://miejsce.to")).origin;
  const staticPaths = [
    "/",
    "/przestrzenie/",
    "/eventy/",
    "/ceny/",
    "/jedzenie-i-bar/",
    "/realizacje/",
    "/warto-wiedziec/",
    "/poradnik/",
    "/kontakt/",
  ];
  const przestrzenie = (await getCollection("przestrzenie")).map((entry) => `/przestrzenie/${entry.id}/`);
  const eventy = (await getCollection("eventy")).map((entry) => `/eventy/${entry.id}/`);
  const realizacje = (await getCollection("realizacje"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => `/realizacje/${entry.id}/`);
  const artykuly = (await getCollection("artykuly"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => `/poradnik/${entry.id}/`);

  const urls = [...staticPaths, ...przestrzenie, ...eventy, ...realizacje, ...artykuly];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
