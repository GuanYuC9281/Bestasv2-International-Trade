const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "local-version");
const target = path.join(root, "build");

if (!fs.existsSync(source)) {
  console.error(`Missing static source directory: ${path.relative(root, source)}`);
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log(`Static site copied from ${path.relative(root, source)} to ${path.relative(root, target)}.`);
