import CONFIG from '../config'

export const isMainnet = () => {
  return CONFIG.CHAIN_TYPE === 'mainnet'
}

export default {
  isMainnet,
}
