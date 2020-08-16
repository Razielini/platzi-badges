import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

import common_mx from './translations/common_mx.json';
import common_en from './translations/common_en.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        common: common_en
      },
      mx: {
        common: common_mx
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

export default useTranslation