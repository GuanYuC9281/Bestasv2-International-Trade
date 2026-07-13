const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteRoot = path.join(root, "local-version");
const languageDirs = ["zh", "en", "vi", "jp"];
const htmlRoots = languageDirs.map((lang) => path.join(siteRoot, lang));

const attrPattern = /\b(href|src|poster|data-src|data-background|data-gallery|action|content|srcset)\s*=\s*(["'])([\s\S]*?)\2/gi;
const cssUrlPattern = /url\(([^)]*)\)/gi;

function walk(dir, predicate, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r\n|\r|\n/).length;
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function isIgnored(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) return true;
  return /^(https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(trimmed);
}

function stripUrlParts(value) {
  let target = decodeHtmlEntities(value.trim());
  const hashIndex = target.indexOf("#");
  if (hashIndex !== -1) target = target.slice(0, hashIndex);
  const queryIndex = target.indexOf("?");
  if (queryIndex !== -1) target = target.slice(0, queryIndex);
  return target;
}

function candidatePath(fromFile, value) {
  if (isIgnored(value)) return null;
  let target = stripUrlParts(value);
  if (!target) return null;

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)) return null;

  let resolved;
  if (target.startsWith("/")) {
    resolved = path.join(siteRoot, target.replace(/^\/+/, ""));
  } else {
    resolved = path.resolve(path.dirname(fromFile), target);
  }

  if (target.endsWith("/") || (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory())) {
    resolved = path.join(resolved, "index.html");
  }

  return resolved;
}

function existsCaseInsensitive(resolved) {
  if (fs.existsSync(resolved)) return true;
  return false;
}

function checkOne(fromFile, rawValue, line, issues) {
  const resolved = candidatePath(fromFile, rawValue);
  if (!resolved) return;

  if (!resolved.startsWith(siteRoot)) {
    return;
  }

  if (!existsCaseInsensitive(resolved)) {
    issues.push({
      file: path.relative(root, fromFile),
      line,
      value: rawValue,
      resolved: path.relative(root, resolved),
    });
  }
}

function checkSrcset(fromFile, value, line, issues) {
  for (const part of value.split(",")) {
    const candidate = part.trim().split(/\s+/)[0];
    if (candidate) checkOne(fromFile, candidate, line, issues);
  }
}

function checkGallery(fromFile, value, line, issues) {
  for (const candidate of value.split("|")) {
    if (candidate.trim()) checkOne(fromFile, candidate.trim(), line, issues);
  }
}

function stripCssQuotes(value) {
  let target = decodeHtmlEntities(value.trim());
  if ((target.startsWith("'") && target.endsWith("'")) || (target.startsWith('"') && target.endsWith('"'))) {
    target = target.slice(1, -1);
  }
  return target;
}

function checkHtmlFile(file, issues) {
  const text = fs.readFileSync(file, "utf8");
  const scanText = text.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (_match, open, body, close) => {
    return open + body.replace(/[^\r\n]/g, " ") + close;
  });
  let match;
  attrPattern.lastIndex = 0;
  while ((match = attrPattern.exec(scanText))) {
    if (match.index > 0 && /[.\w-]/.test(text[match.index - 1])) {
      continue;
    }

    const name = match[1].toLowerCase();
    const value = match[3];
    const line = lineNumberAt(scanText, match.index);

    if (name === "content" && !/(^|\/)(images|css|js)\/|\.html($|[?#])|\.(png|jpe?g|gif|webp|svg|ico|css|js)($|[?#])/i.test(value)) {
      continue;
    }

    if (name === "srcset") {
      checkSrcset(file, value, line, issues);
    } else if (name === "data-gallery") {
      checkGallery(file, value, line, issues);
    } else {
      checkOne(file, value, line, issues);
    }
  }

  cssUrlPattern.lastIndex = 0;
  while ((match = cssUrlPattern.exec(scanText))) {
    checkOne(file, stripCssQuotes(match[1]), lineNumberAt(scanText, match.index), issues);
  }
}

function main() {
  const htmlFiles = htmlRoots.flatMap((dir) => walk(dir, (file) => file.toLowerCase().endsWith(".html")));
  const issues = [];

  for (const file of htmlFiles) {
    checkHtmlFile(file, issues);
  }

  if (issues.length) {
    console.error(`Found ${issues.length} broken local link(s):`);
    for (const issue of issues) {
      console.error(`${issue.file}:${issue.line} -> ${issue.value} (resolved: ${issue.resolved})`);
    }
    process.exit(1);
  }

  console.log(`Local link check passed for ${htmlFiles.length} HTML files.`);
}

main();
