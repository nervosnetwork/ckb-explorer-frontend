import CONFIG from '../config'

export const isMainnet = () => {
  return CONFIG.CHAIN_TYPE === 'mainnet'
}

export const isChainTypeError = (address: string): boolean => {
  if (address.startsWith('ckb') || address.startsWith('ckt')) {
    return (
      (CONFIG.CHAIN_TYPE === 'mainnet' && address.startsWith('ckt')) ||
      (CONFIG.CHAIN_TYPE === 'testnet' && address.startsWith('ckb'))
    )
  }
  return false
}

export default {
  isMainnet,
  isChainTypeError,
}
