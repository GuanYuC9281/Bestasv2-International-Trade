const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const site = path.resolve(__dirname, '../local-version');
const languages = { zh: 'zh-TW', en: 'en', vn: 'vi', jp: 'ja' };
const canonical = (lang, file, vietnamHost = false) =>
  `https://bestasv.${vietnamHost && lang === 'vn' ? 'vn' : 'com'}/${lang}/${file === 'index.html' ? '' : file}`;
let pageCount = 0;

// Check both the .com HTML and the Vietnam-host rewrite output.
for (const folder of ['zh', 'en', 'vn', 'jp', '__vn/vn']) {
  const lang = folder.split('/').pop();
  const vietnamHost = folder.startsWith('__vn/');
  for (const file of fs.readdirSync(path.join(site, folder)).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(site, folder, file), 'utf8');
    const label = `${folder}/${file}`;
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
    assert.equal(canonicals.length, 1, `${label}: exactly one canonical`);
    assert.equal(canonicals[0][1], canonical(lang, file, vietnamHost), `${label}: preferred domain`);
    const alternates = new Map([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(match => [match[1], match[2]]));
    if (vietnamHost) {
      assert.equal(alternates.size, 0, `${label}: local site is outside the global translation cluster`);
    } else {
      for (const [targetLang, hreflang] of Object.entries(languages)) {
        assert.equal(alternates.get(hreflang), canonical(targetLang, file), `${label}: reciprocal ${hreflang} alternate`);
      }
    }
    assert.ok(html.includes(`<html lang="${languages[lang]}"`), `${label}: correct document language`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(match[1]);
      if (lang === 'vn') {
        for (const node of data['@graph'] || [data]) {
          if (node['@type'] === 'WebPage') assert.equal(node.url, canonical(lang, file, vietnamHost), `${label}: schema page URL`);
        }
      }
    }
    pageCount++;
  }
}

let sitemapCount = 0;
for (const sitemap of ['sitemap.xml', 'sitemap-vn.xml']) {
  const xml = fs.readFileSync(path.join(site, sitemap), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length, `${sitemap}: no duplicate entries`);
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.host, sitemap === 'sitemap-vn.xml' ? 'bestasv.vn' : 'bestasv.com');
    // The existing global root is a language entry/redirect page.
    if (parsed.pathname === '/') continue;
    const [, lang, name] = parsed.pathname.split('/');
    const file = name || 'index.html';
    assert.equal(url, canonical(lang, file, sitemap === 'sitemap-vn.xml'), `${sitemap}: canonical entry`);
    assert.ok(fs.existsSync(path.join(site, lang, file)), `${sitemap}: page exists`);
    sitemapCount++;
  }
  if (sitemap === 'sitemap-vn.xml') {
    for (const file of ['index.html', 'about.html', 'contact.html']) {
      assert.ok(urls.includes(canonical('vn', file, true)), `Vietnam sitemap includes ${file}`);
    }
  }
}
for (const file of ['index.html', 'about.html', 'contact.html']) {
  const local = fs.readFileSync(path.join(site, '__vn/vn', file), 'utf8');
  const global = fs.readFileSync(path.join(site, 'vn', file), 'utf8');
  const mainText = html => html.split('<!-- Hero Section -->')[1].split('<!-- Footer -->')[0]
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.notEqual(mainText(local), mainText(global), `${file}: independent primary content`);
  assert.ok(mainText(local).includes('0318644214'), `${file}: visible company identity`);
  assert.equal((local.match(/<h1[ >]/g) || []).length, 1, `${file}: one primary heading`);
  const graph = JSON.parse(local.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(node => node['@type'] === 'Organization').taxID, '0318644214');
}

for (const configFile of ['vercel.json', 'local-version/vercel.json']) {
  const config = JSON.parse(fs.readFileSync(path.resolve(site, '..', configFile), 'utf8'));
  const matches = (route, pathname, host) => route.src && new RegExp(`^${route.src}$`).test(pathname)
    && (route.has || []).every(condition => condition.type === 'host' && new RegExp(`^${condition.value}$`).test(host));
  for (const host of ['bestasv.vn', 'www.bestasv.vn']) {
    assert.equal(config.routes.find(route => matches(route, '/vn/', host)).dest, '/__vn/vn/index.html');
    assert.equal(config.routes.find(route => matches(route, '/robots.txt', host)).dest, '/robots-vn.txt');
    assert.equal(config.routes.find(route => matches(route, '/sitemap.xml', host)).dest, '/sitemap-vn.xml');
  }
  for (const pathname of ['/vn/', '/robots.txt', '/sitemap.xml']) {
    assert.equal(config.routes.find(route => matches(route, pathname, 'bestasv.com')), undefined, `${configFile}: global files remain direct`);
  }
}
assert.ok(!fs.readFileSync(path.join(site, 'robots.txt'), 'utf8').includes('Sitemap: https://bestasv.vn'));
assert.ok(!fs.readFileSync(path.join(site, 'robots-vn.txt'), 'utf8').includes('Sitemap: https://bestasv.com'));
console.log(`SEO checks passed: ${pageCount} pages, ${sitemapCount} sitemap entries, independent company content and host routing.`);
