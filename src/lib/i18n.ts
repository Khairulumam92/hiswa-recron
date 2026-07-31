import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nlLocale from '../content/locales/nl.json';
import enLocale from '../content/locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nlLocale },
      en: { translation: enLocale }
    },
    lng: 'nl', // Default language Dutch
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
