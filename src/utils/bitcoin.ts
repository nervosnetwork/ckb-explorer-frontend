import { Decoded, bech32, bech32m } from 'bech32'
import base58 from 'bs58'

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
}

export enum BTCAddressEncodeType {
  Bech32 = 'Bech32',
  Base58 = 'Base58',
}

export interface Address {
  type: BTCAddressType
  encodeType: BTCAddressEncodeType
  address: string
  network: BTCNetwork
}

export const parseBTCAddress = (address: string): Address | undefined => {
  if (!address) {
    return undefined
  }

  const bech32 = parseBech32Address(address)
  if (bech32) {
    return bech32
  }

  let decodedAddress: Uint8Array
  try {
    decodedAddress = base58.decode(address)
  } catch (e) {
    return undefined
  }

  const version = decodedAddress[0]

  let addressType: BTCAddressType
  let network: BTCNetwork
  switch (version) {
    case 0:
      addressType = BTCAddressType.P2PKH
      network = BTCNetwork.Mainnet
      break
    case 0x5:
      addressType = BTCAddressType.P2SH
      network = BTCNetwork.Mainnet
      break
    case 0x6f:
      addressType = BTCAddressType.P2PKH
      network = BTCNetwork.Testnet
      break
    case 0xc4:
      addressType = BTCAddressType.P2SH
      network = BTCNetwork.Testnet
      break
    default:
      return undefined
  }

  return {
    encodeType: BTCAddressEncodeType.Base58,
    address,
    network,
    type: addressType,
  }
}

export const parseBech32Address = (address: string): Address | undefined => {
  if (!address.startsWith('bc1') && !address.startsWith('tb1')) {
    return undefined
  }

  let decodedAddress: Decoded
  try {
    if (address.startsWith('bc1p') || address.startsWith('tb1p')) {
      decodedAddress = bech32m.decode(address)
    } else {
      decodedAddress = bech32.decode(address)
    }
  } catch (e) {
    return undefined
  }

  let network: BTCNetwork
  switch (decodedAddress.prefix) {
    case 'bc':
      network = BTCNetwork.Mainnet
      break
    case 'tb':
      network = BTCNetwork.Testnet
      break
    default:
      return undefined
  }

  const version = decodedAddress.words[0]
  if (version < 0 || version > 16) {
    return undefined
  }

  const data = bech32.fromWords(decodedAddress.words.slice(1))

  let addressType: BTCAddressType

  if (data.length === 20) {
    addressType = BTCAddressType.P2WPKH
  } else if (version === 1) {
    addressType = BTCAddressType.P2TR
  } else {
    addressType = BTCAddressType.P2WSH
  }

  return {
    encodeType: BTCAddressEncodeType.Bech32,
    address,
    network,
    type: addressType,
  }
}

export const isValidBTCAddress = (address: string, network?: BTCNetwork): boolean => {
  try {
    const parsedAddress = parseBTCAddress(address)

    if (network) {
      return parsedAddress ? parsedAddress.network === network : false
    }

    return !!parsedAddress
  } catch (e) {
    return false
  }
}
