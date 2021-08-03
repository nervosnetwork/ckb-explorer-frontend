import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { storeCachedData, fetchCachedData } from './cache'
import { AppCachedKeys } from '../constants/cache'

i18n.use(initReactI18next).init({
  resources: {
    en,
    zh,
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export const changeLanguage = (lan: 'en' | 'zh') => {
  if (lan.indexOf('zh') !== -1) {
    i18n.changeLanguage('zh')
  } else {
    i18n.changeLanguage('en')
  }
  storeCachedData(AppCachedKeys.AppLanguage, lan)
}

export const currentLanguage = (): 'en' | 'zh' | null => fetchCachedData<'en' | 'zh'>(AppCachedKeys.AppLanguage)

export default i18n
