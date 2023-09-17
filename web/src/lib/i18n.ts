import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en.json";
import esTranslation from "../locales/es.json";
import ptTranslation from "../locales/pt.json";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        lng: "pt", // Idioma padrão
        fallbackLng: "pt",
        resources: {
            en: {
                translation: enTranslation,
            },
            es: {
                translation: esTranslation,
            },
            pt: {
                translation: ptTranslation,
            },
        },
    });

export default i18n;
