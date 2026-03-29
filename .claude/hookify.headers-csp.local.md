---
name: headers-csp
enabled: true
event: file
conditions:
  - field: file_path
    operator: ends_with
    pattern: _headers
---

**Editing `_headers` — CSP change detected.**

This file controls Netlify's HTTP security headers including the Content Security Policy. Changes here affect the live site immediately on next deploy.

Before saving, verify:
- `script-src` only lists domains that actually serve scripts used by this site
- `form-action` includes `https://formspree.io` (all five forms submit there)
- `font-src` includes `https://fonts.gstatic.com` (Google Fonts)
- `connect-src` includes `https://formspree.io` and `https://identity.netlify.com`
- You have NOT added `'unsafe-eval'` — it is not needed and weakens security

Test the updated CSP at https://csp-evaluator.withgoogle.com after deploying.
