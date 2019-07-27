import { useEffect, useState, useRef, useContext } from 'react'
import { initAxiosInterceptors } from '../service/http/interceptors'
import { handleBlockchainAlert } from '../service/app/blockchain'
import { RESIZE_LATENCY, BLOCKCHAIN_ALERT_POLLING_TIME } from '../utils/const'
import AppContext from './App'
import { handleNodeVersion } from '../service/app/nodeInfo'

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
export const useWindowResize = () => {
  const appContext = useContext(AppContext)
  useEffect(() => {
    const resizeListener = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        appContext.resize(window.innerWidth, window.innerHeight)
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

export const useInitApp = () => {
  const appContext = useContext(AppContext)
  const [init, setInit] = useState(false)
  if (!init) {
    setInit(true)
    initAxiosInterceptors(appContext)
    handleNodeVersion(appContext)
  }

  useInterval(() => {
    handleBlockchainAlert(appContext)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)
}
