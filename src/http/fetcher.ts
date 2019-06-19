import axios, { AxiosResponse } from 'axios'
import CONFIG from '../config'

const baseURL = `${CONFIG.API_URL}/api/v1/`

export const axiosIns = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
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
  return axiosIns.get('blocks').then((res: AxiosResponse) => res.data)
}

export const fetchBlockList = (page: number, size: number) => {
  return axiosIns
    .get('blocks', {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => res.data)
}

export const fetchAddressInfo = (address: string) => {
  return axiosIns.get(`addresses/${address}`).then((res: AxiosResponse) => res.data)
}

export const fetchTransactionsByAddress = (address: string, page: number, page_size: number) => {
  return axiosIns
    .get(`address_transactions/${address}`, {
      params: {
        page,
        page_size,
      },
    })
    .then((res: AxiosResponse) => res.data)
}

export const fetchTransactionByHash = (hash: string) => {
  return axiosIns.get(`transactions/${hash}`).then((res: AxiosResponse) => res.data)
}

export const fetchTransactionsByBlockHash = (blockHash: string, page: number, page_size: number) => {
  return axiosIns
    .get(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(`${blockHash}${page}${page_size}`)
    })
}

export const fetchBlockByHash = (hash: string) => {
  return axiosIns.get(`blocks/${hash}`).then((res: AxiosResponse) => res.data)
}

export const fetchScript = (cell_type: CellType, script_type: 'lock_scripts' | 'type_scripts', id: string) => {
  return axiosIns.get(`/cell_${cell_type}_${script_type}/${id}`).then((res: AxiosResponse) => res.data)
}

export const fetchCellData = (type: CellType, id: string) => {
  return axiosIns.get(`/cell_${type}_data/${id}`).then((res: AxiosResponse) => res.data.data.attributes)
}

export const fetchBlockByNumber = (number: string) => {
  return axiosIns.get(`blocks/${number}`).then((res: AxiosResponse) => res.data)
}

export const fetchTransactionsByBlockHeight = (height: number) => {
  return axiosIns.get(`block_transactions/${height}`).then((res: AxiosResponse) => res.data)
}

export const fetchCells = (id: number, cellType: CellType, dataType: DataType) => {
  return axiosIns
    .get('block_transactions', {
      params: {
        id: `${id}`,
        cell_type: cellType,
        data_type: dataType,
      },
    })
    .then((res: AxiosResponse) => res.data)
}

export const fetchSearchResult = (param: string) => {
  return axiosIns
    .get('suggest_queries', {
      params: {
        q: param,
      },
    })
    .then((res: AxiosResponse) => res.data)
}

export const fetchStatistics = () => {
  return axiosIns.get('statistics').then((res: AxiosResponse) => res.data)
}
