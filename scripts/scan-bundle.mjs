import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN = [
  { name: "OpenRouter API key", pattern: /sk-or-v1-[A-Za-z0-9]{8,}/ },
  { name: "system prompt", pattern: /Sos el gemelo digital|Reglas de respuesta/ },
];
const SCANNED = /\.(js|css|html|rsc|txt|json|map)$/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (SCANNED.test(path)) yield path;
  }
}

const roots = process.argv.slice(2);
if (roots.length === 0) {
  console.error("Usage: node scripts/scan-bundle.mjs <dir>...");
  process.exit(2);
}

const hits = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    for (const { name, pattern } of FORBIDDEN) {
      if (pattern.test(text)) hits.push(`${file}: ${name}`);
    }
  }
}

if (hits.length > 0) {
  console.error(`Forbidden content found:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`Scanned ${roots.join(", ")}: clean.`);
