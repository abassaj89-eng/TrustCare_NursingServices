# TrustCare Support — CMS Guide

> How to use the Decap CMS admin panel to manage all website content.
> **No coding knowledge required.**

---

## Table of Contents

1. [Logging in](#1-logging-in)
2. [CMS overview — what you can edit](#2-cms-overview--what-you-can-edit)
3. [Adding a blog post](#3-adding-a-blog-post)
4. [Editing an existing blog post](#4-editing-an-existing-blog-post)
5. [Adding a job listing](#5-adding-a-job-listing)
6. [Hiding or closing a job](#6-hiding-or-closing-a-job)
7. [Editing service cards](#7-editing-service-cards)
8. [Editing the About page](#8-editing-the-about-page)
9. [Adding a team or board member](#9-adding-a-team-or-board-member)
10. [Editing legal pages](#10-editing-legal-pages)
11. [Uploading images](#11-uploading-images)
12. [Rich text formatting reference](#12-rich-text-formatting-reference)
13. [After saving — how long until changes appear?](#13-after-saving--how-long-until-changes-appear)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Logging in

**Admin URL:** `https://trustcaresupport.com.au/admin`

1. Open the admin URL in your browser
2. Click **Log in with Netlify Identity**
3. Enter your email address and password
4. You are now in the CMS dashboard

> **Forgot your password?** Click "Forgot password?" on the login screen. A reset link will be sent to your email.

> **Need to add another user?** See the Netlify Identity section in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 2. CMS overview — what you can edit

The left sidebar shows all content sections:

| Icon | Section | What it controls |
|------|---------|-----------------|
| 📝 | Blog Posts | Articles shown on the Resources/Blog page |
| 💼 | Job Listings | Positions on the Work With Us page |
| 🏥 | Services | The four groups of service cards |
| ⚡ | High Intensity (HIDPA) | The 10 HIDPA support cards |
| ℹ️ | About Page | Story, values, team members, board, qualifications |
| ⚖️ | Legal & Compliance | Privacy Policy, T&Cs, Complaints, Rights, Incident |

---

## 3. Adding a blog post

**Where it appears on the website:** Resources page → blog card grid

### Steps

1. In the CMS sidebar, click **📝 Blog Posts**
2. Click the **New Blog Post** button (top right)
3. Fill in all fields:

---

**Title** *(required)*
The headline of the article. Keep it under 70 characters.
> Example: `New NDIS Price Guide Changes for 2025–26`

---

**Category** *(required — choose one)*
- NDIS Updates
- Health Tips
- Company News

This appears as a filter on the Resources page.

---

**Tag Label** *(required)*
A short label shown on the card badge.
> Example: `NDIS Updates` or `Wound Care Tips`

---

**Icon (emoji)** *(required)*
An emoji that appears as the thumbnail if no photo is uploaded.
> Example: `📋` or `🏥` or `💉`

---

**Featured Image** *(optional)*
Upload a JPG or PNG photo (minimum 800×500px recommended).
If uploaded, this replaces the emoji icon on the card.

---

**Publish Date** *(required)*
Pick a date and time from the date picker.
The post will appear in chronological order based on this date.

---

**Summary** *(required)*
1–2 sentences shown on the blog card preview.
> Example: `A breakdown of the key price changes affecting NDIS participants and providers in Western Australia from 1 July 2025.`

---

**Full Content** *(required)*
The full article body. Use the rich text toolbar:
- **B** = Bold
- *I* = Italic
- H1, H2, H3 = Headings
- List icon = Bullet points
- Link icon = Add hyperlinks
- Image icon = Insert images within the article

See [Section 12 — Rich text formatting](#12-rich-text-formatting-reference) for more.

---

4. Click **Publish** (top right) when done
5. Wait 1–2 minutes for the site to rebuild
6. Visit the Resources page on the live site to verify

---

## 4. Editing an existing blog post

1. CMS sidebar → **📝 Blog Posts**
2. Find the post in the list (sorted by date, newest first)
3. Click the post title to open it
4. Make your changes
5. Click **Publish** to save

To **delete** a post: Open the post → click the three-dot menu (⋮) in the top right → **Delete**

---

## 5. Adding a job listing

**Where it appears:** Work With Us page → job cards

### Steps

1. CMS sidebar → **💼 Job Listings**
2. Click **New Job**
3. Fill in all fields:

---

**Job Title** *(required)*
> Example: `Registered Nurse — High Intensity`

---

**Show on Website** *(toggle)*
- **ON** = job is visible on the site
- **OFF** = job is hidden (stays saved, just not shown)

Use this to pause a listing without deleting it.

---

**Filter Category** *(required)*
Choose: Clinical / Support / Consulting / Contract

This controls which tab the job appears under.

---

**Search Keywords**
Lowercase words for the site's search function.
> Example: `registered nurse perth high intensity full-time wound care`

---

**Location**
Default is `Perth, WA`. Change if different.

---

**Employment Type**
> Examples: `Full-Time`, `Casual / Part-Time`, `Contract`

---

**Team**
> Examples: `🏥 Clinical Team`, `🤝 Support Team`, `📋 Consulting`

---

**Badge Text** *(choose one)*
- Now Hiring
- Contract
- Closed

---

**Badge Colour** *(choose one)*
- Blue — Now Hiring
- Green — Contract

---

**Posted Date**
> Example: `March 2026`

---

**Job Description**
A paragraph describing the role.

---

**Requirements** *(list)*
Click **Add** for each requirement. One per entry.
> Examples:
> - `AHPRA registration as a Registered Nurse`
> - `Minimum 2 years community or disability nursing experience`
> - `Valid WA driver's licence`

---

**Skill Tags** *(list)*
Short tag chips shown on the card.
> Examples: `AHPRA Registered`, `Wound Care`, `NDIS Experience`

---

**Accent Colour** *(optional)*
Leave blank for navy. Or use a CSS value like `var(--green)` for green accent.

---

4. Click **Publish**
5. Wait 1–2 minutes and check the Work With Us page

---

## 6. Hiding or closing a job

To **temporarily hide** a job (keep it for later):
1. Open the job in CMS
2. Toggle **Show on Website** to OFF
3. Click Publish

To **mark as Closed** (still visible but shows "Closed" badge):
1. Change **Badge Text** to `Closed`
2. Click Publish

To **permanently delete** a job:
1. Open the job
2. Three-dot menu (⋮) → **Delete**

---

## 7. Editing service cards

Services are divided into four groups managed separately:

| CMS entry | Group | Page section |
|-----------|-------|-------------|
| Group A — HIDPA Services | High-Intensity clinical skills | Services page top |
| Group B — Clinical Services | General clinical nursing | Services page |
| Group C — Assessment Services | Assessment and continence | Services page |
| Group D — Workforce Training | Training and education | Services page bottom |

### To edit a service card

1. CMS sidebar → **🏥 Services**
2. Click the group you want to edit
3. Under **Service Cards**, find the card by its title
4. Click to expand it and edit:
   - **Icon** — emoji shown at the top of the card
   - **Tag** — small badge label (e.g. `NDIS HIDPA`, `Clinical`)
   - **Title** — card heading
   - **Description** — 2–3 sentences of body text
5. Click Publish

### To add a new service card

1. Open the service group
2. Scroll to the bottom of the Service Cards list
3. Click **Add Service Cards**
4. Fill in the four fields
5. Click Publish

### To remove a service card

1. Find the card in the list
2. Click the **trash icon** next to it
3. Click Publish

---

## 8. Editing the About page

### Our Story and Values

1. CMS sidebar → **ℹ️ About Page → Our Story & Values**
2. Edit any of these fields:
   - **Story — Paragraph 1 / 2** — main story text
   - **Our Vision** — vision statement
   - **Our Mission** — mission statement
   - **Story Accordion Items** — expandable Q&A boxes
   - **Our Values** — value cards with icons
   - **Qualifications** — list of credentials shown in the qualifications section
3. Click Publish

---

## 9. Adding a team or board member

### Team members

1. CMS sidebar → **ℹ️ About Page → Our Team**
2. Scroll to the members list
3. Click **Add Team Members**
4. Fill in:
   - **Name** — full name
   - **Role / Title** — their job title
   - **Bio** — 2–4 sentences
   - **Photo** — upload a headshot (square crop recommended, min 400×400px)
   - **Skill Tags** — e.g. `AHPRA RN`, `Wound Certified`
5. Click Publish

### Board members

Same process but use **ℹ️ About Page → Our Board**.

---

## 10. Editing legal pages

**All five legal pages** are editable via the CMS:

| Page | CMS entry |
|------|-----------|
| Privacy Policy | ⚖️ Legal & Compliance → Privacy Policy |
| Terms & Conditions | ⚖️ Legal & Compliance → Terms and Conditions |
| Complaints Policy | ⚖️ Legal & Compliance → Complaints Policy |
| Participant Rights Statement | ⚖️ Legal & Compliance → Participant Rights Statement |
| Incident Management Statement | ⚖️ Legal & Compliance → Incident Management Statement |

### How to update a legal page

1. CMS sidebar → **⚖️ Legal & Compliance**
2. Click the page you want to update
3. Edit the fields:
   - **Page Title** — used in the browser tab
   - **Heading (before highlight)** — first part of the H2 heading
   - **Heading Highlight** — second part shown in blue
   - **Eyebrow Label** — small text above the heading
   - **Last Updated** — the date shown under the heading (e.g. `March 2026`)
   - **Intro Paragraph** — short text below the heading (plain text — no markdown)
   - **Content** — full legal content in rich text / markdown format
4. Click Publish

> **Important:** Always update the **Last Updated** field whenever you make changes to a legal page.

### Heading structure tip

The heading renders as: `[Heading (before highlight)]` + `[Heading Highlight in blue]`

Examples:
| Before highlight | Highlight | Result |
|---------|-----------|--------|
| `Privacy` | `Policy` | Privacy **Policy** |
| `Terms and` | `Conditions` | Terms and **Conditions** |
| `Participant` | `Rights Statement` | Participant **Rights Statement** |

---

## 11. Uploading images

### Via the CMS media library

1. In any CMS field that accepts an image, click **Choose an image**
2. Click **Upload** to add a new image from your computer
3. Select the image and click **Choose selected**
4. The image is saved to `/images/uploads/` in the GitHub repo

### Best practice for image sizes

| Use | Recommended size | Format |
|-----|-----------------|--------|
| Blog post card thumbnail | 800 × 500 px | JPG |
| Team member headshot | 400 × 400 px | JPG (square) |
| Board member headshot | 400 × 400 px | JPG (square) |
| Blog inline image | max 1200 px wide | JPG or PNG |

### Compressing images before upload

Large images slow down the site. Before uploading:
1. Go to [squoosh.app](https://squoosh.app)
2. Drop your image in
3. Choose **MozJPEG** or **WebP** format
4. Reduce quality to ~80% (usually invisible difference)
5. Download the compressed version and upload that to the CMS

---

## 12. Rich text formatting reference

The CMS content editor supports standard Markdown formatting:

| What you want | How to type it |
|--------------|----------------|
| **Bold text** | `**bold text**` |
| *Italic text* | `*italic text*` |
| ### Heading 3 | `### Heading text` |
| #### Heading 4 | `#### Heading text` |
| Bullet list | `- Item one` (new line for each) |
| Numbered list | `1. First item` |
| [Link text](URL) | `[Link text](https://example.com)` |
| Horizontal rule | `---` |
| Line break | Leave a blank line between paragraphs |

**Note on intro fields:** The "Intro Paragraph" field on legal pages is **plain text only** — do not use asterisks or other markdown symbols. They will appear literally.

---

## 13. After saving — how long until changes appear?

When you click **Publish** in the CMS:

1. CMS commits the change to GitHub (immediate)
2. Netlify detects the commit and starts a build (~5 seconds)
3. Jekyll processes all files (~30–60 seconds)
4. New version is deployed to the CDN (~30 seconds)
5. **Total time: approximately 1–2 minutes**

To check progress:
- Go to [app.netlify.com](https://app.netlify.com)
- Click on the TrustCare site
- Click **Deploys** tab
- Watch for "Published" (green) status

---

## 14. Troubleshooting

### "I published but the site hasn't changed"

1. Check Netlify Deploys tab — is the build still running?
2. Hard-refresh your browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Wait another 2 minutes — CDN caching can delay updates

### "My changes disappeared after publishing"

This can happen if two people save simultaneously. Check the Netlify Deploys log — the CMS creates a Git commit for each save. You can see the commit history on GitHub and restore any previous version.

### "I can't log in to the CMS"

1. Try clicking **Forgot password** — check your spam folder for the reset email
2. Make sure you are using the correct email address (the one that was invited)
3. If still stuck, ask someone with Netlify dashboard access to send a new invite

### "The build failed"

1. Netlify dashboard → Deploys → click the failed deploy
2. Read the error log — the most common causes are:
   - **YAML syntax error** in a `_data/*.yml` file (e.g. wrong indentation or missing quote)
   - **Liquid template error** in `index.html`
3. Fix the file and push again, or roll back to the previous deploy

### "I deleted something by accident"

1. Netlify dashboard → **Deploys** → click the last good deploy → **Publish deploy** (instant rollback)
2. Or in GitHub → **Commits** → find the commit before your change → create a revert

---

*For deployment and technical setup see [DEPLOYMENT.md](DEPLOYMENT.md).*
*For full system handover see [HANDOVER.md](HANDOVER.md).*
