---
name: jekyll-config-url
enabled: true
event: file
conditions:
  - field: file_path
    operator: ends_with
    pattern: _config.yml
  - field: new_text
    operator: regex_match
    pattern: ^url:\s
---

**Editing `url:` in `_config.yml` — this field must stay as `https://trustcaresupport.com.au`.**

Changing it will break:
- All canonical link tags (SEO)
- The generated `sitemap.xml` URLs
- Any absolute URLs Jekyll builds from `{{ site.url }}`

If you need a different base URL for local testing, use `bundle exec jekyll serve --baseurl ""` instead — do not change `_config.yml`.
