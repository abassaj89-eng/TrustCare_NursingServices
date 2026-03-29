# TrustCare Support — Project README

> **NDIS Community Nursing Perth** | trustcaresupport.com.au
> Last updated: March 2026

---

## Table of Contents

1. [What this site is](#1-what-this-site-is)
2. [Technology stack](#2-technology-stack)
3. [Folder structure explained](#3-folder-structure-explained)
4. [How the site works](#4-how-the-site-works)
5. [How to update content](#5-how-to-update-content)
6. [Editing code locally](#6-editing-code-locally)
7. [Environment and build variables](#7-environment-and-build-variables)
8. [Common tasks cheat sheet](#8-common-tasks-cheat-sheet)
9. [Who to contact](#9-who-to-contact)

---

## 1. What this site is

TrustCare Support is a multi-page Jekyll website for an NDIS nursing services provider based in Perth, Western Australia. The site is:

- Hosted on **Netlify** (free tier, auto-deployed from GitHub)
- Built with **Jekyll 4.3** (a static site generator — no database)
- Edited through **Decap CMS** (a visual admin panel at `/admin`)
- Source code stored on **GitHub**: `github.com/abassaj89-eng/TrustCare_NursingServices`

Because it is a static site, there is **no server, no PHP, no WordPress**. All pages are pre-built HTML files. This makes it fast, cheap to run, and very secure.

---

## 2. Technology stack

| Layer | Tool | Version |
|-------|------|---------|
| Static site generator | Jekyll | 4.3 |
| Templating language | Liquid | (bundled with Jekyll) |
| Markup | HTML / CSS / Vanilla JS | — |
| CMS (admin panel) | Decap CMS (formerly Netlify CMS) | Latest CDN |
| Hosting | Netlify | Free tier |
| Continuous deployment | Netlify + GitHub | — |
| Domain registrar | (see HANDOVER.md for credentials) | — |
| Email forwarding | ImprovMX | Free tier |
| Form handling | Formspree + Netlify Forms | Free tier |
| Spam protection | Netlify reCAPTCHA | — |
| Fonts | Google Fonts (DM Sans + Sora) | — |
| Authentication (CMS) | Netlify Identity | — |
| Ruby version | 3.2.0 | (set in netlify.toml) |
| Markdown parser | kramdown (GFM mode) | — |

---

## 3. Folder structure explained

```
TrustCare_NursingServices/
│
├── index.html              ← Homepage
├── about.html              ← About Us page
├── services.html           ← Services overview
├── high-intensity.html     ← High-Intensity (HIDPA) supports
├── governance.html         ← Board & governance
├── blog.html               ← Blog listing page
├── careers.html            ← Job listings page
├── contact.html            ← Contact page
├── referral.html           ← Make a Referral form
├── referral-received.html  ← Referral confirmation page
├── feedback.html           ← Feedback form
├── complaints.html         ← Complaints form
├── complaints-policy.html  ← Complaints Policy page
├── privacy.html            ← Privacy Policy page
├── terms.html              ← Terms & Conditions page
├── rights.html             ← Participant Rights Statement
├── incident.html           ← Incident Management Statement
├── thank-you.html          ← Form submission thank-you page
├── 404.html                ← Custom "page not found" page
│
├── styles.css              ← All CSS styling
├── script.js               ← All JavaScript behaviour
│
├── _config.yml             ← Jekyll site settings (title, URL, collections)
├── netlify.toml            ← Netlify build instructions (Ruby version, build command)
├── Gemfile                 ← Ruby gem dependencies (Jekyll, webrick)
├── _headers                ← Netlify HTTP security headers (CSP, HSTS, etc.)
├── robots.txt              ← Tells search engine crawlers what to index
├── sitemap.xml             ← List of all URLs for Google Search Console
│
├── _layouts/
│   ├── default.html        ← Base HTML template (all pages extend this)
│   └── post.html           ← HTML template for individual blog post pages
│
├── admin/
│   ├── index.html          ← Decap CMS admin panel entry point
│   └── config.yml          ← CMS configuration — defines all editable fields
│
├── _posts/                 ← Blog post files (Markdown format)
│   └── YYYY-MM-DD-slug.md
│
├── _jobs/                  ← Job listing files (Markdown front matter only)
│   └── job-slug.md
│
├── _data/                  ← All CMS-editable data (YAML files)
│   ├── about.yml           ← About page: story, values, qualifications
│   ├── team.yml            ← Team member profiles
│   ├── board.yml           ← Board member profiles
│   ├── services_a.yml      ← HIDPA Services group
│   ├── services_b.yml      ← Clinical Services group
│   ├── services_c.yml      ← Assessment Services group
│   ├── services_d.yml      ← Workforce Training group
│   ├── hi_supports.yml     ← High-Intensity (HIDPA) supports
│   ├── legal_privacy.yml         ← Privacy Policy content
│   ├── legal_terms.yml           ← Terms & Conditions content
│   ├── legal_complaints.yml      ← Complaints Policy content
│   ├── legal_rights.yml          ← Participant Rights Statement
│   └── legal_incident.yml        ← Incident Management Statement
│
├── images/
│   └── uploads/            ← Images uploaded via CMS go here
│
├── Trustcaremainlogo.jpg.png  ← Primary logo (navbar + footer)
├── Trustcarelogo.jpg.jpg      ← Logo variant
├── photo.jpg.png              ← Hero portrait photo
└── photo-nobg.png             ← Hero portrait (transparent background)
```

---

## 4. How the site works

### Multi-page architecture

The site is built as **separate HTML pages** — each section (Home, Services, About, Contact, etc.) is its own `.html` file with its own URL. All pages share a common layout defined in `_layouts/default.html`, which provides the navbar, footer, and shared CSS/JS.

When a visitor clicks a nav link, the browser navigates to a different URL (e.g. `/services.html`, `/contact.html`). This means:

- Each page has its own URL and can be bookmarked or shared directly
- Search engines can index every page individually
- The browser back button works as expected

### Jekyll build process

Jekyll reads all the files, processes the Liquid template tags (e.g. `{{ site.data.about.story_para1 }}`), and outputs plain HTML into the `_site/` folder. Netlify deploys the contents of `_site/` to its CDN.

### CMS editing flow

```
Admin edits content in Decap CMS
        ↓
Decap CMS commits the change to GitHub (_data/*.yml or _posts/*.md)
        ↓
Netlify detects the new commit
        ↓
Netlify runs: bundle exec jekyll build
        ↓
New HTML is deployed to CDN (~1–2 minutes)
        ↓
Live site updated at trustcaresupport.com.au
```

### Forms

All forms use **Formspree** for email delivery and **Netlify Forms** with reCAPTCHA for spam protection. Form endpoints are set in each page's HTML. To change a form's destination email, update it in the Formspree dashboard — no code change needed.

---

## 5. How to update content

### Option A — Use the CMS (recommended for non-developers)

1. Go to `https://trustcaresupport.com.au/admin`
2. Log in with your Netlify Identity email and password
3. Choose what to edit from the left sidebar:
   - **📝 Blog Posts** → add or edit articles
   - **💼 Job Listings** → add, edit, or hide jobs
   - **🏥 Services** → edit service cards (four groups)
   - **⚡ High Intensity (HIDPA)** → edit HIDPA support cards
   - **ℹ️ About Page** → edit story, team, board
   - **⚖️ Legal & Compliance** → update legal pages
4. Make changes and click **Publish** (top right)
5. Wait 1–2 minutes for the site to rebuild

See [CMS-GUIDE.md](CMS-GUIDE.md) for detailed step-by-step instructions with screenshots.

### Option B — Edit YAML files directly (for developers)

Edit the relevant file in `_data/` using any text editor. YAML files use this format:

```yaml
title: "My Page Title"
content: |
  ### Heading

  Regular paragraph text here.

  - Bullet point one
  - Bullet point two
```

**Important YAML rules:**
- Use 2 spaces for indentation (never tabs)
- Strings with special characters must be wrapped in quotes
- The `|` symbol after a key means "multi-line text follows"

### Option C — Edit HTML/CSS/JS directly

- `styles.css` — all visual styling
- `script.js` — all interactive behaviour
- Individual `.html` files — page structure and content
- `_layouts/default.html` — shared navbar, footer, and page wrapper

After any file change, commit and push to GitHub. Netlify auto-deploys.

---

## 6. Editing code locally

### Prerequisites

- Git installed
- Ruby 3.2.0 installed
- Bundler gem: `gem install bundler`

### Setup

```bash
# Clone the repository
git clone https://github.com/abassaj89-eng/TrustCare_NursingServices.git
cd TrustCare_NursingServices

# Install Ruby gems
bundle install

# Run the local development server
bundle exec jekyll serve

# Open in browser
# http://localhost:4000
```

### Making changes

```bash
# Always pull first — Decap CMS may have committed via the browser
git pull origin main --rebase

# Check what files you've changed
git status

# Stage your changes
git add filename.css filename.html

# Commit with a message
git commit -m "Brief description of what you changed"

# Push to GitHub (triggers Netlify deploy)
git push origin main
```

---

## 7. Environment and build variables

Set in `netlify.toml`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `JEKYLL_ENV` | `production` | Enables production optimisations in Jekyll |
| `RUBY_VERSION` | `3.2.0` | Pins Ruby version for consistent builds |
| Build command | `bundle exec jekyll build` | Compiles the site |
| Publish directory | `_site` | Netlify serves files from here |

No secret environment variables are required — all credentials (Formspree endpoints) are in the HTML source.

---

## 8. Common tasks cheat sheet

| Task | Where to do it |
|------|---------------|
| Add a blog post | CMS → 📝 Blog Posts → New Blog Post |
| Hide a job listing | CMS → 💼 Job Listings → toggle "Show on Website" off |
| Update Privacy Policy | CMS → ⚖️ Legal & Compliance → Privacy Policy |
| Add a team member | CMS → ℹ️ About Page → Our Team → add item |
| Change phone number | Search `0432 014 162` across all `.html` files |
| Change email address | Search `info@trustcaresupport.com.au` across all `.html` files |
| Update hero text | Edit `index.html` — find the `<section class="hero">` block |
| Add a new service card | CMS → 🏥 Services → choose the relevant group → add item |
| Update legal pages | CMS → ⚖️ Legal & Compliance → choose page |
| Edit shared navbar/footer | Edit `_layouts/default.html` |
| Check site speed | Visit web.dev/measure — enter trustcaresupport.com.au |
| View form submissions | Log into formspree.io with TrustCare account |

---

## 9. Who to contact

| Role | Contact |
|------|---------|
| Site owner / admin | abass.aj89@gmail.com |
| Netlify support | support.netlify.com |
| Formspree support | formspree.io/help |
| Domain registrar support | (see HANDOVER.md) |

---

*For deployment instructions see [DEPLOYMENT.md](DEPLOYMENT.md).*
*For CMS usage see [CMS-GUIDE.md](CMS-GUIDE.md).*
*For full handover details see [HANDOVER.md](HANDOVER.md).*
