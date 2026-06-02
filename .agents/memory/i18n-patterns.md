---
name: i18n patterns — react-i18next
description: Key patterns for translation-reactive components in this codebase
---

## Rule: Arrays with translated strings must be INSIDE component functions

**Wrong** (breaks language switching):
```ts
const ITEMS = [
  { label: "Hello" },  // or even t("some.key") called at module level
];
export default function Page() { ... }
```

**Correct:**
```ts
export default function Page() {
  const { t } = useTranslation();
  const items = [
    { label: t("some.key") },
  ];
  ...
}
```

This applies to:
- `leadership` array in `about.tsx`
- `heroImages` / `galleryImages` in `home.tsx`
- Any array whose items depend on translated strings

**Why:** Module-level constants are computed once at import time with the initial language. When the user switches language, `t()` updates but the constant does not. Declaring inside the component means the array is recomputed on every render, picking up the current language.

## HeroCarousel pattern
- `HeroCarousel` receives `images: { src: string; label: string }[]` as a prop
- The parent (`Home`) computes `heroImages` with `t()` inside the function body and passes it as prop
- This way the carousel is pure and stateless w.r.t. translations

## Gallery labels
- Image label keys: `home.heroImg1..5` and `home.galleryImg1..6`
- Both English (en.ts) and Arabic (ar.ts) must have all these keys
