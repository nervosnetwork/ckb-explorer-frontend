import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
// TODO: This file depends on higher-level abstractions, so it should not be in the utils folder.
import { appSettings } from '../services/AppSettings'
import { includes } from './array'

export const SupportedLngs = ['en', 'zh'] as const
export type SupportedLng = (typeof SupportedLngs)[number]
export const isSupportedLng = (value: unknown): value is SupportedLng => includes(SupportedLngs, value)

const getDefaultLanguage = () => appSettings.defaultLanguage$.value
const setDefaultLanguage = appSettings.defaultLanguage$.next.bind(appSettings.defaultLanguage$)

// export this method for testing
export const initI18n = async () => {
  i18n.use(initReactI18next).init({
    resources: {
      en,
      zh,
    },
    supportedLngs: SupportedLngs,
    // Here, `fallbackLng` is used instead of `lng`, perhaps to continue using the results of automatic region checking?
    fallbackLng: getDefaultLanguage(),
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

i18n.on('languageChanged', lng => {
  setDefaultLanguage(isSupportedLng(lng) ? lng : 'en')
})

export const useCurrentLanguage = (): SupportedLng => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  if (currentLanguage !== 'en' && currentLanguage !== 'zh') {
    throw new Error('Not supported language')
  }
  return currentLanguage
}

export const useToggleLanguage = () => {
  const currentLanguage = useCurrentLanguage()

  return () => {
    if (currentLanguage === 'zh') {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('zh')
    }
  }
}

export const useLanguageText = (payload?: { reverse: boolean }) => {
  const currentLanguage = useCurrentLanguage()
  const { t } = useTranslation()
  if (payload?.reverse) {
    return currentLanguage === 'zh' ? t('navbar.language_en') : t('navbar.language_zh')
  }
  return currentLanguage === 'en' ? t('navbar.language_en') : t('navbar.language_zh')
}

export const useOtherLanguageText = () => {
  return useLanguageText({ reverse: true })
}
