import { bech32, bech32m } from 'bech32'
import bs58check from 'bs58check'
import { IS_MAINNET } from '../constants/common'

export enum BTCNetwork {
  Mainnet = 1,
  Testnet,
  Regtest,
}

export enum BTCAddressType {
  P2PKH = 'P2PKH',
  P2SH = 'P2SH',
  P2WPKH = 'P2WPKH',
  P2WSH = 'P2WSH',
  P2TR = 'P2TR',
  SEGWIT = 'SEGWIT',
}

export enum BTCAddressEncodeType {
  Bech32 = 'Bech32',
  Base58 = 'Base58',
}

export interface Address {
  type: BTCAddressType
  encodeType: BTCAddressEncodeType
  address: string
}
// from https://github.com/bitcoinjs/bitcoinjs-lib/blob/27a840aac4a12338f1e40c54f3759bbd7a559944/src/address.js
const fromBase58Check = (address: string) => {
  const payload = bs58check.decode(address)
  // TODO: 4.0.0, move to "toOutputScript"
  if (payload.length < 21) throw new TypeError(`${address} is too short`)
  if (payload.length > 21) throw new TypeError(`${address} is too long`)
  const version = payload[0]
  const hash = payload.slice(1)
  return { version, hash }
}

const fromBech32 = (address: string) => {
  let result
  try {
    result = bech32.decode(address)
  } catch (e) {
    try {
      result = bech32m.decode(address)
    } catch (e2) {
      throw new Error('Invalid bech32 address')
    }
  }

  if (result) {
    const version = result.words[0]
    const data = bech32.fromWords(result.words.slice(1))

    // Handle both bech32 and bech32m data lengths correctly
    return {
      version,
      prefix: result.prefix,
      data: Buffer.from(data),
    }
  }
  throw new Error('Could not decode address')
}

// from https://github.com/bitcoinjs/bitcoinjs-lib/blob/27a840aac4a12338f1e40c54f3759bbd7a559944/src/networks.js
const NETWORK = {
  bitcoin: {
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  testnet: {
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  },
}

// learn from https://github.com/bitcoinjs/bitcoinjs-lib/blob/2f7c83b286e0a58962df38e606c516983903e1a0/src/address.js#L101
export const parseBTCAddress = (address: string, isMainnet = IS_MAINNET): Address | undefined => {
  const network = isMainnet ? NETWORK.bitcoin : NETWORK.testnet

  try {
    // Try Base58 first
    const decodeBase58 = fromBase58Check(address)
    const encodeType = BTCAddressEncodeType.Base58

    if (decodeBase58.version === network.pubKeyHash) {
      return { encodeType, address, type: BTCAddressType.P2PKH }
    }
    if (decodeBase58.version === network.scriptHash) {
      return { encodeType, address, type: BTCAddressType.P2SH }
    }
  } catch (e) {
    // Try Bech32 if Base58 fails
    try {
      const decodeBech32 = fromBech32(address)
      if (decodeBech32.prefix !== network.bech32) return undefined

      const encodeType = BTCAddressEncodeType.Bech32

      if (decodeBech32.version === 0) {
        if (decodeBech32.data.length === 20) {
          return { encodeType, address, type: BTCAddressType.P2WPKH }
        }
        if (decodeBech32.data.length === 32) {
          return { encodeType, address, type: BTCAddressType.P2WSH }
        }
      }

      if (decodeBech32.version === 1 && decodeBech32.data.length === 32) {
        return { encodeType, address, type: BTCAddressType.P2TR }
      }

      // Handle future segwit addresses
      const FUTURE_SEGWIT_MAX_SIZE = 40
      const FUTURE_SEGWIT_MIN_SIZE = 2
      const FUTURE_SEGWIT_MAX_VERSION = 16
      const FUTURE_SEGWIT_MIN_VERSION = 2
      if (
        decodeBech32.version >= FUTURE_SEGWIT_MIN_VERSION &&
        decodeBech32.version <= FUTURE_SEGWIT_MAX_VERSION &&
        decodeBech32.data.length >= FUTURE_SEGWIT_MIN_SIZE &&
        decodeBech32.data.length <= FUTURE_SEGWIT_MAX_SIZE
      ) {
        return {
          encodeType: BTCAddressEncodeType.Bech32,
          address,
          type: BTCAddressType.SEGWIT,
        }
      }
    } catch (e2) {
      // Invalid address
    }
  }

  return undefined
}

export const isValidBTCAddress = (address: string, isMainnet = IS_MAINNET): boolean => {
  try {
    const parsedAddress = parseBTCAddress(address, isMainnet)

    return !!parsedAddress
  } catch (e) {
    return false
  }
}
