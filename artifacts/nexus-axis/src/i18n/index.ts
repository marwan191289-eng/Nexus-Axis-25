import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ar from "./locales/ar";
import fr from "./locales/fr";
import tr from "./locales/tr";
import ur from "./locales/ur";
import hi from "./locales/hi";
import tl from "./locales/tl";
import de from "./locales/de";

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

const savedLang = typeof window !== "undefined"
  ? localStorage.getItem("nexus-lang") || "en"
  : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
    tr: { translation: tr },
    ur: { translation: ur },
    hi: { translation: hi },
    tl: { translation: tl },
    de: { translation: de },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function applyLanguageToDOM(lang: string) {
  localStorage.setItem("nexus-lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
}

applyLanguageToDOM(savedLang);

export default i18n;
