import { useEffect, useState, useRef, useContext } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { handleBlockchainAlert } from '../../service/app/blockchain'
import { RESIZE_LATENCY, BLOCKCHAIN_ALERT_POLLING_TIME } from '../../utils/const'
import { AppContext } from './index'
import { handleNodeVersion } from '../../service/app/nodeInfo'
import { AppDispatch, AppActions } from './reducer'

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    const listener = setInterval(tick, delay)
    return () => clearInterval(listener)
  }, [delay])
}

let resizeTimer: any = null
export const useWindowResize = (dispatch: AppDispatch) => {
  useEffect(() => {
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
    // eslint-disable-next-line
  }, [])
}

export const useInitApp = (dispatch: AppDispatch) => {
  const appContext = useContext(AppContext)
  const [init, setInit] = useState(false)
  if (!init) {
    setInit(true)
    initAxiosInterceptors(appContext)
    handleNodeVersion(dispatch)
  }

  useInterval(() => {
    handleBlockchainAlert(appContext)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)
}
