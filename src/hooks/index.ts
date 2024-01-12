import { useEffect, useState, useRef, useMemo, useCallback, Dispatch, SetStateAction } from 'react'
import {
  AddressPrefix,
  addressToScript,
  AddressType,
  bech32Address,
  parseAddress,
  systemScripts,
} from '@nervosnetwork/ckb-sdk-utils'
import { interval, share } from 'rxjs'
import { deprecatedAddrToNewAddr } from '../utils/util'
import { useParseDate } from '../utils/date'

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

export function useForkedState<S>(basedState: S): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(basedState)
  useEffect(() => setState(basedState), [basedState])
  return [state, setState]
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
  const toggle = useCallback((newState?: boolean) => {
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

export function useDelayLoading(delay: number, loading: boolean) {
  const [isDelayFinished, delayFinishedCtl] = useBoolean(false)
  useTimeout(delayFinishedCtl.on, delay)
  return isDelayFinished && loading
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

const secondSignal$ = interval(1000).pipe(share())

export function useTimestamp(): number {
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    const sub = secondSignal$.subscribe(() => setTimestamp(Date.now()))
    return () => sub.unsubscribe()
  }, [])

  return timestamp
}

export function useParsedDate(timestamp: number | string): string {
  const parseDate = useParseDate()
  const now = useTimestamp()
  return parseDate(timestamp, now)
}

export * from './browser'
export * from './route'
export * from './halving'
export * from './useDASAccount'
