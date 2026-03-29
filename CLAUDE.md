# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A Jekyll 4.3 static site for **TrustCare Support** — an NDIS community nursing provider. Hosted on Netlify, with Decap CMS for content editing. Every push to `main` auto-deploys via Netlify.

- Live site: `https://trustcaresupport.com.au`
- GitHub: `github.com/abassaj89-eng/TrustCare_NursingServices`
- CMS admin: `https://trustcaresupport.com.au/admin`

## Local development

**Prerequisites:** Ruby 3.2.0, Bundler

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Build only (mirrors Netlify):
```bash
bundle exec jekyll build   # outputs to _site/
```

Always pull before pushing — Decap CMS commits directly to GitHub:
```bash
git pull origin main --rebase
git push origin main
```

## Architecture

### Single-page "wizard" layout

The entire site is **one HTML file** (`index.html`). Each section (Home, Services, About, Contact, etc.) is a `<div class="wizard-page">` hidden with `display: none` / `aria-hidden`. JavaScript swaps visibility on nav clicks — no actual page navigation occurs and the URL never changes.

### Data-driven content

All editable content lives in `_data/*.yml`. Jekyll injects it via Liquid tags (e.g. `{{ site.data.about.story_para1 }}`). The four service groups (`services_a`–`services_d`), team, board, high-intensity supports, and all five legal pages are driven entirely by YAML — the HTML structure in `index.html` should not need changing when content changes.

### Collections

- `_posts/` — blog articles (rendered via `_layouts/post.html`, dated slugs)
- `_jobs/` — job listings (front matter only, `output: false`, rendered via Liquid loop in `index.html`)

### CMS

`admin/config.yml` defines every editable field for Decap CMS. Changes made in the CMS are committed to GitHub as YAML/Markdown edits, which trigger a Netlify rebuild.

### Forms

Five Formspree endpoints are hardcoded in `index.html`. All forms include a `_gotcha` honeypot field. To change a form's destination email, update it in the Formspree dashboard — no code change needed.

### Security headers

Defined in `_headers` (Netlify applies these at the CDN edge). To allow a new external script domain, update the `script-src` directive there.

## Key files

| File | Purpose |
|------|---------|
| `index.html` | Entire site structure — all wizard pages |
| `styles.css` | All CSS |
| `script.js` | All JS (page switching, form validation, etc.) |
| `_config.yml` | Jekyll settings — do not change `url` |
| `netlify.toml` | Build command, Ruby version, `JEKYLL_ENV` |
| `_headers` | Netlify HTTP security headers (CSP, HSTS, etc.) |
| `admin/config.yml` | Decap CMS field definitions |

## Content editing shortcuts

- Phone number: search `0432 014 162` in `index.html`
- Email address: search `info@trustcaresupport.com.au` in `index.html`
- Hero section: find `<section class="hero">` in `index.html`
- To hide a job without deleting: set `active: false` in its `_jobs/*.md` front matter

## YAML conventions

- 2-space indentation (never tabs)
- Multi-line text uses the `|` block scalar
- Strings with special characters must be quoted
