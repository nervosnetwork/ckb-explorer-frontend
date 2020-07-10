import { useEffect, useState } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { RESIZE_LATENCY, AppCachedKeys, MAINTENANCE_ALERT_POLLING_TIME, FLUSH_CHART_CACHE_POLLING_TIME } from '../../utils/const'
import { initNodeVersion } from '../../service/app/nodeInfo'
import { AppDispatch } from '../reducer'
import { fetchCachedData } from '../../utils/cache'
import { changeLanguage } from '../../utils/i18n'
import { useAppState, useDispatch } from '.'
import { AppActions } from '../actions'
import { useInterval } from '../../utils/hook'
import { getMaintenanceInfo } from '../../service/app/alert'
import flushCacheInfo from '../../service/app/charts/cache'

const useWindowResize = (dispatch: AppDispatch) => {
  useEffect(() => {
    let resizeTimer: any = null
    const resizeListener = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        dispatch({
          type: AppActions.ResizeWindow,
          payload: {
            appWidth: window.innerWidth,
            appHeight: window.innerHeight,
          },
        })
        resizeTimer = null
      }, RESIZE_LATENCY)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [dispatch])
}

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

  if (!init) {
    setInit(true)
    initAxiosInterceptors(dispatch)
    initNodeVersion(dispatch)
    initAppLanguage(app, dispatch)
    getMaintenanceInfo(dispatch)
    flushCacheInfo()
  }
  useWindowResize(dispatch)

  useInterval(() => {
    getMaintenanceInfo(dispatch)
  }, MAINTENANCE_ALERT_POLLING_TIME)

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export default useInitApp
