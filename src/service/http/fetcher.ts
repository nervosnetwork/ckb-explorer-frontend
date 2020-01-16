import axios, { AxiosResponse } from 'axios'
import CONFIG from '../../config'
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
  return axiosIns
    .get(`addresses/${address}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Address>>(res.data.data))
}

export const fetchTransactionsByAddress = (address: string, page: number, page_size: number) => {
  return axiosIns
    .get(`address_transactions/${address}`, {
      params: {
        page,
        page_size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchTransactionByHash = (hash: string) => {
  return axiosIns
    .get(`transactions/${hash}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data))
}

export const fetchLatestTransactions = () => {
  return axiosIns
    .get('transactions')
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchTransactions = (page: number, page_size: number) => {
  return axiosIns
    .get('transactions', {
      params: {
        page,
        page_size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchTransactionsByBlockHash = (blockHash: string, page: number, page_size: number) => {
  return axiosIns
    .get(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

// blockParam: block hash or block number
export const fetchBlock = (blockParam: string) => {
  return axiosIns
    .get(`blocks/${blockParam}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>>(res.data.data))
}

export const fetchScript = (script_type: 'lock_scripts' | 'type_scripts', id: string) => {
  return axiosIns.get(`/cell_output_${script_type}/${id}`).then((res: AxiosResponse) => res.data.data)
}

export const fetchCellData = (id: string) => {
  return axiosIns.get(`/cell_output_data/${id}`).then((res: AxiosResponse) => res.data.data)
}

export const fetchSearchResult = (param: string) => {
  return axiosIns
    .get('suggest_queries', {
      params: {
        q: param,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<any>(res.data))
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
  return fetchStatisticInfo('tip_block_number').then(wrapper =>
    toCamelcase<Response.Wrapper<State.Statistics>>(wrapper.data),
  )
}

export const fetchBlockchainInfo = () => {
  return fetchStatisticInfo('blockchain_info').then(wrapper =>
    toCamelcase<Response.Wrapper<State.BlockchainInfo>>(wrapper.data),
  )
}

export const fetchStatisticsChart = () => {
  return axiosIns('/statistic_info_charts').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticsChart>>(res.data.data),
  )
}

export const fetchNodeVersion = () => {
  return axiosIns('/nets/version').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NodeVersion>>(res.data.data),
  )
}

export const fetchNervosDao = () => {
  return axiosIns('/contracts/nervos_dao').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NervosDao>>(res.data.data),
  )
}

export const fetchNervosDaoTransactions = (page: number, page_size: number) => {
  return axiosIns('/contract_transactions/nervos_dao', {
    params: {
      page,
      page_size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchNervosDaoTransactionsByHash = (hash: string) => {
  return axiosIns(`/dao_contract_transactions/${hash}`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data),
  )
}

export const fetchNervosDaoTransactionsByAddress = (address: string) => {
  return axiosIns(`/address_dao_transactions/${address}`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data),
  )
}

export const fetchNervosDaoDepositors = () => {
  return axiosIns(`/dao_depositors`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.NervosDaoDepositor>[]>>(res.data),
  )
}

export const fetchStatisticTransactionCount = () => {
  return axiosIns(`/daily_statistics/transactions_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]>>(res.data),
  )
}

export const fetchStatisticAddressCount = () => {
  return axiosIns(`/daily_statistics/addresses_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticAddressCount>[]>>(res.data),
  )
}

export const fetchStatisticTotalDaoDeposit = () => {
  return axiosIns(`/daily_statistics/total_dao_deposit`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]>>(res.data),
  )
}

export const fetchStatisticDifficultyHashRate = () => {
  return axiosIns(`/epoch_statistics/difficulty-hash_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]>>(res.data),
  )
}

export const fetchStatisticCellCount = () => {
  return axiosIns(`/daily_statistics/live_cells_count-dead_cells_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticCellCount>[]>>(res.data),
  )
}

export const fetchStatisticDifficultyUncleRate = () => {
  return axiosIns(`/epoch_statistics/difficulty-uncle_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRate>[]>>(res.data),
  )
}

export const fetchStatisticAddressBalanceRank = () => {
  return axiosIns(`/statistics/address_balance_ranking`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceRanking>>(res.data.data),
  )
}
