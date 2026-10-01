// Compare with the commit that was live before a brand SEO release.
// Usage: node scripts/check-seo-structure.js <baseline-commit>
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const baseline = process.argv[2];
assert.ok(baseline, 'Provide the pre-release commit to compare against.');
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const baseCommit = git(['rev-parse', '--verify', `${baseline}^{commit}`]).trim();
const files = git(['ls-tree', '-r', '-z', '--name-only', baseCommit, 'local-version']).split('\0').filter(Boolean);
let pages = 0;
const normalized = text => text.replace(/\r\n/g, '\n');
function body(html) {
  return normalized(html.match(/<body\b[^>]*>[\s\S]*?<\/body>/i)?.[0] || '')
    .replace(/<!-- Brand and official websites -->\s*<section class="brand-profile"[\s\S]*?<\/section>/, '')
    .replace(/alt="(?:\?+|貝達國際貿易有限公司)"/g, 'alt="BRAND"');
}
for (const file of files) {
  const currentFile = path.join(root, file);
  assert.ok(fs.existsSync(currentFile), `Existing asset or page removed: ${file}`);
  if (!/\.(html|css|js)$/.test(file)) continue;
  const before = git(['show', `${baseCommit}:${file}`]);
  const after = fs.readFileSync(currentFile, 'utf8');
  if (!file.endsWith('.html')) {
    assert.equal(normalized(after), normalized(before), `${file}: shared behavior/styles changed`);
    continue;
  }
  const beforeBody = body(before);
  const afterBody = body(after);
  const scripts = html => [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
  assert.deepEqual(scripts(afterBody), scripts(beforeBody), `${file}: page scripts changed`);
  const tags = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '').match(/<\/?[a-zA-Z][^>]*>/g) || [];
  // Includes existing IDs, links, anchor destinations, classes, forms and handlers.
  assert.deepEqual(tags(afterBody), tags(beforeBody), `${file}: existing page structure changed`);
  pages++;
}
for (const file of ['vercel.json', 'local-version/vercel.json']) {
  const before = JSON.parse(git(['show', `${baseCommit}:${file}`]));
  const after = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  assert.deepEqual(after.routes.slice(2), before.routes, `${file}: existing routing changed`);
  assert.deepEqual({ ...after, routes: [] }, { ...before, routes: [] }, `${file}: other deployment settings changed`);
}
console.log(`Structure preserved against ${baseCommit.slice(0, 7)}: ${pages} HTML pages; existing assets, scripts, navigation, forms and routes unchanged.`);
