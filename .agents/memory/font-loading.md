---
name: Font loading — index.html
description: Which fonts must be loaded in index.html for Nexus Axis
---

## Required fonts (all via Google Fonts in index.html)
- `Inter` (opsz,wght@14..32,400;500;600;700) — primary UI sans-serif
- `Playfair Display` (ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500) — English serif headings (font-serif class)
- `Noto Naskh Arabic` (wght@400;500;600;700) — Arabic body and headings

## CSS variable mapping (index.css)
```
--app-font-sans: 'Inter', system-ui, sans-serif;
--app-font-serif: 'Playfair Display', Georgia, serif;
--app-font-arabic: 'Noto Naskh Arabic', 'Segoe UI', Tahoma, sans-serif;
```

## Arabic/RTL override
`:lang(ar), :lang(ur)` overrides `--app-font-sans` and `--app-font-serif` to use Noto Naskh Arabic for both heading and body text.

**Why:** Playfair Display was referenced in CSS but not loaded → headings fell back to system serif. Always verify font names match exactly between HTML link and CSS font-family.
