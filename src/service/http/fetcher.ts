import axios, { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import CONFIG from '../../config'
import { pick } from '../../utils/object'
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

export const v2AxiosIns = axios.create({
  baseURL: `${CONFIG.API_URL}/api/v2/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

export const fetchBlocks = (page: number, size: number) =>
  axiosIns
    .get('blocks', {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Block>[]>>(res.data))

export const fetchLatestBlocks = (size: number) => fetchBlocks(1, size)

export const fetchAddressInfo = (address: string) =>
  axiosIns
    .get(`addresses/${address}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Address>>(res.data.data))

export const fetchTransactionsByAddress = (address: string, page: number, size: number) =>
  axiosIns
    .get(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchTransactionByHash = (hash: string) =>
  axiosIns
    .get(`transactions/${hash}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data))

export const fetchTransactionLiteDetailsByHash = (hash: string) =>
  v2AxiosIns
    .get(`ckb_transactions/${hash}/details`)
    .then((res: AxiosResponse) => toCamelcase<Response.Response<State.TransactionLiteDetails[]>>(res.data))

export const fetchTransactions = (page: number, size: number) =>
  axiosIns
    .get('transactions', {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchLatestTransactions = (size: number) => fetchTransactions(1, size)

export const fetchPendingTransactions = (page: number, size: number) =>
  v2AxiosIns
    .get('pending_transactions', {
      params: {
        page,
        page_size: size,
      },
    })
    .then(res => toCamelcase<Response.Response<State.Transaction[]>>(res.data))

export const fetchPendingTransactionsCount = () => fetchPendingTransactions(1, 1).then(resp => resp.meta?.total)

export const fetchTransactionsByBlockHash = (blockHash: string, page: number, size: number) =>
  axiosIns
    .get(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size: size,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchBlock = (blockHeightOrHash: string) =>
  axiosIns
    .get(`blocks/${blockHeightOrHash}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>>(res.data.data))

export const fetchScript = (scriptType: 'lock_scripts' | 'type_scripts', id: string) =>
  axiosIns
    .get(`/cell_output_${scriptType}/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Script>>(res.data.data))

export const fetchCellData = (id: string) =>
  axiosIns
    .get(`/cell_output_data/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Data>>(res.data.data))

export const fetchSearchResult = (param: string) =>
  axiosIns
    .get('suggest_queries', {
      params: {
        q: param,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<any>(res.data))

export const fetchStatistics = () =>
  axiosIns
    .get('statistics')
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Statistics>>(res.data.data))

export const fetchStatisticInfo = (infoName: string) =>
  axiosIns.get(`statistics/${infoName}`).then((res: AxiosResponse) => res.data)

export const fetchTipBlockNumber = () =>
  fetchStatisticInfo('tip_block_number').then(wrapper => toCamelcase<Response.Wrapper<State.Statistics>>(wrapper.data))

export const fetchBlockchainInfo = () =>
  fetchStatisticInfo('blockchain_info').then(wrapper =>
    toCamelcase<Response.Wrapper<State.BlockchainInfo>>(wrapper.data),
  )

export const fetchNodeVersion = () =>
  axiosIns('/nets/version').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NodeVersion>>(res.data.data),
  )

export const fetchNervosDao = () =>
  axiosIns('/contracts/nervos_dao').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NervosDao>>(res.data.data),
  )

export const fetchNervosDaoTransactions = (page: number, size: number) =>
  axiosIns('/contract_transactions/nervos_dao', {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchNervosDaoTransactionsByHash = (hash: string) =>
  axiosIns(`/dao_contract_transactions/${hash}`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data),
  )

export const fetchNervosDaoTransactionsByAddress = (address: string, page: number, size: number) =>
  axiosIns(`/address_dao_transactions/${address}`, {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchNervosDaoDepositors = () =>
  axiosIns(`/dao_depositors`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.NervosDaoDepositor>[]>>(res.data),
  )

export const fetchStatisticTransactionCount = () =>
  axiosIns(`/daily_statistics/transactions_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]>>(res.data),
  )

export const fetchStatisticAddressCount = () =>
  axiosIns(`/daily_statistics/addresses_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticAddressCount>[]>>(res.data),
  )

export const fetchStatisticTotalDaoDeposit = () =>
  axiosIns(`/daily_statistics/total_depositors_count-total_dao_deposit`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]>>(res.data),
  )

export const fetchStatisticNewDaoDeposit = () =>
  axiosIns(`/daily_statistics/daily_dao_deposit-daily_dao_depositors_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoDeposit>[]>>(res.data),
  )

export const fetchStatisticNewDaoWithdraw = () =>
  axiosIns(`/daily_statistics/daily_dao_withdraw`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]>>(res.data),
  )

export const fetchStatisticCirculationRatio = () =>
  axiosIns(`/daily_statistics/circulation_ratio`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticCirculationRatio>[]>>(res.data),
  )

export const fetchStatisticDifficultyHashRate = () =>
  axiosIns(`/epoch_statistics/difficulty-uncle_rate-hash_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        attributes: {
          // Data may enter the cache, so it is purify to reduce volume.
          ...pick(wrapper.attributes, ['difficulty', 'epochNumber']),
          uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
          hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toString(),
        },
      })),
    }
  })

export const fetchStatisticDifficulty = () =>
  axiosIns(`/daily_statistics/avg_difficulty`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficulty>[]>>(res.data),
  )

export const fetchStatisticHashRate = () =>
  axiosIns(`/daily_statistics/avg_hash_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticHashRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        attributes: {
          ...wrapper.attributes,
          avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toString(),
        },
      })),
    }
  })

export const fetchStatisticUncleRate = () =>
  axiosIns(`/daily_statistics/uncle_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticUncleRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        attributes: {
          ...wrapper.attributes,
          uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        },
      })),
    }
  })

export const fetchStatisticMinerAddressDistribution = () =>
  axiosIns(`/distribution_data/miner_address_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticMinerAddressDistribution>>(res.data.data),
  )

export const fetchStatisticMinerVersionDistribution = () =>
  v2AxiosIns(`/blocks/ckb_node_versions`).then((res: AxiosResponse) =>
    toCamelcase<{ data: Array<{ version: string; blocksCount: number }> }>(res.data),
  )

export const fetchStatisticCellCount = (): Promise<Response.Response<Response.Wrapper<State.StatisticCellCount>[]>> =>
  axiosIns(`/daily_statistics/live_cells_count-dead_cells_count`).then(res => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<Omit<State.StatisticCellCount, 'allCellsCount'>>[]>>(
      res.data,
    )
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        attributes: {
          ...wrapper.attributes,
          allCellsCount: (
            Number(wrapper.attributes.liveCellsCount) + Number(wrapper.attributes.deadCellsCount)
          ).toString(),
        },
      })),
    }
  })

export const fetchStatisticDifficultyUncleRateEpoch = () =>
  axiosIns(`/epoch_statistics/epoch_time-epoch_length`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRateEpoch>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        // Data may enter the cache, so it is purify to reduce volume.
        attributes: pick(wrapper.attributes, ['epochNumber', 'epochTime', 'epochLength']),
      })),
    }
  })

export const fetchStatisticAddressBalanceRank = () =>
  axiosIns(`/statistics/address_balance_ranking`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceRanking>>(res.data.data),
  )

export const fetchStatisticBalanceDistribution = () =>
  axiosIns(`/distribution_data/address_balance_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceDistribution>>(res.data.data),
  )

export const fetchStatisticTxFeeHistory = () =>
  axiosIns(`/daily_statistics/total_tx_fee`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionFee>[]>>(res.data),
  )

export const fetchStatisticBlockTimeDistribution = () =>
  axiosIns(`/distribution_data/block_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticBlockTimeDistributions>>(res.data.data),
  )

export const fetchStatisticAverageBlockTimes = () =>
  axiosIns(`/distribution_data/average_block_time`).then((res: AxiosResponse) => {
    const {
      attributes: { averageBlockTime },
    } = toCamelcase<Response.Wrapper<State.StatisticAverageBlockTimes>>(res.data.data)
    return averageBlockTime
  })

export const fetchStatisticOccupiedCapacity = () =>
  axiosIns(`/daily_statistics/occupied_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticOccupiedCapacity>[]>>(res.data),
  )

export const fetchStatisticEpochTimeDistribution = () =>
  axiosIns(`/distribution_data/epoch_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticEpochTimeDistributions>>(res.data.data),
  )

export const fetchStatisticNewNodeCount = () =>
  axiosIns(`/daily_statistics/nodes_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]>>(res.data),
  )

export const fetchStatisticNodeDistribution = () =>
  axiosIns(`/distribution_data/nodes_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticNodeDistributions>>(res.data.data),
  )

export const fetchStatisticTotalSupply = () =>
  axiosIns(`/daily_statistics/circulating_supply-burnt-locked_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalSupply>[]>>(res.data),
  )

export const fetchStatisticAnnualPercentageCompensation = () =>
  axiosIns(`/monetary_data/nominal_apc`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAnnualPercentageCompensations>>(res.data.data),
  )

export const fetchStatisticSecondaryIssuance = () =>
  axiosIns(`/daily_statistics/treasury_amount-mining_reward-deposit_compensation`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticSecondaryIssuance>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => {
        const { depositCompensation, miningReward, treasuryAmount } = wrapper.attributes
        const sum = Number(treasuryAmount) + Number(miningReward) + Number(depositCompensation)
        const treasuryAmountPercent = Number(((Number(treasuryAmount) / sum) * 100).toFixed(2))
        const miningRewardPercent = Number(((Number(miningReward) / sum) * 100).toFixed(2))
        const depositCompensationPercent = (100 - treasuryAmountPercent - miningRewardPercent).toFixed(2)
        return {
          ...wrapper,
          attributes: {
            ...wrapper.attributes,
            treasuryAmount: treasuryAmountPercent.toString(),
            miningReward: miningRewardPercent.toString(),
            depositCompensation: depositCompensationPercent,
          },
        }
      }),
    }
  })

export const fetchStatisticInflationRate = () =>
  axiosIns(`/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticInflationRates>>(res.data.data),
  )

export const fetchStatisticLiquidity = () =>
  axiosIns(`/daily_statistics/circulating_supply-liquidity`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticLiquidity>[]>>(res.data)
    return {
      ...resp,
      data: resp.data.map(wrapper => ({
        ...wrapper,
        attributes: {
          ...wrapper.attributes,
          daoDeposit: new BigNumber(wrapper.attributes.circulatingSupply)
            .minus(new BigNumber(wrapper.attributes.liquidity))
            .toFixed(2),
        },
      })),
    }
  })

export const fetchFlushChartCache = () =>
  axiosIns(`statistics/flush_cache_info`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticCacheInfo>>(res.data.data),
  )

export const fetchSimpleUDT = (typeHash: string) =>
  axiosIns(`/udts/${typeHash}`).then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.UDT>>(res.data.data))

export const fetchSimpleUDTTransactions = (typeHash: string, page: number, size: number) =>
  axiosIns(`/udt_transactions/${typeHash}`, {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchSimpleUDTTransactionsWithAddress = (address: string, typeHash: string, page: number, size: number) =>
  axiosIns(`/address_udt_transactions/${address}`, {
    params: {
      type_hash: typeHash,
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchTokens = (page: number, size: number) =>
  axiosIns(`/udts`, {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.UDT>[]>>(res.data))

export const fetchMaintenanceInfo = () =>
  axiosIns(`/statistics/maintenance_info`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.MaintenanceInfo>>(res.data.data),
  )
