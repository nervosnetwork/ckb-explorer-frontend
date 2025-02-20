<p align="center"><a href="https://explorer.nervos.org" target="_blank" rel="noopener noreferrer"><img height="60px" src="./public/ckb_logo.png" alt="ckb explorer logo"></a></p>

<h1 align="center">CKB Explorer</h1>

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/nervosnetwork/ckb-explorer-frontend/blob/develop/COPYING)
[![Github Actions CI](https://github.com/nervosnetwork/ckb-explorer-frontend/workflows/CI/badge.svg?branch=develop)](https://github.com/nervosnetwork/ckb-explorer-frontend/actions)
[![Discord](https://img.shields.io/discord/956765352514183188?label=Discord&logo=discord&style=default&color=grey&labelColor=5865F2&logoColor=white)](https://discord.gg/RsyKyejxAW)

CKB Explorer is a blockchain explorer for [Nervos CKB](https://github.com/nervosnetwork/ckb), built with modern web technologies. It consists of two parts:

- [CKB Explorer Frontend](https://github.com/nervosnetwork/ckb-explorer-frontend) (This repository)
- [CKB Explorer Server](https://github.com/nervosnetwork/ckb-explorer)

Visit the live explorer at [explorer.nervos.org](https://explorer.nervos.org).

## Features

- **Blockchain Exploration**

  - Browse blocks, transactions, addresses and lock hashes
  - Track transaction lifecycle and UTXO details
  - Advanced search functionality for various blockchain entities
  - Real-time updates and data synchronization

- **Bitcoin Interoperability**

  - Support for Bitcoin addresses and transactions
  - Cross-chain transaction tracking
  - BTC-CKB bridge monitoring

- **Fiber Network Integration**

  - Network statistics and metrics
  - Channel management and monitoring
  - Liquidity tracking and analysis

- **User Experience**
  - Responsive design for all devices
  - Multi-language support (English, Chinese)
  - Distinct themes for Mainnet and Testnet
  - Intuitive navigation and data visualization

## Getting Started

### Prerequisites

- Node.js v18.13.0 or later
- Yarn 1.13.0 or later
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/nervosnetwork/ckb-explorer-frontend.git

# Navigate to project directory
cd ckb-explorer-frontend

# Install dependencies
yarn install
```

### Configuration

Create or modify the environment files:

- `.env.development` for development
- `.env.production` for production

```env
# Required environment variables
REACT_APP_API_URL='http://your-api-url'        # API endpoint
REACT_APP_CHAIN_TYPE='testnet'                 # 'mainnet' or 'testnet'
REACT_APP_MAINNET_URL='http://localhost:3000'  # Mainnet URL for testnet deployment
REACT_APP_TESTNET_NAME='testnet'               # Testnet name for header display
```

### Development

```bash
# Start development server
yarn start

# Run tests
yarn test

# Build for production
yarn build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API and services
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── assets/         # Static assets
├── styles/         # Global styles
└── __tests__/      # Test files
```

## API Documentation

API documentation is available at [CKB Explorer API Docs](https://nervosnetwork.github.io/ckb-explorer/public/api_doc.html).

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Community

- Join our [Discord](https://discord.gg/RsyKyejxAW) for discussions
- Follow us on [Twitter](https://twitter.com/NervosNetwork)
- Read our [Documentation](https://docs.nervos.org)

## License

CKB Explorer Frontend is released under the MIT License. See [COPYING](COPYING) for more information or see [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).
