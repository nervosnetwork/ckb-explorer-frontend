export default {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  CHAIN_TYPE: process.env.REACT_APP_CHAIN_TYPE || 'mainnet',
  BASE_URL: process.env.REACT_APP_BASE_URL || 'explorer.nervos.org/',
  BACKUP_NODES: process.env.REACT_APP_BACKUP_NODES?.split(',') || [],
  BITCOIN_EXPLORER: process.env.REACT_APP_BITCOIN_EXPLORER || 'https://mempool.space',
  PROB_NODE: process.env.REACT_APP_PROB_NODE || 'https://api-nodes.magickbase.com',
  DID_INDEXER_URL: process.env.REACT_APP_DID_INDEXER_URL?.split(',') || ['https://indexer-v1.did.id'],
  DOBS_SERVICE_URL: process.env.REACT_APP_DOBS_SERVICE_URL,
}
