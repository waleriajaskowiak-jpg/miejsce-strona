import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const lastmod = (value?: string) => (value ? `<lastmod>${value}</lastmod>` : "");

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL("https://miejsce.to")).origin;
  const staticPaths = [
    "/",
    "/przestrzenie/",
    "/eventy/",
    "/scenariusze/",
    "/ceny/",
    "/jedzenie-i-bar/",
    "/realizacje/",
    "/galeria/",
    "/warto-wiedziec/",
    "/poradnik/",
    "/kontakt/",
    "/mapa-strony/",
  ];
  const przestrzenie = (await getCollection("przestrzenie")).map((entry) => `/przestrzenie/${entry.id}/`);
  const kategorie = (await getCollection("kategorie"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => `/eventy/${entry.id}/`);
  const scenariusze = (await getCollection("scenariusze"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => `/scenariusze/${entry.id}/`);
  const realizacje = (await getCollection("realizacje"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => ({ path: `/realizacje/${entry.id}/`, date: entry.data.zaktualizowano }));
  const artykuly = (await getCollection("artykuly"))
    .filter((entry) => !entry.data.szkic)
    .map((entry) => ({ path: `/poradnik/${entry.id}/`, date: entry.data.zaktualizowano }));

  const urls = [
    ...staticPaths.map((path) => ({ path, date: undefined })),
    ...przestrzenie.map((path) => ({ path, date: undefined })),
    ...kategorie.map((path) => ({ path, date: undefined })),
    ...scenariusze.map((path) => ({ path, date: undefined })),
    ...realizacje,
    ...artykuly,
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ path, date }) => `  <url><loc>${origin}${path}</loc>${lastmod(date)}</url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
