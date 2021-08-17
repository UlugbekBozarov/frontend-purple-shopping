import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['uz', 'ru', 'en', 'dev'];

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)

    .init({
        debug: true,
        fallbackLan: 'en',
        lng: 'en',
        whitelist: Languages,
        nonExplicitWhitelist: false,
        lowerCaseLng: true,

        interpolation: {
            escapeValue: false,
        }
    }, (err, t) => {
        if (err) {
            console.error('error while initialising i18next ::: ' + JSON.stringify(err));
        }
    });

export default i18n;