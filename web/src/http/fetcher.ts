import axios, { AxiosResponse } from 'axios'
import ErrorTexts from './errors'
import BlocksData from './mock/home'
import BlockListData from './mock/block_list'

const baseURL = 'http://localhost:3000/'

const axiosIns = axios.create({
  baseURL,
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
    resolve(BlockListData.data)
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

export const fetchBlockByHash = (hash: string) =>
  axiosIns
    .get(`blocks/${hash}`)
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchTransactionByHash = (hash: string) =>
  axiosIns
    .get(`transactions/${hash}`)
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchTransactionsByAddress = (address: string) =>
  axiosIns
    .get(`address_transactions/${address}`)
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchTransactionsByBlockHash = (blockHash: string) =>
  axiosIns
    .get(`block_transactions/${blockHash}`)
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

export const fetchAddressInfo = (address: string) =>
  axiosIns
    .get(`addresses/${address}`)
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
