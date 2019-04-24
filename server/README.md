# CKB Explorer Server
[![TravisCI](https://travis-ci.com/nervosnetwork/ckb-explorer.svg?branch=develop)](https://travis-ci.com/nervosnetwork/ckb-explorer)

[CKB](https://github.com/nervosnetwork/ckb) block explorer server

## Prerequisites

- [postgresql](https://www.postgresql.org/) 9.4 and above
- install secp256k1 (see [secp256k1](https://github.com/bitcoin-core/secp256k1.git) for more info)

```shell
  $ git clone https://github.com/bitcoin-core/secp256k1.git && cd secp256k1 && ./autogen.sh && ./configure --enable-module-recovery --enable-experimental --enable-module-ecdh && make && sudo make install && cd ..
```

## Initial Project

```shell
$ cd ckb-explorer/server
$ bin/setup
$ touch .env.local (overwrite `.env` config if you need in `.env.local`, such as DB_USERNAME, DB_PASSWORD...)
```

## Running Test

```shell
$ bundle exec rails test
```

## Run Project

```shell
$ bundle exec rails s

# start sync process
$ bundle exec rails daemons:inauthentic_sync:start
# run `rails daemons:inauthentic_sync:stop` to stop it
# run `rails daemons:inauthentic_sync:restart` to restart it
# run `rails daemons:inauthentic_sync:status` to see status

# start validator process
$ bundle exec rails daemons:authentic_sync:start
# run `rails daemons:authentic_sync:stop` to stop it
# run `rails daemons:authentic_sync:restart` to restart it
# run `rails daemons:authentic_sync:status` to see status
```

## Deploy

You can deploy this via [mina](https://github.com/mina-deploy/mina)

```shell
$ mina setup
$ mina staging deploy
```


