export default {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  CHAIN_TYPE: process.env.REACT_APP_CHAIN_TYPE || 'mainnet',
  BASE_URL: process.env.REACT_APP_BASE_URL || 'explorer.nervos.org/',
  BACKUP_NODES: process.env.REACT_APP_BACKUP_NODES?.split(',') || [],
  BITCOIN_EXPLORER: process.env.REACT_APP_BITCOIN_EXPLORER || 'https://mempool.space',
  PROB_NODE: process.env.REACT_APP_PROB_NODE || 'http://localhost:1800',
}
