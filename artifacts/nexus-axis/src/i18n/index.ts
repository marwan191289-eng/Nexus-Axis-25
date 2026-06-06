export const RTL_LANGS = new Set(["ar", "ur"]);

export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇦🇪" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", flag: "🇵🇰" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog", flag: "🇵🇭" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
];

let i18nInstance: any = null;

async function loadI18n() {
  if (i18nInstance) return i18nInstance;

  const i18n = await import("i18next");
  const { initReactI18next } = await import("react-i18next");
  const en = await import("./locales/en");
  const ar = await import("./locales/ar");
  const fr = await import("./locales/fr");
  const tr = await import("./locales/tr");
  const ur = await import("./locales/ur");
  const hi = await import("./locales/hi");
  const tl = await import("./locales/tl");
  const de = await import("./locales/de");

  const savedLang = typeof window !== "undefined" ? localStorage.getItem("nexus-lang") || "en" : "en";

  i18nInstance = i18n.default;
  i18nInstance.use(initReactI18next).init({
    resources: {
      en: { translation: en.default },
      ar: { translation: ar.default },
      fr: { translation: fr.default },
      tr: { translation: tr.default },
      ur: { translation: ur.default },
      hi: { translation: hi.default },
      tl: { translation: tl.default },
      de: { translation: de.default },
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

  applyLanguageToDOM(savedLang);
  return i18nInstance;
}

export function applyLanguageToDOM(lang: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("nexus-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  }
}

if (typeof window !== "undefined") {
  loadI18n().catch(console.error);
}

export default i18nInstance || {};
