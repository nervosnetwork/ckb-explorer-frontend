import { useEffect, useState, useRef, useMemo, useCallback, RefObject } from 'react'
import {
  AddressPrefix,
  addressToScript,
  AddressType,
  bech32Address,
  parseAddress,
  systemScripts,
} from '@nervosnetwork/ckb-sdk-utils'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useResizeDetector } from 'react-resize-detector'
import { interval, share } from 'rxjs'
import { AppCachedKeys } from '../constants/cache'
import { deprecatedAddrToNewAddr } from './util'
import { parsePageNumber, startEndEllipsis } from './string'
import { ListPageParams, PageParams } from '../constants/common'
import {
  fetchCachedData,
  fetchDateChartCache,
  fetchEpochChartCache,
  storeCachedData,
  storeDateChartCache,
  storeEpochChartCache,
} from './cache'
import { parseDate } from './date'

/**
 * Returns the value of the argument from the previous render
 * @param {T} value
 * @returns {T | undefined} previous value
 * @see https://react-hooks-library.vercel.app/core/usePrevious
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

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

export function useBoolean(initialState: boolean): [
  boolean,
  {
    on: () => void
    off: () => void
    toggle: (newState?: boolean) => void
  },
] {
  const [state, setState] = useState(initialState)

  const on = useCallback(() => setState(true), [])
  const off = useCallback(() => setState(false), [])
  const toggle = useCallback(newState => {
    setState(oldState => (newState != null ? newState : !oldState))
  }, [])

  return [
    state,
    {
      on,
      off,
      toggle,
    },
  ]
}

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

export function useDelayLoading(delay: number, loading: boolean) {
  const [isDelayFinished, delayFinishedCtl] = useBoolean(false)
  useTimeout(delayFinishedCtl.on, delay)
  return isDelayFinished && loading
}

function getSearchParams<T extends string = string>(search: string, names?: T[]): Partial<Record<T, string>> {
  const urlSearchParams = new URLSearchParams(search)
  const entries = [...urlSearchParams.entries()].filter(
    (entry): entry is [T, string] => names == null || (names as string[]).includes(entry[0]),
  )
  return Object.fromEntries(entries) as Partial<Record<T, string>>
}

export function useSearchParams<T extends string>(...names: T[]): Partial<Record<T, string>> {
  const location = useLocation()
  return useMemo(() => getSearchParams(location.search, names), [location.search, names])
}

export function useSortParam<T extends string>(
  isSortBy: (s?: string) => boolean,
): {
  sortBy: T | undefined
  orderBy: State.SortOrderTypes
  sort?: string
  handleSortClick: (sortRule?: T) => void
} {
  type SortType = T | undefined
  function isSortByType(s?: string): s is SortType {
    return isSortBy(s) || s === undefined
  }
  function isOrderByType(s?: string): s is State.SortOrderTypes {
    return s === 'asc' || s === 'desc'
  }
  const { sort: sortParam } = useSearchParams('sort')
  const updateSearchParams = useUpdateSearchParams<'sort'>()
  let sortBy: SortType
  let orderBy: State.SortOrderTypes = 'asc'
  if (sortParam) {
    const sortEntry = sortParam.split(',')[0]
    const indexOfPoint = sortEntry.indexOf('.')
    if (indexOfPoint < 0) {
      if (isSortByType(sortEntry)) {
        sortBy = sortEntry
      }
    } else {
      const sBy = sortEntry.substring(0, indexOfPoint)
      if (isSortByType(sBy)) {
        sortBy = sBy
        const oBy = sortEntry.substring(indexOfPoint + 1)
        if (isOrderByType(oBy)) {
          orderBy = oBy
        }
      }
    }
  }
  const sort = sortBy ? `${sortBy}.${orderBy}` : undefined

  const handleSortClick = (sortRule?: SortType) => {
    if (sortBy === sortRule) {
      if (orderBy === 'desc') {
        updateSearchParams(
          params =>
            Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'sort' && entry[0] !== 'page')),
          true,
        )
      } else {
        updateSearchParams(
          params =>
            Object.fromEntries(
              Object.entries({ ...params, sort: `${sortRule}.desc` }).filter(entry => entry[0] !== 'page'),
            ),
          true,
        )
      }
    } else {
      updateSearchParams(
        params =>
          Object.fromEntries(Object.entries({ ...params, sort: sortRule }).filter(entry => entry[0] !== 'page')),
        true,
      )
    }
  }

  return { sortBy, orderBy, sort, handleSortClick }
}

export function useUpdateSearchParams<T extends string>(): (
  updater: (current: Partial<Record<T, string>>) => Partial<Record<T, string>>,
  replace?: boolean,
) => void {
  const history = useHistory()
  const { search, pathname, hash } = useLocation()

  return useCallback(
    (updater, replace) => {
      const oldParams: Partial<Record<T, string>> = getSearchParams(search)
      const newParams = updater(oldParams)
      const newUrlSearchParams = new URLSearchParams(newParams as Record<string, string>)
      newUrlSearchParams.sort()
      const newQueryString = newUrlSearchParams.toString()
      const to = `${pathname}${newQueryString ? `?${newQueryString}` : ''}${hash}`

      if (replace) {
        history.replace(to)
      } else {
        history.push(to)
      }
    },
    [hash, history, pathname, search],
  )
}

export function usePaginationParamsFromSearch(opts: {
  defaultPage?: number
  maxPage?: number
  defaultPageSize?: number
  maxPageSize?: number
}) {
  const { defaultPage = 1, maxPage = Infinity, defaultPageSize = 10, maxPageSize = 100 } = opts
  const updateSearchParams = useUpdateSearchParams<'page' | 'size'>()
  const params = useSearchParams('page', 'size')
  const currentPage = parsePageNumber(params.page, defaultPage)
  const pageSize = parsePageNumber(params.size, defaultPageSize)

  useEffect(() => {
    const pageSizeOversized = pageSize > maxPageSize
    const pageOversized = currentPage > maxPage
    if (pageSizeOversized || pageOversized) {
      updateSearchParams(
        params => ({
          ...params,
          page: pageOversized ? maxPage.toString() : params.page,
          size: pageSizeOversized ? maxPageSize.toString() : params.size,
        }),
        true,
      )
    }
  }, [currentPage, maxPage, maxPageSize, pageSize, updateSearchParams])

  const setPage = useCallback(
    (page: number) =>
      updateSearchParams(params => ({
        ...params,
        page: Math.min(page, maxPage).toString(),
      })),
    [maxPage, updateSearchParams],
  )

  const setPageSize = useCallback(
    (size: number) =>
      updateSearchParams(params => ({
        ...params,
        size: Math.min(size, maxPageSize).toString(),
      })),
    [maxPageSize, updateSearchParams],
  )

  return {
    currentPage: Math.min(currentPage, maxPage),
    pageSize: Math.min(pageSize, maxPageSize),
    setPage,
    setPageSize,
  }
}

export const usePaginationParamsInPage = () =>
  usePaginationParamsFromSearch({
    defaultPage: PageParams.PageNo,
    defaultPageSize: PageParams.PageSize,
    maxPageSize: PageParams.MaxPageSize,
  })

export const usePaginationParamsInListPage = () =>
  usePaginationParamsFromSearch({
    defaultPage: ListPageParams.PageNo,
    defaultPageSize: ListPageParams.PageSize,
    maxPageSize: ListPageParams.MaxPageSize,
  })

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

export const MOBILE_DEVICE_MAX_WIDTH = 750
export const useIsMobile = () => useMediaQuery(`(max-width: ${MOBILE_DEVICE_MAX_WIDTH}px)`)
export const useIsLGScreen = (exact = false) => {
  const isMobile = useIsMobile()
  const isLG = useMediaQuery(`(max-width: 1200px)`)
  return !exact ? isLG : isLG && !isMobile
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
      if (width < 750) {
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
  const isMobile = width < 750
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

export const useAddrFormatToggle = () => {
  const [isNew, setIsNew] = useState(localStorage.getItem(AppCachedKeys.NewAddrFormat) !== 'false')

  return {
    isNew,
    setIsNew: (is: boolean) => {
      localStorage.setItem(AppCachedKeys.NewAddrFormat, `${is}`)
      setIsNew(is)
    },
  }
}

export const useNewAddr = (addr: string) =>
  useMemo(() => {
    if (addr.startsWith('0x')) {
      return addr
    }
    try {
      const isAddrNew = parseAddress(addr, 'hex').startsWith('0x00')
      return isAddrNew ? addr : deprecatedAddrToNewAddr(addr)
    } catch {
      return addr
    }
  }, [addr])

export const useDeprecatedAddr = (addr: string) =>
  useMemo(() => {
    if (addr.startsWith('0x')) {
      return null
    }
    const BLAKE160_ARGS_LENGTH = 42
    try {
      const isMainnet = addr.startsWith('ckb')
      const prefix = isMainnet ? AddressPrefix.Mainnet : AddressPrefix.Testnet
      const script = addressToScript(addr)
      switch (true) {
        case script.codeHash === systemScripts.SECP256K1_BLAKE160.codeHash &&
          script.hashType === systemScripts.SECP256K1_BLAKE160.hashType &&
          script.args.length === BLAKE160_ARGS_LENGTH: {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x00',
          })
        }
        case script.codeHash === systemScripts.SECP256K1_MULTISIG.codeHash &&
          script.hashType === systemScripts.SECP256K1_MULTISIG.hashType &&
          script.args.length === BLAKE160_ARGS_LENGTH: {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x01',
          })
        }
        case script.codeHash === systemScripts.ANYONE_CAN_PAY_MAINNET.codeHash &&
          script.hashType === systemScripts.ANYONE_CAN_PAY_MAINNET.hashType &&
          script.args.length === BLAKE160_ARGS_LENGTH &&
          isMainnet: {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x02',
          })
        }
        case script.codeHash === systemScripts.ANYONE_CAN_PAY_TESTNET.codeHash &&
          script.hashType === systemScripts.ANYONE_CAN_PAY_TESTNET.hashType &&
          script.args.length === BLAKE160_ARGS_LENGTH &&
          !isMainnet: {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x02',
          })
        }
        case script.hashType === 'data': {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.DataCodeHash,
            codeHashOrCodeHashIndex: script.codeHash,
          })
        }
        case script.hashType === 'type': {
          return bech32Address(script.args, {
            prefix,
            type: AddressType.TypeCodeHash,
            codeHashOrCodeHashIndex: script.codeHash,
          })
        }
        default: {
          return null
        }
      }
    } catch {
      return null
    }
  }, [addr])

export function useChartQueryWithCache<T>(
  fetchData: () => Promise<T[] | Response.Response<Response.Wrapper<T>[]>>,
  cacheKey?: string,
  cacheMode: 'forever' | 'date' | 'epoch' = 'forever',
) {
  return useQuery([fetchData, cacheKey, cacheMode], async () => {
    if (cacheKey) {
      const fetchCache =
        // eslint-disable-next-line no-nested-ternary
        cacheMode === 'forever' ? fetchCachedData : cacheMode === 'date' ? fetchDateChartCache : fetchEpochChartCache
      const dataList = fetchCache<T[]>(cacheKey)
      if (dataList) return dataList
    }

    let dataList = await fetchData()
    if ('data' in dataList) {
      dataList = dataList.data.map(wrapper => wrapper.attributes)
    }
    if (cacheKey && dataList.length > 0) {
      const storeCache =
        // eslint-disable-next-line no-nested-ternary
        cacheMode === 'forever' ? storeCachedData : cacheMode === 'date' ? storeDateChartCache : storeEpochChartCache
      storeCache<T[]>(cacheKey, dataList)
    }
    return dataList
  })
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

const secondSignal$ = interval(1000).pipe(share())

export function useTimestamp(): number {
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    const sub = secondSignal$.subscribe(() => setTimestamp(Date.now()))
    return () => sub.unsubscribe()
  }, [])

  return timestamp
}

export function useParsedDate(timestamp: number): string {
  const now = useTimestamp()
  return parseDate(timestamp, now)
}

export default {
  useInterval,
  useTimeout,
  useTimeoutWithUnmount,
  useAddrFormatToggle,
  useNewAddr,
}
