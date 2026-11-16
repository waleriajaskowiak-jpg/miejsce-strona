import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const needles = ["130 os", "2015", "2020", "parking dla gości", "kontener", "10 minut", "10 min", "Małe Miejsce"];

async function files(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await files(path, out);
    else if (/\.(md|json|html|astro)$/.test(entry.name)) out.push(path);
  }
  return out;
}

const roots = ["src/content", "dist"].filter(Boolean);
const warnings = [];
for (const root of roots) {
  let list = [];
  try {
    list = await files(root);
  } catch {
    continue;
  }
  for (const file of list) {
    if (file.endsWith("fakty.json")) continue;
    const text = await readFile(file, "utf8");
    for (const needle of needles) {
      if (text.includes(needle)) warnings.push(`${file}: „${needle}”`);
    }
    if (text.includes("[[DO UZUPEŁNIENIA") && root === "dist" && !text.includes("noindex")) {
      warnings.push(`${file}: placeholder na stronie indeksowalnej`);
    }
  }
}

if (warnings.length) {
  console.warn(`Fakty do potwierdzenia (${warnings.length}):`);
  console.warn(warnings.slice(0, 40).join("\n"));
} else {
  console.log("Fakty: brak ostrzeżeń");
}
