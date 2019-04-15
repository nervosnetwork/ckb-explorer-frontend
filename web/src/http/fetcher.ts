import axios, { AxiosResponse } from 'axios'
import ErrorTexts from './errors'
import BlocksData from './mock/home'
import BlockListData from './mock/block_list'
import { AddressData, TransactionsData } from './mock/address'
import { BlockData } from './mock/block'
import { TransactionData, CellData } from './mock/transaction'

const baseURL = 'http://localhost:3000/'

const axiosIns = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
  },
})

export enum CellType {
  Input = 'input',
  Output = 'output',
}

export enum DataType {
  LockScript = 'lock_script',
  TypeScript = 'type_script',
  Data = 'data',
}

export const fetchBlocks = () => {
  return new Promise(function(resolve, reject) {
    resolve(BlocksData.data)
    if (false) reject()
  })
}

export const fetchBlocksList = () => {
  return new Promise(function(resolve, reject) {
    resolve(BlockListData)
    if (false) reject()
  })
}

export const fetchAddressInfo = (address: string) => {
  return new Promise(function(resolve, reject) {
    resolve(AddressData.data)
    if (false) reject(address)
  })
}

export const fetchTransactionsByAddress = (address: string) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionsData)
    if (false) reject(address)
  })
}

export const fetchTransactionByHash = (hash: string) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionData.data)
    if (false) reject(hash)
  })
}

export const fetchTransactionsByBlockHash = (blockHash: string) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionsData)
    if (false) reject(blockHash)
  })
}

export const fetchBlockByHash = (hash: string) => {
  return new Promise(function(resolve, reject) {
    resolve(BlockData.data)
    if (false) reject(hash)
  })
}

export const fetchScript = () => {
  return new Promise(function(resolve, reject) {
    resolve(CellData.data)
    if (false) reject()
  })
}

export const fetchBlockByNumber = (number: string) =>
  axiosIns
    .get(`blocks/${number}`)
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchTransactionsByBlockHeight = (height: number) =>
  axiosIns
    .get(`block_transactions/${height}`)
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchCells = (id: number, cellType: CellType, dataType: DataType) =>
  axiosIns
    .get('block_transactions', {
      params: {
        id: `${id}`,
        cell_type: cellType,
        data_type: dataType,
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchSearchQuery = (param: string) =>
  axiosIns
    .get('addresses', {
      params: {
        q: param,
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })
