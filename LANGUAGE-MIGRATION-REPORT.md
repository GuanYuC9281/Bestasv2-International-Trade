# Language Folder Migration Report

## Summary

- Reorganized `local-version/` from filename-based language variants to folder-based language URLs.
- Created `local-version/zh/`, `local-version/en/`, `local-version/vn/`, and `local-version/jp/`.
- Replaced root `local-version/index.html` with a redirect page that sends visitors to `./zh/`.
- Updated local asset paths, same-language page links, language-switch URLs, `html lang`, canonical tags, and hreflang tags.
- Added `_redirects` and `redirect-mapping.txt` for old URL compatibility.
- Added `scripts/check-local-links.js` for local link validation.

## Language Folders

- `local-version/zh/`
- `local-version/en/`
- `local-version/vn/`
- `local-version/jp/`

## Moved HTML Count

- Total moved HTML files: 100
- Traditional Chinese pages: 25
- English pages: 25
- Vietnamese pages: 25
- Japanese pages: 25

## Old File To New Location Mapping

| Old file | New location |
| --- | --- |
| `local-version/about.html` | `local-version/zh/about.html` |
| `local-version/about-en.html` | `local-version/en/about.html` |
| `local-version/about-vn.html` | `local-version/vn/about.html` |
| `local-version/about-jp.html` | `local-version/jp/about.html` |
| `local-version/chemical-gas-treatment.html` | `local-version/zh/chemical-gas-treatment.html` |
| `local-version/chemical-gas-treatment-en.html` | `local-version/en/chemical-gas-treatment.html` |
| `local-version/chemical-gas-treatment-vn.html` | `local-version/vn/chemical-gas-treatment.html` |
| `local-version/chemical-gas-treatment-jp.html` | `local-version/jp/chemical-gas-treatment.html` |
| `local-version/chemical-industry-solution.html` | `local-version/zh/chemical-industry-solution.html` |
| `local-version/chemical-industry-solution-en.html` | `local-version/en/chemical-industry-solution.html` |
| `local-version/chemical-industry-solution-vn.html` | `local-version/vn/chemical-industry-solution.html` |
| `local-version/chemical-industry-solution-jp.html` | `local-version/jp/chemical-industry-solution.html` |
| `local-version/chemical-plant-solution.html` | `local-version/zh/chemical-plant-solution.html` |
| `local-version/chemical-plant-solution-en.html` | `local-version/en/chemical-plant-solution.html` |
| `local-version/chemical-plant-solution-vn.html` | `local-version/vn/chemical-plant-solution.html` |
| `local-version/chemical-plant-solution-jp.html` | `local-version/jp/chemical-plant-solution.html` |
| `local-version/collector-solution.html` | `local-version/zh/collector-solution.html` |
| `local-version/collector-solution-en.html` | `local-version/en/collector-solution.html` |
| `local-version/collector-solution-vn.html` | `local-version/vn/collector-solution.html` |
| `local-version/collector-solution-jp.html` | `local-version/jp/collector-solution.html` |
| `local-version/contact.html` | `local-version/zh/contact.html` |
| `local-version/contact-en.html` | `local-version/en/contact.html` |
| `local-version/contact-vn.html` | `local-version/vn/contact.html` |
| `local-version/contact-jp.html` | `local-version/jp/contact.html` |
| `local-version/contact-success.html` | `local-version/zh/contact-success.html` |
| `local-version/contact-success-en.html` | `local-version/en/contact-success.html` |
| `local-version/contact-success-vn.html` | `local-version/vn/contact-success.html` |
| `local-version/contact-success-jp.html` | `local-version/jp/contact-success.html` |
| `local-version/custom-parts-solution.html` | `local-version/zh/custom-parts-solution.html` |
| `local-version/custom-parts-solution-en.html` | `local-version/en/custom-parts-solution.html` |
| `local-version/custom-parts-solution-vn.html` | `local-version/vn/custom-parts-solution.html` |
| `local-version/custom-parts-solution-jp.html` | `local-version/jp/custom-parts-solution.html` |
| `local-version/duct-solution.html` | `local-version/zh/duct-solution.html` |
| `local-version/duct-solution-en.html` | `local-version/en/duct-solution.html` |
| `local-version/duct-solution-vn.html` | `local-version/vn/duct-solution.html` |
| `local-version/duct-solution-jp.html` | `local-version/jp/duct-solution.html` |
| `local-version/electronic-industry-solution.html` | `local-version/zh/electronic-industry-solution.html` |
| `local-version/electronic-industry-solution-en.html` | `local-version/en/electronic-industry-solution.html` |
| `local-version/electronic-industry-solution-vn.html` | `local-version/vn/electronic-industry-solution.html` |
| `local-version/electronic-industry-solution-jp.html` | `local-version/jp/electronic-industry-solution.html` |
| `local-version/electrostatic-oil-smoke.html` | `local-version/zh/electrostatic-oil-smoke.html` |
| `local-version/electrostatic-oil-smoke-en.html` | `local-version/en/electrostatic-oil-smoke.html` |
| `local-version/electrostatic-oil-smoke-vn.html` | `local-version/vn/electrostatic-oil-smoke.html` |
| `local-version/electrostatic-oil-smoke-jp.html` | `local-version/jp/electrostatic-oil-smoke.html` |
| `local-version/fan-solution.html` | `local-version/zh/fan-solution.html` |
| `local-version/fan-solution-en.html` | `local-version/en/fan-solution.html` |
| `local-version/fan-solution-vn.html` | `local-version/vn/fan-solution.html` |
| `local-version/fan-solution-jp.html` | `local-version/jp/fan-solution.html` |
| `local-version/faq.html` | `local-version/zh/faq.html` |
| `local-version/faq-en.html` | `local-version/en/faq.html` |
| `local-version/faq-vn.html` | `local-version/vn/faq.html` |
| `local-version/faq-jp.html` | `local-version/jp/faq.html` |
| `local-version/filter-solution.html` | `local-version/zh/filter-solution.html` |
| `local-version/filter-solution-en.html` | `local-version/en/filter-solution.html` |
| `local-version/filter-solution-vn.html` | `local-version/vn/filter-solution.html` |
| `local-version/filter-solution-jp.html` | `local-version/jp/filter-solution.html` |
| `local-version/food-processing-industry-solution.html` | `local-version/zh/food-processing-industry-solution.html` |
| `local-version/food-processing-industry-solution-en.html` | `local-version/en/food-processing-industry-solution.html` |
| `local-version/food-processing-industry-solution-vn.html` | `local-version/vn/food-processing-industry-solution.html` |
| `local-version/food-processing-industry-solution-jp.html` | `local-version/jp/food-processing-industry-solution.html` |
| `local-version/index.html` | `local-version/zh/index.html` |
| `local-version/index-en.html` | `local-version/en/index.html` |
| `local-version/index-vn.html` | `local-version/vn/index.html` |
| `local-version/index-jp.html` | `local-version/jp/index.html` |
| `local-version/kitchen-exhaust-solution.html` | `local-version/zh/kitchen-exhaust-solution.html` |
| `local-version/kitchen-exhaust-solution-en.html` | `local-version/en/kitchen-exhaust-solution.html` |
| `local-version/kitchen-exhaust-solution-vn.html` | `local-version/vn/kitchen-exhaust-solution.html` |
| `local-version/kitchen-exhaust-solution-jp.html` | `local-version/jp/kitchen-exhaust-solution.html` |
| `local-version/metal-industry-solution.html` | `local-version/zh/metal-industry-solution.html` |
| `local-version/metal-industry-solution-en.html` | `local-version/en/metal-industry-solution.html` |
| `local-version/metal-industry-solution-vn.html` | `local-version/vn/metal-industry-solution.html` |
| `local-version/metal-industry-solution-jp.html` | `local-version/jp/metal-industry-solution.html` |
| `local-version/oil-smoke-treatment.html` | `local-version/zh/oil-smoke-treatment.html` |
| `local-version/oil-smoke-treatment-en.html` | `local-version/en/oil-smoke-treatment.html` |
| `local-version/oil-smoke-treatment-vn.html` | `local-version/vn/oil-smoke-treatment.html` |
| `local-version/oil-smoke-treatment-jp.html` | `local-version/jp/oil-smoke-treatment.html` |
| `local-version/paint-dust-treatment.html` | `local-version/zh/paint-dust-treatment.html` |
| `local-version/paint-dust-treatment-en.html` | `local-version/en/paint-dust-treatment.html` |
| `local-version/paint-dust-treatment-vn.html` | `local-version/vn/paint-dust-treatment.html` |
| `local-version/paint-dust-treatment-jp.html` | `local-version/jp/paint-dust-treatment.html` |
| `local-version/plastic-rubber-industry-solution.html` | `local-version/zh/plastic-rubber-industry-solution.html` |
| `local-version/plastic-rubber-industry-solution-en.html` | `local-version/en/plastic-rubber-industry-solution.html` |
| `local-version/plastic-rubber-industry-solution-vn.html` | `local-version/vn/plastic-rubber-industry-solution.html` |
| `local-version/plastic-rubber-industry-solution-jp.html` | `local-version/jp/plastic-rubber-industry-solution.html` |
| `local-version/privacy-policy.html` | `local-version/zh/privacy-policy.html` |
| `local-version/privacy-policy-en.html` | `local-version/en/privacy-policy.html` |
| `local-version/privacy-policy-vn.html` | `local-version/vn/privacy-policy.html` |
| `local-version/privacy-policy-jp.html` | `local-version/jp/privacy-policy.html` |
| `local-version/product.html` | `local-version/zh/product.html` |
| `local-version/product-en.html` | `local-version/en/product.html` |
| `local-version/product-vn.html` | `local-version/vn/product.html` |
| `local-version/product-jp.html` | `local-version/jp/product.html` |
| `local-version/services.html` | `local-version/zh/services.html` |
| `local-version/services-en.html` | `local-version/en/services.html` |
| `local-version/services-vn.html` | `local-version/vn/services.html` |
| `local-version/services-jp.html` | `local-version/jp/services.html` |
| `local-version/spray-equipment.html` | `local-version/zh/spray-equipment.html` |
| `local-version/spray-equipment-en.html` | `local-version/en/spray-equipment.html` |
| `local-version/spray-equipment-vn.html` | `local-version/vn/spray-equipment.html` |
| `local-version/spray-equipment-jp.html` | `local-version/jp/spray-equipment.html` |

## Missing Language Versions

- None found. Every current page slug exists in `zh`, `en`, `vn`, and `jp`.

## Language Switch Fallbacks

- None required. Language switch links can target the same page in every language.

## Filename Conflicts

- No target filename conflicts were found before moving files.
- No HTML page was overwritten.

## Invalid Links

- `scripts/check-local-links.js` passed for 100 HTML files, 2 shared CSS files, and 8 shared JS files.
- One broken product image path was found during validation and fixed:
  - `../images/products/equipment/inline-fan.png`
  - changed to `../images/products/fans/inline-fan.jpg`
- One loader logo path was found during strict QA and fixed:
  - `images/company/logo.png`
  - changed to `../images/company/logo.png`

## JavaScript Path Updates

- Updated `local-version/language-router.js` to use folder-based language URLs:
  - `../zh/`
  - `../en/`
  - `../vn/`
  - `../jp/`
- Updated inline homepage language maps in:
  - `local-version/zh/index.html`
  - `local-version/en/index.html`
  - `local-version/vn/index.html`
  - `local-version/jp/index.html`
- Removed old `*-en.html`, `*-vn.html`, and `*-jp.html` targets from production HTML/CSS/JS.

## Redirect Files

- Created `local-version/_redirects` with 100 old-to-new 301 redirect rules.
- Created `local-version/redirect-mapping.txt` with the same mapping for deployment platforms that do not support `_redirects`.

## Tested URLs

Static-server HTTP checks returned 200 for:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/zh/`
- `http://127.0.0.1:8000/en/`
- `http://127.0.0.1:8000/vn/`
- `http://127.0.0.1:8000/jp/`
- `http://127.0.0.1:8000/zh/faq.html`
- `http://127.0.0.1:8000/en/faq.html`
- `http://127.0.0.1:8000/vn/faq.html`
- `http://127.0.0.1:8000/jp/faq.html`
- `http://127.0.0.1:8000/zh/fan-solution.html`
- `http://127.0.0.1:8000/en/fan-solution.html`
- `http://127.0.0.1:8000/vn/fan-solution.html`
- `http://127.0.0.1:8000/jp/fan-solution.html`

Browser checks completed:

- Root `/` redirects to `/zh/`.
- `/en/faq.html` loads with CSS, scripts, logo image, `lang="en"`, canonical, and hreflang tags.
- Mobile menu language switching from `/en/faq.html` to `/jp/faq.html` works and loads `lang="ja"`.
- Console showed only the existing Tailwind CDN production warning; no new 404 or migration-related console error was observed.

## Items Not Fully Auto-Verified

- A full visual regression comparison against the old flat-file URLs was not run.
- Desktop language dropdown click automation was limited by hover/visibility behavior in the browser automation environment. The same-page language URLs are present in the DOM and mobile language switching was verified by an actual browser click.
- Production deployment `_redirects` behavior was not tested against the final hosting platform.

## How To Run The Link Checker

```bash
node scripts/check-local-links.js
```

Expected success output:

```text
Local link check passed for 100 HTML files, 2 shared CSS files, and 8 shared JS files.
```

## How To Restore Or Revert

- Before the migration commit is merged, switch back to `master` to leave this branch unchanged.
- After the migration commit exists, revert it with:

```bash
git revert <migration-commit-sha>
```
