import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

export type UiLang = "en-US" | "az-AZ";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    ns: ["common", "auth"],
    defaultNS: "common",
    backend: {
      loadPath: "/static/locales/{{lng}}/{{ns}}.json",
    },
  });

i18n.changeLanguage("az-AZ");  // Modify Settings.tsx state too.

export const changeUiLang = (lang: UiLang) => i18n.changeLanguage(lang);

export default i18n;