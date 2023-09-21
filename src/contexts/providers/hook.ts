import { useState } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { MAINTENANCE_ALERT_POLLING_TIME, FLUSH_CHART_CACHE_POLLING_TIME } from '../../constants/common'
import { AppCachedKeys } from '../../constants/cache'
import { fetchCachedData } from '../../utils/cache'
import { changeLanguage } from '../../utils/i18n'
import { useInterval } from '../../utils/hook'
import { getMaintenanceInfo } from '../../service/app/alert'
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
    initAxiosInterceptors()
    // TODO: This function may not belong here.
    initAppLanguage()
    getMaintenanceInfo()
    flushCacheInfo()
  }

  useInterval(() => {
    getMaintenanceInfo()
  }, MAINTENANCE_ALERT_POLLING_TIME)

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export default useInitApp
