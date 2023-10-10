import { useState } from 'react'
import { FLUSH_CHART_CACHE_POLLING_TIME } from '../../constants/common'
import { AppCachedKeys } from '../../constants/cache'
import { fetchCachedData } from '../../utils/cache'
import { changeLanguage } from '../../utils/i18n'
import { useInterval } from '../../utils/hook'
import flushCacheInfo from '../../service/app/charts/cache'

const initAppLanguage = () => {
  const language =
    fetchCachedData<'zh' | 'en'>(AppCachedKeys.AppLanguage) || (navigator.language.includes('zh') ? 'zh' : 'en')
  changeLanguage(language)
}

export const useInitApp = () => {
  const [init, setInit] = useState(false)

  if (!init) {
    setInit(true)
    // TODO: This function may not belong here.
    initAppLanguage()
    flushCacheInfo()
  }

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export default useInitApp
