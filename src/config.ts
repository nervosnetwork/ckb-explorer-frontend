export default {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  CHAIN_TYPE: process.env.REACT_APP_CHAIN_TYPE || 'mainnet',
  MAINNET_URL: process.env.REACT_APP_MAINNET_URL || 'http://localhost:3000',
  TESTNET_NAME: process.env.REACT_APP_TESTNET_NAME || 'testnet',
}
