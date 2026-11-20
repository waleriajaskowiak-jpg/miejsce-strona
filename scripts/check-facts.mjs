import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Rozstrzygnięte fakty nie mogą wrócić w starej formule.
// Nierozstrzygnięte (metraż Dużego Miejsca, ogród jako osobna przestrzeń)
// zostają tylko w fakty.json, którego ten skrypt nie skanuje.
const needles = [
  "130 osób",
  "do 130",
  "Od 2020",
  "od 2020",
  "parking dla gości",
  "parking dla ekipy",
  "10 minut od centrum",
  "10 min od centrum",
  "od 6 000",
  "od 12 000",
  "6 000 zł",
  "12 000 zł",
  "wiosna–lato",
  "NOWE MIEJSCE",
  "Nowe Miejsce",
  "NOWYM MIEJSCU",
  "Nowym Miejscu",
  "Nowego Miejsca",
  "52.2196114",
  "21.0473079",
  "także w deszczu",
  "także gdy pada",
  "także wtedy, gdy pada",
  "Premiery i wydarzenia specjalne",
];

async function files(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await files(path, out);
    else if (/\.(md|json|html|astro)$/.test(entry.name)) out.push(path);
  }
  return out;
}

const roots = ["src/content", "dist"];
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
  console.error(`Fakty do poprawy (${warnings.length}):`);
  console.error(warnings.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log("Fakty: brak ostrzeżeń");
