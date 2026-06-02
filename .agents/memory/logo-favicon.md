---
name: Logo & Favicon Assets
description: SVG logo mark and favicon for Nexus Axis — file locations and usage
---

## Favicon
- Path: `artifacts/nexus-axis/public/favicon.svg`
- Design: Scales of justice (gold #C4973A) on dark navy (#080B10) background, rounded rect with thin gold border
- Referenced in `index.html` as `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

## Logo mark (navbar + footer)
- Path: `artifacts/nexus-axis/src/assets/logo.svg`
- Design: Same scales of justice icon, no background/border — transparent SVG for embedding in dark UI
- Both `navbar.tsx` and `footer.tsx` import it: `import logoPath from "../../assets/logo.svg"`
- The text "Nexus Axis / CONSULTANTS" is rendered as HTML next to the logo image, NOT embedded in the SVG

**Why SVG over PNG:** Scales infinitely at all screen densities; no image generation tool needed; consistent gold color with CSS variable system.
