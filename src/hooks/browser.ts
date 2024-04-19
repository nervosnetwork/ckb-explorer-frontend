/**
 * The file implements hooks related to the browser,
 * such as BOM (Browser Object Model), DOM (Document Object Model), Style, and others.
 */
import { useEffect, useState, RefObject, useCallback, useRef } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { startEndEllipsis } from '../utils/string'
import variables from '../styles/variables.module.scss'

export function useElementIntersecting(
  ref: RefObject<HTMLElement>,
  opts: IntersectionObserverInit = {},
  defaultValue = false,
) {
  const [isIntersecting, setIntersecting] = useState(defaultValue)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, opts)
    observer.observe(el)

    // eslint-disable-next-line consistent-return
    return () => {
      observer.unobserve(el)
      observer.disconnect()
    }
  }, [opts, ref])

  return isIntersecting
}

export function useElementSize(ref: RefObject<HTMLElement>) {
  const { width: resizedWidth, height: resizedHeight } = useResizeDetector({
    targetRef: ref,
  })
  const width = resizedWidth ?? ref.current?.clientWidth ?? null
  const height = resizedHeight ?? ref.current?.clientHeight ?? null
  return { width, height }
}

export function useWindowResize(callback: (event: UIEvent) => void) {
  useEffect(() => {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [callback])
}

export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useWindowResize(() => setSize({ width: window.innerWidth, height: window.innerHeight }))
  return size
}

/**
 * copied from https://usehooks-ts.com/react-hook/use-media-query
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  }

  const [matches, setMatches] = useState<boolean>(getMatches(query))

  useEffect(() => {
    const matchMedia = window.matchMedia(query)
    const handleChange = () => setMatches(getMatches(query))

    // Triggered at the first client-side load and if query changes
    handleChange()

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener('change', handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener('change', handleChange)
      }
    }
  }, [query])

  return matches
}

export const mobileBreakPoint = Number(variables.mobileBreakPoint.replace('px', ''))
export const useIsXXLBreakPoint = () => useMediaQuery(`(max-width: ${variables.xxlBreakPoint})`)
export const useIsMobile = () => useMediaQuery(`(max-width: ${variables.mobileBreakPoint})`)
export const useIsExtraLarge = (exact = false) => {
  const isMobile = useIsMobile()
  const isExtraLarge = useMediaQuery(`(max-width: ${variables.extraLargeBreakPoint})`)
  return !exact ? isExtraLarge : isExtraLarge && !isMobile
}

export function useAdaptMobileEllipsis() {
  const { width } = useWindowSize()

  const adaptMobileEllipsis = useCallback(
    (value: string, length = 8) => {
      if (width <= 320) {
        return startEndEllipsis(value, length, length)
      }
      if (width < 500) {
        const step = Math.ceil((width - 420) / 15)
        return startEndEllipsis(value, length + step, length + step)
      }
      if (width < mobileBreakPoint) {
        const step = Math.ceil((width - 500) / 15)
        return startEndEllipsis(value, length + step, length + step)
      }
      return value
    },
    [width],
  )

  return adaptMobileEllipsis
}

export function useAdaptPCEllipsis(factor = 40) {
  const { width } = useWindowSize()
  const isMobile = width < mobileBreakPoint
  const clippedWidth = Math.min(width, 1200)
  const step = Math.ceil((clippedWidth - 700) / factor)

  const adaptPCEllipsis = useCallback(
    (value: string, length = 8) => {
      if (isMobile) return value
      return startEndEllipsis(value, length + step, length + step)
    },
    [isMobile, step],
  )

  return adaptPCEllipsis
}

export const useAnimationFrame = (callback: () => void, running: boolean = true) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    if (!running) return

    let requestId = 0
    function tick() {
      savedCallback.current()
      requestId = window.requestAnimationFrame(tick)
    }
    requestId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(requestId)
  }, [running])
}
