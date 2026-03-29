---
name: stop-checklist
enabled: true
event: stop
pattern: .*
---

Before finishing, confirm:

- [ ] CSS variables resolve — no `var(--undefined)` references in `styles.css`
- [ ] Any new font families are loaded in the Google Fonts `<link>` in `index.html`
- [ ] If `_headers` was changed, the CSP still allows Formspree, Google Fonts, and Netlify Identity
- [ ] If `_config.yml` was changed, `url:` is still `https://trustcaresupport.com.au`
- [ ] Changes are committed and pushed — Netlify only deploys from GitHub `main`
- [ ] If Decap CMS made commits while you were working, run `git pull origin main --rebase` before pushing
