---
name: no-force-push
enabled: true
event: bash
action: block
pattern: git\s+push\s+.*--force|git\s+push\s+.*-f\b
---

**Force push blocked.**

Force pushing rewrites history on GitHub and will break any Netlify deploy in progress. It also risks overwriting commits made by Decap CMS (which commits directly to GitHub when content is edited via the admin panel).

Safe alternatives:
- `git pull origin main --rebase` then `git push origin main`
- `git revert HEAD` to undo the last commit without rewriting history
- Use Netlify dashboard → Deploys → "Publish deploy" to roll back without touching Git
