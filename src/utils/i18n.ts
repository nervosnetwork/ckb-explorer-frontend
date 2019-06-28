import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from '../locales/zh.json'
import en from '../locales/en.json'

const chooseLocale = () => {
  switch (navigator.language.split('-')[0]) {
    case 'en':
      return 'en'
    case 'zh':
      return 'zh'
    default:
      return 'en'
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en,
    zh,
  },
  fallbackLng: chooseLocale(),
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
