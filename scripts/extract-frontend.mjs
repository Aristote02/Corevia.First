import fs from "node:fs";
import path from "node:path";

const transcriptPath =
  "C:/Users/User/.cursor/projects/c-Corevia-First/agent-transcripts/8bdc85d7-b5f0-447c-9970-a2de9835163a/8bdc85d7-b5f0-447c-9970-a2de9835163a.jsonl";
const outRoot = "C:/Corevia.First/src/frontend/Corevia.First.Web";

const line = fs.readFileSync(transcriptPath, "utf8").split(/\r?\n/)[119];
const parsed = JSON.parse(line);
const text = parsed.message.content[0].text;
const marker = "THE FRONTEND STRUCTURE AND CODE";
const content = text.slice(text.indexOf(marker));

const headerRe = /^(\s*)- ([^\r\n]+)$/gm;
const matches = [...content.matchAll(headerRe)];

function cleanName(name) {
  return name.replace(/\s*\(.*$/, "").trim().replace(/^__root,tsx$/, "__root.tsx");
}

function isMediaOrAssetListing(name) {
  const clean = cleanName(name);
  return /\.(jpe?g|png|gif|webp|mp4|ico|svg)$/i.test(clean);
}

function isFile(name) {
  const clean = cleanName(name);
  if (isMediaOrAssetListing(clean)) return false;
  if (/\.(tsx?|css|js|md)$/.test(clean)) return true;
  if (/\.(json|toml|lock)$/.test(clean) && !clean.includes("/")) return true;
  if ([".prettierrc", ".prettierignore", "bun.lock", "eslint.config.js", "components.json"].includes(clean)) return true;
  return false;
}

const stack = [];
const written = [];

for (let i = 0; i < matches.length; i++) {
  const m = matches[i];
  const indent = m[1].length;
  const rawName = m[2];
  const name = cleanName(rawName);

  while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
    stack.pop();
  }

  if (isMediaOrAssetListing(rawName)) {
    continue;
  }

  if (!isFile(rawName)) {
    stack.push({ indent, name });
    continue;
  }

  let relPath;
  if (name === "gitignore") {
    relPath = ".gitignore";
  } else if (name.startsWith(".")) {
    relPath = name;
  } else if (stack.length > 0 && stack[0].name === "src") {
    relPath = [...stack.map((s) => s.name), name].join("/");
  } else if (stack.length === 0) {
    relPath = name;
  } else {
    relPath = [...stack.map((s) => s.name), name].join("/");
  }

  const contentStart = m.index + m[0].length + (content[m.index + m[0].length] === "\r" ? 1 : 0) + 1;
  const contentEnd = i + 1 < matches.length ? matches[i + 1].index : content.length;
  let fileContent = content.slice(contentStart, contentEnd).replace(/\s+$/, "");

  const outPath = path.join(outRoot, relPath.replace(/\//g, path.sep));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fileContent, "utf8");
  written.push(relPath);
}

console.log(`Wrote ${written.length} files`);
for (const f of written) console.log(`  ${f}`);
