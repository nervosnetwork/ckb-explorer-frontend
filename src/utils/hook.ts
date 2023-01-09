import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
  AddressPrefix,
  addressToScript,
  AddressType,
  bech32Address,
  parseAddress,
  systemScripts,
} from '@nervosnetwork/ckb-sdk-utils'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { AppCachedKeys } from '../constants/cache'
import { deprecatedAddrToNewAddr } from './util'
import { parsePageNumber } from './string'
import { ListPageParams, PageParams } from '../constants/common'

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

function getSearchParams<T extends string = string>(search: string, names?: T[]): Partial<Record<T, string>> {
  const params = queryString.parse(search, { parseBooleans: false, parseNumbers: false })
  const entries = Object.entries(params).filter((entry): entry is [T, string] => {
    const [key, value] = entry
    return (names == null || (names as string[]).includes(key)) && typeof value === 'string'
  })
  return Object.fromEntries(entries) as Partial<Record<T, string>>
}

export function useSearchParams<T extends string>(...names: T[]): Partial<Record<T, string>> {
  const location = useLocation()
  return useMemo(() => getSearchParams(location.search, names), [location.search, names])
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
      const to = queryString.stringifyUrl({
        url: `${pathname}${hash}`,
        query: newParams,
      })

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

  return {
    currentPage: Math.min(currentPage, maxPage),
    pageSize: Math.min(pageSize, maxPageSize),
    setPage,
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

export default {
  useInterval,
  useTimeout,
  useTimeoutWithUnmount,
  useAddrFormatToggle,
  useNewAddr,
}
