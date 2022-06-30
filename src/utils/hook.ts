import { useEffect, useState, useRef, useMemo } from 'react'
import {
  AddressPrefix,
  addressToScript,
  AddressType,
  bech32Address,
  parseAddress,
  systemScripts,
} from '@nervosnetwork/ckb-sdk-utils'
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
