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
  return axiosIns.get('blocks').then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>[]>(res.data.data))
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

export const fetchTransactionsByAddress = (address: string, page: number, size: number) => {
  return axiosIns
    .get(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
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

export const fetchTransactions = (page: number, size: number) => {
  return axiosIns
    .get('transactions', {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchTransactionsByBlockHash = (blockHash: string, page: number, size: number) => {
  return axiosIns
    .get(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size: size,
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

export const fetchScript = (scriptType: 'lock_scripts' | 'type_scripts', id: string) => {
  return axiosIns
    .get(`/cell_output_${scriptType}/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Script>>(res.data.data))
}

export const fetchCellData = (id: string) => {
  return axiosIns
    .get(`/cell_output_data/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Data>>(res.data.data))
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
  return axiosIns.get('statistics').then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Statistics>>(res.data.data))
}

export const fetchStatisticInfo = (infoName: string) => {
  return axiosIns.get(`statistics/${infoName}`).then((res: AxiosResponse) => res.data)
}

export const fetchTipBlockNumber = () => {
  return fetchStatisticInfo('tip_block_number').then(wrapper => toCamelcase<Response.Wrapper<State.Statistics>>(wrapper.data))
}

export const fetchBlockchainInfo = () => {
  return fetchStatisticInfo('blockchain_info').then(wrapper => toCamelcase<Response.Wrapper<State.BlockchainInfo>>(wrapper.data))
}

export const fetchNodeVersion = () => {
  return axiosIns('/nets/version').then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.NodeVersion>>(res.data.data))
}

export const fetchNervosDao = () => {
  return axiosIns('/contracts/nervos_dao').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NervosDao>>(res.data.data),
  )
}

export const fetchNervosDaoTransactions = (page: number, size: number) => {
  return axiosIns('/contract_transactions/nervos_dao', {
    params: {
      page,
      page_size: size,
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
  return axiosIns(`/daily_statistics/total_depositors_count-total_dao_deposit`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]>>(res.data),
  )
}

export const fetchStatisticNewDaoDeposit = () => {
  return axiosIns(`/daily_statistics/daily_dao_deposit-daily_dao_depositors_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoDeposit>[]>>(res.data),
  )
}

export const fetchStatisticNewDaoWithdraw = () => {
  return axiosIns(`/daily_statistics/daily_dao_withdraw`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]>>(res.data),
  )
}

export const fetchStatisticCirculationRatio = () => {
  return axiosIns(`/daily_statistics/circulation_ratio`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticCirculationRatio>[]>>(res.data),
  )
}

export const fetchStatisticDifficultyHashRate = () => {
  return axiosIns(`/epoch_statistics/difficulty-hash_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]>>(res.data),
  )
}

export const fetchStatisticDifficulty = () => {
  return axiosIns(`/daily_statistics/avg_difficulty`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficulty>[]>>(res.data),
  )
}

export const fetchStatisticHashRate = () => {
  return axiosIns(`/daily_statistics/avg_hash_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticHashRate>[]>>(res.data),
  )
}

export const fetchStatisticUncleRate = () => {
  return axiosIns(`/daily_statistics/uncle_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticUncleRate>[]>>(res.data),
  )
}

export const fetchStatisticMinerAddressDistribution = () => {
  return axiosIns(`/distribution_data/miner_address_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticMinerAddressDistribution>>(res.data.data),
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

export const fetchStatisticBalanceDistribution = () => {
  return axiosIns(`/distribution_data/address_balance_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceDistribution>>(res.data.data),
  )
}

export const fetchStatisticTxFeeHistory = () => {
  return axiosIns(`/daily_statistics/total_tx_fee`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionFee>[]>>(res.data),
  )
}

export const fetchStatisticBlockTimeDistribution = () => {
  return axiosIns(`/distribution_data/block_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticBlockTimeDistributions>>(res.data.data),
  )
}

export const fetchStatisticAverageBlockTimes = () => {
  return axiosIns(`/distribution_data/average_block_time`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAverageBlockTimes>>(res.data.data),
  )
}

export const fetchStatisticOccupiedCapacity = () => {
  return axiosIns(`/daily_statistics/occupied_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticOccupiedCapacity>[]>>(res.data),
  )
}

export const fetchStatisticEpochTimeDistribution = () => {
  return axiosIns(`/distribution_data/epoch_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticEpochTimeDistributions>>(res.data.data),
  )
}

export const fetchStatisticNewNodeCount = () => {
  return axiosIns(`/daily_statistics/nodes_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]>>(res.data),
  )
}

export const fetchStatisticNodeDistribution = () => {
  return axiosIns(`/distribution_data/nodes_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticNodeDistributions>>(res.data.data),
  )
}

export const fetchStatisticTotalSupply = () => {
  return axiosIns(`/daily_statistics/circulating_supply-burnt-locked_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticTotalSupply>[]>(res.data.data),
  )
}

export const fetchStatisticAnnualPercentageCompensation = () => {
  return axiosIns(`/monetary_data/nominal_apc`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAnnualPercentageCompensations>>(res.data.data),
  )
}

export const fetchStatisticSecondaryIssuance = () => {
  return axiosIns(`/daily_statistics/treasury_amount-mining_reward-deposit_compensation`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticSecondaryIssuance>[]>(res.data.data),
  )
}

export const fetchStatisticInflationRate = () => {
  return axiosIns(`/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticInflationRates>>(res.data.data),
  )
}

export const fetchStatisticLiquidity = () => {
  return axiosIns(`/daily_statistics/circulating_supply-liquidity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticLiquidity>[]>(res.data.data),
  )
}

export const fetchFlushChartCache = () => {
  return axiosIns(`statistics/flush_cache_info`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticCacheInfo>>(res.data.data),
  )
}

export const fetchSimpleUDT = (typeHash: string) => {
  return axiosIns(`/udts/${typeHash}`).then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.UDT>>(res.data.data))
}

export const fetchSimpleUDTTransactions = (typeHash: string, page: number, size: number) => {
  return axiosIns(`/udt_transactions/${typeHash}`, {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchSimpleUDTTransactionsWithAddress = (address: string, typeHash: string, page: number, size: number) => {
  return axiosIns(`/address_udt_transactions/${address}`, {
    params: {
      type_hash: typeHash,
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))
}

export const fetchTokens = () => {
  return axiosIns(`/udts`).then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.UDT>[]>(res.data.data))
}

export const fetchMaintenanceInfo = () => {
  return axiosIns(`/statistics/maintenance_info`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.MaintenanceInfo>>(res.data.data),
  )
}
