import { useEffect, useState, useRef } from 'react'
import { initAxiosInterceptors } from '../service/http/interceptors'

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

export const useWindowResize = (callback: () => void) => {
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const resizeListener = () => {
      savedCallback.current()
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
  }, [])
}

export const useAxiosInterceptors = (appContext: any) => {
  const [initInterceptors, setInitInterceptors] = useState(false)
  if (!initInterceptors) {
    setInitInterceptors(true)
    initAxiosInterceptors(appContext)
  }
}
