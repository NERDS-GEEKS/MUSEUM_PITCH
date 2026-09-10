import fs from "node:fs";
import path from "node:path";

const htmlPath = path.join("dist", "index.html");
if (!fs.existsSync(htmlPath)) {
  console.error("Missing dist/index.html — publish directory must be dist");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const match = html.match(/\/assets\/[^"']+\.js/);
if (!match) {
  console.error("No /assets/*.js reference in dist/index.html");
  process.exit(1);
}

const assetPath = path.join("dist", match[0].replace(/^\//, ""));
if (!fs.existsSync(assetPath)) {
  console.error("Missing built asset:", assetPath);
  process.exit(1);
}

/**
 * Static hosts often 404 on /privacy and /terms unless a real file exists.
 * Copy the SPA shell into those paths (and 404.html) so React Router can run.
 */
const spaShellCopies = [
  path.join("dist", "404.html"),
  path.join("dist", "blog.html"),
  path.join("dist", "privacy.html"),
  path.join("dist", "terms.html"),
  path.join("dist", "blog", "index.html"),
  path.join("dist", "privacy", "index.html"),
  path.join("dist", "terms", "index.html"),
];

for (const target of spaShellCopies) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(htmlPath, target);
}

console.log("OK", match[0]);
console.log(
  "OK SPA shells:",
  spaShellCopies.map((p) => path.relative("dist", p).replaceAll("\\", "/")).join(", "),
);
