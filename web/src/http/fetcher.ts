import axios, { AxiosResponse } from 'axios'
import ErrorTexts from './errors'
import BlocksData from './mock/home'
import BlockListData from './mock/block_list'
import { AddressData, TransactionsData } from './mock/address'
import { BlockData } from './mock/block'
import { TransactionData, LockScriptData, CellData } from './mock/transaction'

const baseURL = 'http://localhost:3000/'

export const axiosIns = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
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

export const fetchBlockList = (page: number, size: number) => {
  return new Promise(function(resolve, reject) {
    resolve(BlockListData)
    if (false) reject(new Error(`${page}${size}`))
  })
}

export const fetchAddressInfo = (address: string) => {
  return new Promise(function(resolve, reject) {
    resolve(AddressData.data.attributes)
    if (false) reject(address)
  })
}

export const fetchTransactionsByAddress = (address: string, page: number, size: number) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionsData)
    if (false) reject(new Error(`${address}${page}${size}`))
  })
}

export const fetchTransactionByHash = (hash: string) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionData.data.attributes)
    if (false) reject(hash)
  })
}

export const fetchTransactionsByBlockHash = (blockHash: string, page: number, size: number) => {
  return new Promise(function(resolve, reject) {
    resolve(TransactionsData)
    if (false) reject(new Error(`${blockHash}${page}${size}`))
  })
}

export const fetchBlockByHash = (hash: string) => {
  return new Promise(function(resolve, reject) {
    resolve(BlockData.data.attributes)
    if (false) reject(hash)
  })
}

export const fetchScript = () => {
  return new Promise(function(resolve, reject) {
    resolve(LockScriptData.data.attributes)
    if (false) reject()
  })
}

export const fetchCellData = () => {
  return new Promise(function(resolve, reject) {
    resolve(CellData.data.attributes)
    if (false) reject()
  })
}

export const fetchSearchResult = (q: string) => {
  return new Promise(function(resolve, reject) {
    resolve(AddressData.data)
    if (false) reject(q)
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
