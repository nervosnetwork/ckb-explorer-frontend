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
  let version
  try {
    result = bech32.decode(address)
  } catch (e) {
    // ignore
  }
  if (result) {
    ;[version] = result.words
    if (version !== 0) throw new TypeError(`${address} uses wrong encoding`)
  } else {
    result = bech32m.decode(address)
    ;[version] = result.words
    if (version === 0) throw new TypeError(`${address} uses wrong encoding`)
  }
  const data = bech32.fromWords(result.words.slice(1))

  return {
    version,
    prefix: result.prefix,
    data: new Uint8Array(data),
  }
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
export const parseBTCAddress = (address: string): Address | undefined => {
  const network = IS_MAINNET ? NETWORK.bitcoin : NETWORK.testnet
  let decodeBase58
  let decodeBech32
  try {
    decodeBase58 = fromBase58Check(address)
  } catch (e) {
    // ignore
  }

  if (decodeBase58) {
    const encodeType = BTCAddressEncodeType.Base58
    if (decodeBase58.version === network.pubKeyHash) {
      // p2pkh address
      return {
        encodeType,
        address,
        type: BTCAddressType.P2PKH,
      }
    }
    if (decodeBase58.version === network.scriptHash) {
      // p2sh address
      return {
        encodeType,
        address,
        type: BTCAddressType.P2SH,
      }
    }
  }
  try {
    decodeBech32 = fromBech32(address)
  } catch (e) {
    // ignore
  }

  if (decodeBech32) {
    const encodeType = BTCAddressEncodeType.Bech32
    if (decodeBech32.prefix !== network.bech32) {
      return undefined
    }
    if (decodeBech32.version === 0) {
      if (decodeBech32.data.length === 20) {
        // p2wpkh address
        return {
          encodeType,
          address,
          type: BTCAddressType.P2WPKH,
        }
      }
      if (decodeBech32.data.length === 32) {
        // p2wsh address
        return {
          encodeType,
          address,
          type: BTCAddressType.P2WSH,
        }
      }
    }
    if (decodeBech32.version === 1) {
      if (decodeBech32.data.length === 32) {
        // p2tr address
        return {
          encodeType,
          address,
          type: BTCAddressType.P2TR,
        }
      }
    }
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
      // future segwit address
      return {
        encodeType: BTCAddressEncodeType.Bech32,
        address,
        type: BTCAddressType.SEGWIT,
      }
    }
  }
  return undefined
}

export const isValidBTCAddress = (address: string): boolean => {
  try {
    const parsedAddress = parseBTCAddress(address)

    return !!parsedAddress
  } catch (e) {
    return false
  }
}
