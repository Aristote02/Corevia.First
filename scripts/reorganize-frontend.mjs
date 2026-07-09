import fs from "node:fs";
import path from "node:path";

const srcRoot = "C:/Corevia.First/src/frontend/Corevia.First.Web/src";

function move(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

function moveDir(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return;
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) moveDir(from, to);
    else move(from, to);
  }
  fs.rmdirSync(fromDir, { recursive: true });
}

const assetsRoot = path.join(srcRoot, "assets");

// components
moveDir(path.join(assetsRoot, "admin"), path.join(srcRoot, "components/admin"));
if (fs.existsSync(path.join(assetsRoot, "admin", "site"))) {
  moveDir(path.join(assetsRoot, "admin", "site"), path.join(srcRoot, "components/site"));
}
if (fs.existsSync(path.join(assetsRoot, "admin", "ui"))) {
  moveDir(path.join(assetsRoot, "admin", "ui"), path.join(srcRoot, "components/ui"));
}

// lib (flatten misplaced api subfolder)
const libFrom = path.join(assetsRoot, "lib");
const libTo = path.join(srcRoot, "lib");
if (fs.existsSync(libFrom)) {
  for (const entry of fs.readdirSync(libFrom, { withFileTypes: true })) {
    const from = path.join(libFrom, entry.name);
    const to = path.join(libTo, entry.name);
    if (entry.isDirectory()) moveDir(from, to);
    else move(from, to);
  }
}

// hooks, routes, root src files
moveDir(path.join(assetsRoot, "hooks"), path.join(srcRoot, "hooks"));
moveDir(path.join(assetsRoot, "routes"), path.join(srcRoot, "routes"));

for (const file of ["router.tsx", "routeTree.gen.ts", "server.ts", "start.ts", "styles.css"]) {
  move(path.join(assetsRoot, file), path.join(srcRoot, file));
}

// Remove empty assets dir if only media placeholders remain
if (fs.existsSync(assetsRoot)) {
  fs.rmSync(assetsRoot, { recursive: true, force: true });
}

// Ensure asset folders exist
fs.mkdirSync(path.join(srcRoot, "assets/hero"), { recursive: true });
fs.mkdirSync(path.join(srcRoot, "assets/parallax"), { recursive: true });

console.log("Reorganized frontend src layout");
