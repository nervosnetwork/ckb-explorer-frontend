import { useEffect, useState, useContext } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { getChainType, handleBlockchainAlert } from '../../service/app/blockchain'
import { BLOCKCHAIN_ALERT_POLLING_TIME, RESIZE_LATENCY, CachedKeys } from '../../utils/const'
import { initNodeVersion } from '../../service/app/nodeInfo'
import { AppDispatch, AppActions } from './reducer'
import { fetchCachedData } from '../../utils/cached'
import { changeLanguage } from '../../utils/i18n'
import { AppContext } from './index'
import { useInterval } from '../../utils/hook'

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
  const language = fetchCachedData<'zh' | 'en'>(CachedKeys.AppLanguage) || app.language
  if (language) {
    dispatch({
      type: AppActions.UpdateAppLanguage,
      payload: {
        language,
      },
    })
    changeLanguage(language)
  }
}

export const useInitApp = (dispatch: AppDispatch) => {
  const [init, setInit] = useState(false)
  const { app } = useContext(AppContext)
  if (!init) {
    setInit(true)
    initAxiosInterceptors(dispatch)
    initNodeVersion(dispatch)
    initAppLanguage(app, dispatch)
    getChainType(dispatch)
  }
  useWindowResize(dispatch)

  useInterval(() => {
    handleBlockchainAlert(dispatch)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)
}

export default useInitApp
