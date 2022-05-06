import { useEffect, useState, useRef, useMemo } from 'react'
import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import { AppCachedKeys } from '../constants/cache'
import { deprecatedAddrToNewAddr } from './util'

export const useInterval = (callback: () => void, delay: number, deps: any[] = []) => {
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const listener = setInterval(savedCallback.current, delay)
    return () => clearInterval(listener)
    // eslint-disable-next-line
  }, [delay, ...deps])
}

export const useTimeout = (callback: () => void, delay: number) => {
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    const listener = setTimeout(tick, delay)
    return () => clearTimeout(listener)
  }, [delay])
}

export const useTimeoutWithUnmount = (callback: () => void, clearCallback: () => void, delay: number) => {
  const savedCallback = useRef(() => {})
  const savedClearCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
    savedClearCallback.current = clearCallback
  })
  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    const listener = setTimeout(tick, delay)
    return () => {
      clearTimeout(listener)
      savedClearCallback.current()
    }
  }, [delay])
}

export const useAddrFormatToggle = () => {
  const [isNew, setIsNew] = useState(localStorage.getItem(AppCachedKeys.NewAddrFormat) === 'true')

  return {
    isNew,
    setIsNew: (is: boolean) => {
      localStorage.setItem(AppCachedKeys.NewAddrFormat, `${is}`)
      setIsNew(is)
    },
  }
}

export const useNewAddr = (hash: string) =>
  useMemo(() => {
    if (hash.startsWith('0x')) {
      return hash
    }
    try {
      const isAddrNew = parseAddress(hash, 'hex').startsWith('0x00')
      return isAddrNew ? hash : deprecatedAddrToNewAddr(hash)
    } catch {
      return hash
    }
  }, [hash])

export default {
  useInterval,
  useTimeout,
  useTimeoutWithUnmount,
  useAddrFormatToggle,
  useNewAddr,
}
