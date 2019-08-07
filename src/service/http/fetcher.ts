import axios, { AxiosResponse } from 'axios'
import CONFIG from '../../config'
import { CellType } from '../../utils/const'
import { toCamelcase } from '../../utils/util'

const baseURL = `${CONFIG.API_URL}/api/v1/`

export const axiosIns = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

export const fetchBlocks = () => {
  return axiosIns
    .get('blocks')
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>[]>(res.data.data))
}

export const fetchBlockList = (page: number, size: number) => {
  return axiosIns
    .get('blocks', {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Block>[]>>(res.data))
}

export const fetchAddressInfo = (address: string) => {
  return axiosIns.get(`addresses/${address}`).then((res: AxiosResponse) => res.data.data)
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
  return axiosIns.get(`transactions/${hash}`).then((res: AxiosResponse) => res.data.data)
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
}

// blockParam: block hash or block number
export const fetchBlock = (blockParam: string) => {
  return axiosIns
    .get(`blocks/${blockParam}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>>(res.data.data))
}

export const fetchScript = (cell_type: CellType, script_type: 'lock_scripts' | 'type_scripts', id: string) => {
  return axiosIns.get(`/cell_${cell_type}_${script_type}/${id}`).then((res: AxiosResponse) => res.data.data)
}

export const fetchCellData = (type: CellType, id: string) => {
  return axiosIns.get(`/cell_${type}_data/${id}`).then((res: AxiosResponse) => res.data.data)
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
  return axiosIns
    .get('statistics')
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Statistics>>(res.data.data))
}

export const fetchStatisticInfo = (infoName: string) => {
  return axiosIns.get(`statistics/${infoName}`).then((res: AxiosResponse) => res.data)
}

export const fetchTipBlockNumber = () => {
  return fetchStatisticInfo('tip_block_number').then(wrapper => wrapper.data)
}

export const fetchBlockchainInfo = () => {
  return fetchStatisticInfo('blockchain_info').then(wrapper => wrapper.data)
}

export const fetchStatisticsChart = () => {
  return axiosIns('/statistic_info_charts').then((res: AxiosResponse) => res.data.data)
}

export const fetchNodeVersion = () => {
  return axiosIns('/nets/version').then((res: AxiosResponse) => res.data.data)
}
