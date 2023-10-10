import { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import { Dayjs } from 'dayjs'
import { pick } from '../../utils/object'
import { toCamelcase } from '../../utils/util'
import { requesterV1, requesterV2 } from './requester'
import { Response } from './types'

// TODO: Temporarily compatible with old code, it exists in the form of `explorerService.api.requesterV2`,
// and in the future, the `requester` should be hidden from the outside.
export { requesterV2 }

export const fetchBlocks = (page: number, size: number, sort?: string) =>
  requesterV1
    .get('blocks', {
      params: {
        page,
        page_size: size,
        sort,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Block>[]>>(res.data))

export const fetchLatestBlocks = (size: number) => fetchBlocks(1, size)

export const fetchAddressInfo = (address: string) =>
  requesterV1
    .get(`addresses/${address}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Address>>(res.data.data))

export const fetchTransactionsByAddress = (
  address: string,
  page: number,
  size: number,
  sort?: string,
  txTypeFilter?: string,
) =>
  requesterV1
    .get(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
        tx_type: txTypeFilter,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchTransactionByHash = (hash: string) =>
  requesterV1
    .get(`transactions/${hash}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data))

export const fetchTransactions = (page: number, size: number, sort?: string) =>
  requesterV1
    .get('transactions', {
      params: {
        page,
        page_size: size,
        sort,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchLatestTransactions = (size: number) => fetchTransactions(1, size)

export const fetchPendingTransactions = (page: number, size: number, sort?: string) =>
  requesterV2
    .get('pending_transactions', {
      params: {
        page,
        page_size: size,
        sort,
      },
    })
    .then(res => toCamelcase<Response.Response<State.Transaction[]>>(res.data))

export const fetchPendingTransactionsCount = () => fetchPendingTransactions(1, 1).then(resp => resp.meta?.total)

export const fetchTransactionsByBlockHash = (
  blockHash: string,
  {
    page,
    size: page_size,
    filter,
  }: Partial<{
    page: number
    size: number
    filter: string | null
  }>,
) =>
  requesterV1
    .get(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
        address_hash: filter?.startsWith('ck') ? filter : null,
        tx_hash: filter?.startsWith('0x') ? filter : null,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchBlock = (blockHeightOrHash: string) =>
  requesterV1
    .get(`blocks/${blockHeightOrHash}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Block>>(res.data.data))

export const fetchScript = (scriptType: 'lock_scripts' | 'type_scripts', id: string) =>
  requesterV1
    .get(`/cell_output_${scriptType}/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Script>>(res.data.data))

export const fetchCellData = (id: string) =>
  requesterV1
    .get(`/cell_output_data/${id}`)
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Data>>(res.data.data))

export const fetchSearchResult = (param: string) =>
  requesterV1
    .get('suggest_queries', {
      params: {
        q: param,
      },
    })
    .then((res: AxiosResponse) => toCamelcase<any>(res.data))

export const fetchStatistics = () =>
  requesterV1
    .get('statistics')
    .then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.Statistics>>(res.data.data))

export const fetchStatisticInfo = (infoName: string) =>
  requesterV1.get(`statistics/${infoName}`).then((res: AxiosResponse) => res.data)

export const fetchTipBlockNumber = () =>
  fetchStatisticInfo('tip_block_number').then(wrapper => toCamelcase<Response.Wrapper<State.Statistics>>(wrapper.data))

export const fetchBlockchainInfo = () =>
  fetchStatisticInfo('blockchain_info').then(wrapper =>
    toCamelcase<Response.Wrapper<State.BlockchainInfo>>(wrapper.data),
  )

export const fetchNodeVersion = () =>
  requesterV1('/nets/version').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NodeVersion>>(res.data.data),
  )

export const fetchNervosDao = () =>
  requesterV1('/contracts/nervos_dao').then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.NervosDao>>(res.data.data),
  )

export const fetchNervosDaoTransactions = (page: number, size: number) =>
  requesterV1('/contract_transactions/nervos_dao', {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchNervosDaoTransactionsByHash = (hash: string) =>
  requesterV1(`/dao_contract_transactions/${hash}`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.Transaction>>(res.data.data),
  )

export const fetchNervosDaoTransactionsByAddress = (address: string, page: number, size: number) =>
  requesterV1(`/address_dao_transactions/${address}`, {
    params: {
      page,
      page_size: size,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchNervosDaoTransactionsByFilter = ({
  page,
  size,
  filter,
}: {
  page: number
  size: number
  filter?: string
}) =>
  requesterV1(`/contract_transactions/nervos_dao`, {
    params: {
      page,
      page_size: size,
      tx_hash: filter?.startsWith('0x') ? filter : null,
      address_hash: filter?.startsWith('0x') ? null : filter,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchNervosDaoDepositors = () =>
  requesterV1(`/dao_depositors`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.NervosDaoDepositor>[]>>(res.data),
  )

export const fetchStatisticTransactionCount = () =>
  requesterV1(`/daily_statistics/transactions_count`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]>>(res.data)
    return {
      ...resp,
      // filter latest exceptional data out
      data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.transactionsCount !== '0'),
    }
  })

export const fetchStatisticAddressCount = () =>
  requesterV1(`/daily_statistics/addresses_count`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticAddressCount>[]>>(res.data)
    return {
      ...resp,
      // filter latest exceptional data out
      data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.addressesCount !== '0'),
    }
  })

export const fetchStatisticTotalDaoDeposit = () =>
  requesterV1(`/daily_statistics/total_depositors_count-total_dao_deposit`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]>>(res.data),
  )

export const fetchStatisticNewDaoDeposit = () =>
  requesterV1(`/daily_statistics/daily_dao_deposit-daily_dao_depositors_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoDeposit>[]>>(res.data),
  )

export const fetchStatisticNewDaoWithdraw = () =>
  requesterV1(`/daily_statistics/daily_dao_withdraw`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]>>(res.data),
  )

export const fetchStatisticCirculationRatio = () =>
  requesterV1(`/daily_statistics/circulation_ratio`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticCirculationRatio>[]>>(res.data),
  )

export const fetchStatisticDifficultyHashRate = () =>
  requesterV1(`/epoch_statistics/difficulty-uncle_rate-hash_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data
        // filter latest exceptional data out
        .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.hashRate !== '0.0')
        .map(wrapper => ({
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
  requesterV1(`/daily_statistics/avg_difficulty`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticDifficulty>[]>>(res.data)
    return {
      ...resp,
      // filter latest exceptional data out
      data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.avgDifficulty !== '0.0'),
    }
  })

export const fetchStatisticHashRate = () =>
  requesterV1(`/daily_statistics/avg_hash_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticHashRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data
        // filter latest exceptional data out
        .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.avgHashRate !== '0.0')
        .map(wrapper => ({
          ...wrapper,
          attributes: {
            ...wrapper.attributes,
            avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toString(),
          },
        })),
    }
  })

export const fetchStatisticUncleRate = () =>
  requesterV1(`/daily_statistics/uncle_rate`).then((res: AxiosResponse) => {
    const resp = toCamelcase<Response.Response<Response.Wrapper<State.StatisticUncleRate>[]>>(res.data)
    return {
      ...resp,
      data: resp.data
        // filter latest exceptional data out
        .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.uncleRate !== '0')
        .map(wrapper => ({
          ...wrapper,
          attributes: {
            ...wrapper.attributes,
            uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
          },
        })),
    }
  })

export const fetchStatisticMinerAddressDistribution = () =>
  requesterV1(`/distribution_data/miner_address_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticMinerAddressDistribution>>(res.data.data),
  )

export const fetchStatisticMinerVersionDistribution = () =>
  requesterV2(`/blocks/ckb_node_versions`).then((res: AxiosResponse) =>
    toCamelcase<{ data: Array<{ version: string; blocksCount: number }> }>(res.data),
  )

export const fetchStatisticCellCount = (): Promise<Response.Response<Response.Wrapper<State.StatisticCellCount>[]>> =>
  requesterV1(`/daily_statistics/live_cells_count-dead_cells_count`).then(res => {
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
  requesterV1(`/epoch_statistics/epoch_time-epoch_length`).then((res: AxiosResponse) => {
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
  requesterV1(`/statistics/address_balance_ranking`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceRanking>>(res.data.data),
  )

export const fetchStatisticBalanceDistribution = () =>
  requesterV1(`/distribution_data/address_balance_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAddressBalanceDistribution>>(res.data.data),
  )

export const fetchStatisticTxFeeHistory = () =>
  requesterV1(`/daily_statistics/total_tx_fee`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTransactionFee>[]>>(res.data),
  )

export const fetchStatisticBlockTimeDistribution = () =>
  requesterV1(`/distribution_data/block_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticBlockTimeDistributions>>(res.data.data),
  )

export const fetchStatisticAverageBlockTimes = () =>
  requesterV1(`/distribution_data/average_block_time`).then((res: AxiosResponse) => {
    const {
      attributes: { averageBlockTime },
    } = toCamelcase<Response.Wrapper<State.StatisticAverageBlockTimes>>(res.data.data)
    return averageBlockTime
  })

export const fetchStatisticOccupiedCapacity = () =>
  requesterV1(`/daily_statistics/occupied_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticOccupiedCapacity>[]>>(res.data),
  )

export const fetchStatisticEpochTimeDistribution = () =>
  requesterV1(`/distribution_data/epoch_time_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticEpochTimeDistributions>>(res.data.data),
  )

export const fetchStatisticNewNodeCount = () =>
  requesterV1(`/daily_statistics/nodes_count`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]>>(res.data),
  )

export const fetchStatisticNodeDistribution = () =>
  requesterV1(`/distribution_data/nodes_distribution`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticNodeDistributions>>(res.data.data),
  )

export const fetchStatisticTotalSupply = () =>
  requesterV1(`/daily_statistics/circulating_supply-burnt-locked_capacity`).then((res: AxiosResponse) =>
    toCamelcase<Response.Response<Response.Wrapper<State.StatisticTotalSupply>[]>>(res.data),
  )

export const fetchStatisticAnnualPercentageCompensation = () =>
  requesterV1(`/monetary_data/nominal_apc`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticAnnualPercentageCompensations>>(res.data.data),
  )

export const fetchStatisticSecondaryIssuance = () =>
  requesterV1(`/daily_statistics/treasury_amount-mining_reward-deposit_compensation`).then((res: AxiosResponse) => {
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
  requesterV1(`/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticInflationRates>>(res.data.data),
  )

export const fetchStatisticLiquidity = () =>
  requesterV1(`/daily_statistics/circulating_supply-liquidity`).then((res: AxiosResponse) => {
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
  requesterV1(`statistics/flush_cache_info`).then((res: AxiosResponse) =>
    toCamelcase<Response.Wrapper<State.StatisticCacheInfo>>(res.data.data),
  )

export const fetchSimpleUDT = (typeHash: string) =>
  requesterV1(`/udts/${typeHash}`).then((res: AxiosResponse) => toCamelcase<Response.Wrapper<State.UDT>>(res.data.data))

export const fetchSimpleUDTTransactions = ({
  typeHash,
  page,
  size,
  filter,
  type,
}: {
  typeHash: string
  page: number
  size: number
  filter?: string | null
  type?: string | null
}) =>
  requesterV1(`/udt_transactions/${typeHash}`, {
    params: {
      page,
      page_size: size,
      address_hash: filter?.startsWith('0x') ? undefined : filter,
      tx_hash: filter?.startsWith('0x') ? filter : undefined,
      transfer_action: type,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.Transaction>[]>>(res.data))

export const fetchTokens = (page: number, size: number, sort?: string) =>
  requesterV1(`/udts`, {
    params: {
      page,
      page_size: size,
      sort,
    },
  }).then((res: AxiosResponse) => toCamelcase<Response.Response<Response.Wrapper<State.UDT>[]>>(res.data))

export const exportTransactions = ({
  type,
  id,
  date,
  block,
}: {
  type: State.TransactionCsvExportType
  id?: string
  date?: Record<'start' | 'end', Dayjs | undefined>
  block?: Record<'from' | 'to', number>
}) => {
  const rangeParams = {
    start_date: date?.start?.valueOf(),
    end_date: date?.end?.add(1, 'day').subtract(1, 'millisecond').valueOf(),
    start_number: block?.from,
    end_number: block?.to,
  }
  if (type === 'nft') {
    return requesterV2
      .get(`/nft/transfers/download_csv`, { params: { ...rangeParams, collection_id: id } })
      .then(res => toCamelcase<string>(res.data))
  }
  return requesterV1
    .get(`/${type}/download_csv`, { params: { ...rangeParams, id } })
    .then(res => toCamelcase<string>(res.data))
}
