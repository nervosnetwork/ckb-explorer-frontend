# CKB Explorer

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/nervosnetwork/ckb-explorer-frontend/blob/develop/COPYING)
[![TravisCI](https://travis-ci.com/nervosnetwork/ckb-explorer-frontend.svg?branch=develop)](https://travis-ci.com/nervosnetwork/ckb-explorer-frontend)
[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_ckb_dev)

CKB Explorer is a [Nervos CKB](https://github.com/nervosnetwork/ckb) blockchain explorer built with React and Ruby on Rails.

It supports searching block, transaction, address and includes two parts: [frontend](https://github.com/nervosnetwork/ckb-explorer-frontend) and [backend server](https://github.com/nervosnetwork/ckb-explorer).

## CKB Explorer Frontend

### Prerequisite

- Node: install version 11.10 or greater.
- Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/). (needs 1.13.0 or greater).
- A fork of the repo (for any contributions).
- A clone of the `ckb-explorer-frontend` repo.

### Edit .env file

You need to edit .env.develop and .env.production to set your own api url as ckb explorer server.

```shell
REACT_APP_API_URL = 'http://your-api-url'   # Set your own api url
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

### License

CKB Explorer Frontend is released under the terms of the MIT license. See [COPYING](COPYING) for more information or see [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).
