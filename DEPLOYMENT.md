# TrustCare Support — Deployment Guide

> Step-by-step instructions for deploying, re-deploying, and recovering the TrustCare Support website on Netlify.

---

## Table of Contents

1. [Architecture overview](#1-architecture-overview)
2. [First-time setup from scratch](#2-first-time-setup-from-scratch)
3. [Normal deployment (day-to-day)](#3-normal-deployment-day-to-day)
4. [Environment configuration](#4-environment-configuration)
5. [Domain and DNS setup](#5-domain-and-dns-setup)
6. [Email forwarding setup](#6-email-forwarding-setup)
7. [CMS authentication setup](#7-cms-authentication-setup)
8. [Formspree form connections](#8-formspree-form-connections)
9. [Rollback — how to undo a bad deployment](#9-rollback--how-to-undo-a-bad-deployment)
10. [Disaster recovery — rebuilding from zero](#10-disaster-recovery--rebuilding-from-zero)
11. [Monitoring](#11-monitoring)
12. [Security checklist](#12-security-checklist)

---

## 1. Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└────────────┬────────────────────────────────┬───────────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐      ┌─────────────────────────────────┐
│   trustcaresupport     │      │         Netlify CDN             │
│   .com.au              │      │   (global edge network)         │
│   (Domain registrar)   │      │   Serves _site/ folder          │
│   DNS → Netlify IPs    │      │   HTTPS via Let's Encrypt SSL   │
└────────────────────────┘      └───────────────┬─────────────────┘
                                                │
                                                │ auto-deploy on push
                                                ▼
                                ┌───────────────────────────────┐
                                │         GitHub Repo           │
                                │  abassaj89-eng/               │
                                │  TrustCare_NursingServices    │
                                └───────────────┬───────────────┘
                                                │
                         ┌──────────────────────┼───────────────────┐
                         ▼                      ▼                   ▼
               ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
               │  index.html      │  │  _data/*.yml     │  │  _posts/*.md     │
               │  styles.css      │  │  (CMS edits)     │  │  (blog articles) │
               │  script.js       │  └──────────────────┘  └──────────────────┘
               └──────────────────┘
                         │
                         ▼
               ┌──────────────────┐
               │  Netlify Build   │
               │  bundle exec     │
               │  jekyll build    │
               │  → _site/        │
               └──────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                          │
├─────────────────┬──────────────────────┬──────────────────────────┤
│   Formspree     │   ImprovMX           │   Netlify Identity       │
│   Form data     │   info@ forwarding   │   CMS authentication     │
│   → email       │   → Gmail            │   (Netlify Identity)     │
└─────────────────┴──────────────────────┴──────────────────────────┘
```

---

## 2. First-time setup from scratch

Use this section **only** if the site needs to be rebuilt entirely from scratch.

### Step 1 — Clone or fork the GitHub repository

```bash
git clone https://github.com/abassaj89-eng/TrustCare_NursingServices.git
cd TrustCare_NursingServices
```

### Step 2 — Create a new Netlify site

1. Go to [app.netlify.com](https://app.netlify.com) and log in
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** as the Git provider
4. Select the `TrustCare_NursingServices` repository
5. Configure build settings (these should be auto-detected from `netlify.toml`):
   - **Build command:** `bundle exec jekyll build`
   - **Publish directory:** `_site`
6. Click **Deploy site**
7. Wait 2–3 minutes for the first build to complete

### Step 3 — Verify the build

1. In Netlify dashboard → **Deploys** tab
2. Click the latest deploy to view build logs
3. Look for `Jekyll 4.3.x | Build time: Xs` near the end
4. If successful, a random URL like `wonderful-cupcake-abc123.netlify.app` will be assigned

### Step 4 — Set environment variables

In Netlify dashboard → **Site settings → Environment variables**:

| Key | Value |
|-----|-------|
| `JEKYLL_ENV` | `production` |
| `RUBY_VERSION` | `3.2.0` |

These are already in `netlify.toml` but setting them explicitly avoids override issues.

### Step 5 — Connect the custom domain

See [Section 5 — Domain and DNS setup](#5-domain-and-dns-setup) below.

### Step 6 — Enable Netlify Identity

See [Section 7 — CMS authentication setup](#7-cms-authentication-setup) below.

### Step 7 — Enable Git Gateway

1. Netlify dashboard → **Site settings → Identity → Services**
2. Click **Enable Git Gateway**
3. This allows Decap CMS to commit content changes directly to GitHub

---

## 3. Normal deployment (day-to-day)

Every push to the `main` branch on GitHub triggers an automatic deploy. No manual action is required.

### Typical workflow

```bash
# Make changes to any file
# Then:
git add .                          # or: git add specific-file.html
git commit -m "Brief description"
git push origin main
# Netlify auto-detects and deploys in ~1-2 minutes
```

### Checking deploy status

- **Netlify dashboard** → Deploys tab → look for green "Published" label
- **Netlify deploy notifications** → can be set up to email you on success/failure
- **Live site** → trustcaresupport.com.au (check your change is visible)

### If Netlify has newer commits than your local copy

This happens when Decap CMS saves content (it commits directly to GitHub). Always pull before pushing:

```bash
git pull origin main --rebase
# resolve any conflicts if needed
git push origin main
```

---

## 4. Environment configuration

### netlify.toml (committed to the repo)

```toml
[build]
  command = "bundle exec jekyll build"
  publish = "_site"

[build.environment]
  JEKYLL_ENV = "production"
  RUBY_VERSION = "3.2.0"
```

### _config.yml (Jekyll settings)

```yaml
title: "TrustCare Support"
url: "https://trustcaresupport.com.au"
baseurl: ""
markdown: kramdown
```

**Do not change `url`** — it is used to generate canonical links and the sitemap.

### _headers (Netlify HTTP headers)

Located at `/_headers`. Applied to all pages:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...
```

To add a new allowed script domain, edit the `script-src` directive in `_headers`.

---

## 5. Domain and DNS setup

### Domain: trustcaresupport.com.au

**Current DNS configuration** — point these records at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `75.2.60.5` | 3600 |
| CNAME | `www` | `[your-netlify-site].netlify.app` | 3600 |

**How to update DNS** (generic steps — exact steps depend on your registrar):
1. Log into your domain registrar account
2. Navigate to DNS management for `trustcaresupport.com.au`
3. Delete any existing A records for `@`
4. Add the Netlify A record: `75.2.60.5`
5. Add/update the CNAME for `www` pointing to your Netlify subdomain
6. Save. DNS propagation takes 15 minutes to 48 hours.

**SSL Certificate:** Automatically provisioned and renewed by Netlify via Let's Encrypt. No manual action required. Certificate renews every 90 days automatically.

To verify SSL: In Netlify dashboard → Domain settings → HTTPS → should show "Certificate provisioned".

### Backup domain: trustcaresupport.com

A redirect from `trustcaresupport.com` → `trustcaresupport.com.au` is recommended. Set this up in Netlify:
- Netlify dashboard → Domain settings → Add domain alias → enter `trustcaresupport.com`
- Configure a redirect rule or let Netlify handle it automatically

---

## 6. Email forwarding setup

Email service: **ImprovMX** (improvmx.com)

Current configuration:
- `info@trustcaresupport.com.au` → forwards to `abass.aj89@gmail.com`

### MX records required at domain registrar

| Type | Priority | Value |
|------|----------|-------|
| MX | 10 | `mx1.improvmx.com` |
| MX | 20 | `mx2.improvmx.com` |
| TXT | — | `v=spf1 include:spf.improvmx.com ~all` |

### To add additional forwarding addresses

1. Go to [improvmx.com](https://improvmx.com) and log in
2. Select the `trustcaresupport.com.au` domain
3. Click **Add alias**
4. Set alias (e.g. `admin`) and destination email
5. Save

---

## 7. CMS authentication setup

### Enable Netlify Identity

1. Netlify dashboard → **Identity** tab
2. Click **Enable Identity**
3. Under **Registration**, set to **Invite only** (important — prevents public signups)
4. Under **External providers** — leave as Netlify only (no Google/GitHub needed)
5. Under **Services** → click **Enable Git Gateway**

### Invite a CMS user

1. Netlify dashboard → **Identity** tab
2. Click **Invite users**
3. Enter the email address of the person who needs CMS access
4. They will receive an email to set a password
5. They can then log in at `trustcaresupport.com.au/admin`

### Remove a CMS user

1. Netlify dashboard → **Identity** tab
2. Find the user in the list
3. Click their name → **Delete user**
4. This immediately revokes their CMS access

### Reset CMS password

The user can click **Forgot password** on the login screen at `/admin`. Or:
1. Netlify dashboard → Identity → find the user
2. Click **Send password recovery email**

---

## 8. Formspree form connections

All five forms on the site use [Formspree](https://formspree.io). Forms submit via standard HTML POST — no JavaScript dependency.

| Form | Formspree endpoint | Location in index.html |
|------|--------------------|------------------------|
| Referral form | `https://formspree.io/f/mpqowazj` | Line ~989 |
| Contact / Book a consult | `https://formspree.io/f/xaqlnwyw` | Line ~1140 |
| Online job application | `https://formspree.io/f/xaqlnwyw` | Line ~1566 (modal) |
| Complaints form | `https://formspree.io/f/xbdplrjb` | Line ~1255 |
| Feedback form | `https://formspree.io/f/xjgpkbvq` | Line ~1323 |
| Talent pool / Newsletter | `https://formspree.io/f/maqlnwnw` | Line ~937, ~1507 |

**Spam protection:** All forms include a hidden `_gotcha` honeypot field. Bots that fill it in are silently rejected by Formspree.

**To change where a form sends emails:**
1. Log into [formspree.io](https://formspree.io) with the TrustCare account
2. Click the form you want to modify
3. Go to **Settings → Email notifications**
4. Update the recipient email address
5. Save

**To view form submissions:**
1. Log into formspree.io
2. Click on the form name
3. All submissions are listed under **Submissions**
4. Can export as CSV

---

## 9. Rollback — how to undo a bad deployment

### Option A — Rollback in Netlify (fastest — 30 seconds)

1. Netlify dashboard → **Deploys** tab
2. Find the last known good deploy (look for the green "Published" label on the previous one)
3. Click that deploy
4. Click **Publish deploy** button (bottom of the page)
5. Site instantly rolls back — no rebuild required

### Option B — Revert in Git

```bash
# Find the commit hash of the good version
git log --oneline

# Revert to that commit
git revert HEAD                    # undo the last commit
# or
git reset --hard abc1234           # go back to a specific commit (destructive)
git push origin main --force       # push the revert
```

**Warning:** `git reset --hard` destroys commit history. Prefer `git revert` which creates a new "undo" commit instead.

---

## 10. Disaster recovery — rebuilding from zero

Time estimate: **2–4 hours** for a full rebuild from GitHub.

### If GitHub repo is intact

1. Create a new Netlify account or site (Section 2)
2. Connect to the GitHub repo
3. Configure build settings
4. Update DNS to point to new Netlify site
5. Re-enable Netlify Identity and Git Gateway
6. Re-invite CMS users

### If GitHub repo is lost

The site source code is also on your local machine at:
`C:\Users\Admin\Desktop\TrustCare_NursingServices\`

1. Push this local copy to a new GitHub repo:
   ```bash
   cd "C:\Users\Admin\Desktop\TrustCare_NursingServices"
   git remote set-url origin https://github.com/YOUR-NEW-REPO-URL
   git push origin main
   ```
2. Follow Section 2 to set up Netlify

### If local files are also lost

Netlify retains all previous deploy zips. Contact Netlify support to retrieve a past deploy zip. Then unzip and push to GitHub.

**Responsible party for recovery:** Site owner — abass.aj89@gmail.com

---

## 11. Monitoring

### Recommended free tools (not yet configured — set these up)

| Tool | Purpose | Setup URL |
|------|---------|-----------|
| UptimeRobot | Alerts if site goes down | uptimerobot.com |
| Google Search Console | Index status, Core Web Vitals | search.google.com/search-console |
| Netlify deploy notifications | Email on build failure | Netlify → Notifications |

### Setting up Netlify deploy notifications

1. Netlify dashboard → **Site settings → Build & deploy → Deploy notifications**
2. Click **Add notification → Email notification**
3. Choose "Deploy failed" event
4. Enter abass.aj89@gmail.com
5. Save

---

## 12. Security checklist

| Item | Status | Notes |
|------|--------|-------|
| HTTPS / SSL | ✅ Active | Auto-renewed via Let's Encrypt |
| HTTP security headers | ✅ Active | Via `_headers` file |
| Content Security Policy | ✅ Active | Restricts script/style sources |
| HSTS | ✅ Active | max-age=31536000 |
| X-Frame-Options | ✅ Active | SAMEORIGIN — prevents clickjacking |
| X-Content-Type-Options | ✅ Active | nosniff |
| Form honeypot spam protection | ✅ Active | `_gotcha` field on all forms |
| CMS invite-only registration | ✅ Recommended | Set in Netlify Identity settings |
| No database to attack | ✅ By design | Static site architecture |
| No server-side code to exploit | ✅ By design | No PHP, no Node, no CMS backend |
| Robots.txt | ✅ Active | `/robots.txt` |
| Sitemap | ✅ Active | `/sitemap.xml` |
| Custom 404 page | ✅ Active | `404.html` |

---

*For CMS usage see [CMS-GUIDE.md](CMS-GUIDE.md).*
*For full handover see [HANDOVER.md](HANDOVER.md).*
