import { useState } from 'react'
import { useHistory } from 'react-router'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import {
  MAINTENANCE_ALERT_POLLING_TIME,
  FLUSH_CHART_CACHE_POLLING_TIME,
  BLOCK_POLLING_TIME,
} from '../../constants/common'
import { AppCachedKeys } from '../../constants/cache'
import { AppDispatch } from '../reducer'
import { fetchCachedData } from '../../utils/cache'
import { changeLanguage } from '../../utils/i18n'
import { useAppState, useDispatch } from '.'
import { AppActions } from '../actions'
import { useInterval } from '../../utils/hook'
import { getMaintenanceInfo } from '../../service/app/alert'
import flushCacheInfo from '../../service/app/charts/cache'
import getStatistics from '../../service/app/statistics'

const initAppLanguage = (app: State.App, dispatch: AppDispatch) => {
  const language = fetchCachedData<'zh' | 'en'>(AppCachedKeys.AppLanguage) || app.language
  // Warding: https://github.com/facebook/react/issues/18147
  setTimeout(() => {
    dispatch({
      type: AppActions.UpdateAppLanguage,
      payload: {
        language,
      },
    })
  }, 0)
  changeLanguage(language)
}

export const useInitApp = () => {
  const [init, setInit] = useState(false)
  const { app } = useAppState()
  const dispatch = useDispatch()
  const history = useHistory()

  if (!init) {
    setInit(true)
    initAxiosInterceptors(dispatch, history)
    initAppLanguage(app, dispatch)
    getMaintenanceInfo(dispatch)
    flushCacheInfo()
    getStatistics(dispatch)
  }

  useInterval(() => {
    getMaintenanceInfo(dispatch)
  }, MAINTENANCE_ALERT_POLLING_TIME)

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
  useInterval(() => {
    getStatistics(dispatch)
  }, BLOCK_POLLING_TIME)
}

export default useInitApp
