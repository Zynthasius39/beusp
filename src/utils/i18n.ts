import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

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

i18n.changeLanguage("az-AZ");  // TODO: Language Button

export default i18n;