<p align="center"><a href="https://explorer.nervos.org" target="_blank" rel="noopener noreferrer"><img height="60px" src="./src/assets/ckb_dark.png" alt="ckb explorer logo"></a></p>

<h1 align="center">CKB Explorer</h1>

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/nervosnetwork/ckb-explorer-frontend/blob/develop/COPYING)
[![TravisCI](https://travis-ci.com/nervosnetwork/ckb-explorer-frontend.svg?branch=develop)](https://travis-ci.com/nervosnetwork/ckb-explorer-frontend)
[![Github Actions CI](https://github.com/nervosnetwork/ckb-explorer-frontend/workflows/CI/badge.svg?branch=develop)](https://github.com/nervosnetwork/ckb-explorer-frontend/actions)
[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_ckb_dev)

CKB Explorer is a [Nervos CKB](https://github.com/nervosnetwork/ckb) blockchain explorer built with [React](https://reactjs.org/) and [Ruby on Rails](https://rubyonrails.org/) and includes two parts: [CKB Explorer Frontend](https://github.com/nervosnetwork/ckb-explorer-frontend) and [CKB Explorer Server](https://github.com/nervosnetwork/ckb-explorer).

See live at [CKB Explorer](https://explorer.nervos.org).

API documentation is [available here](https://nervosnetwork.github.io/ckb-explorer/public/api_doc.html).

# CKB Explorer Frontend

## Features

- Explore blocks, transactions, addresses and lock hashes

- Shows previous output and spending transaction details

- Quick-search for tx hash, address, lock hash, block hash or height

- Mobile-ready responsive design

- Translated to two languages (English and Chinese)

- Mainnet and Testnet with different theme colors

## Getting Started

### Prerequisite

- Node: install version 11.10 or greater.
- Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/). (needs 1.13.0 or greater).
- A fork of the repo (for any contributions).
- A clone of the `ckb-explorer-frontend` repo.

### Edit .env file

You need to edit .env.develop for development and .env.production for production to set your own api url as ckb explorer server.

```shell
REACT_APP_API_URL = 'http://your-api-url'        # Set your own server api url

REACT_APP_CHAIN_TYPE = 'testnet'                 # Set chain type (mainnet or testnet)

REACT_APP_MAINNET_URL = 'http://localhost:3000'  # MAINNET_URL is for deploying testnet, please ignore for development

REACT_APP_TESTNET_NAME = 'testnet'               # TESTNET_NAME will be displayed on explorer header
```

### Installation

```shell
git clone https://github.com/nervosnetwork/ckb-explorer-frontend.git
cd ckb-explorer-frontend
yarn install   # install dependency libraries
```

### Running locally

- `yarn start` to start the development server (or `npm start`, if not using Yarn).
- open `http://localhost:3000/` to open the site in your favorite browser.

### Building production

```shell
yarn build    # build ckb explorer frontend project
yarn test     # run project test cases
```

## License

CKB Explorer Frontend is released under the terms of the MIT license. See [COPYING](COPYING) for more information or see [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).
