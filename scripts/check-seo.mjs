import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function htmlFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(path, out);
    else if (entry.name.endsWith(".html") && !path.includes("/admin/")) out.push(path);
  }
  return out;
}

const files = await htmlFiles("dist");
const titles = new Map();
const descriptions = new Map();
const errors = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() || "";
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() || "";
  const h1 = [...html.matchAll(/<h1[\s>]/g)].length;
  const image = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] || "";
  if (!title) errors.push(`${file}: brak tytułu`);
  if (title.length > 65) errors.push(`${file}: tytuł ma ${title.length} znaków (${title})`);
  if (!description) errors.push(`${file}: brak opisu`);
  if (description.length > 160) errors.push(`${file}: opis ma ${description.length} znaków`);
  if (titles.has(title)) errors.push(`${file}: zdublowany tytuł „${title}”`);
  else titles.set(title, file);
  if (descriptions.has(description)) errors.push(`${file}: zdublowany opis`);
  else descriptions.set(description, file);
  if (h1 !== 1) errors.push(`${file}: H1 = ${h1}`);
  if (!image) errors.push(`${file}: brak og:image`);
  if (canonical.includes("?")) errors.push(`${file}: canonical ma query`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      errors.push(`${file}: JSON-LD ${error.message}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`SEO OK, stron: ${files.length}`);
