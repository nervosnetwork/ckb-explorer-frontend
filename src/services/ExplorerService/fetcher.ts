import { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import { Dayjs } from 'dayjs'
import { ReactNode } from 'react'
import { pick } from '../../utils/object'
import { toCamelcase } from '../../utils/util'
import { requesterV1, requesterV2 } from './requester'
import {
  ChartItem,
  RGBCells,
  NervosDaoDepositor,
  RGBDigest,
  RawBtcRPC,
  Response,
  SupportedExportTransactionType,
  TransactionRecord,
  LiveCell,
  TokenCollection,
} from './types'
import { assert } from '../../utils/error'
import { Cell } from '../../models/Cell'
import { Script } from '../../models/Script'
import { Block } from '../../models/Block'
import { BtcTx, Transaction } from '../../models/Transaction'
import { Address, AddressType } from '../../models/Address'
import { OmigaInscriptionCollection, UDT } from '../../models/UDT'
import { XUDT, XUDTHolderAllocation } from '../../models/Xudt'
import { HashType } from '../../constants/common'
import { Dob, getDobs } from '../DobsService'
import { isDob0 } from '../../utils/spore'

async function v1Get<T>(...args: Parameters<typeof requesterV1.get>) {
  return requesterV1.get(...args).then(res => toCamelcase<Response.Response<T>>(res.data))
}

const v1GetWrapped = <T>(...args: Parameters<typeof v1Get>) => v1Get<Response.Wrapper<T>>(...args).then(res => res.data)

const v1GetNullableWrapped = <T>(...args: Parameters<typeof v1Get>) =>
  v1Get<Response.Wrapper<T> | null>(...args).then(res => res.data)

const v1GetWrappedList = <T>(...args: Parameters<typeof v1Get>) =>
  v1Get<Response.Wrapper<T>[]>(...args).then(res => res.data)

const v1GetUnwrapped = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1GetWrapped<T>(...args).then(wrapper => wrapper.attributes)

const v1GetUnwrappedList = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1GetWrappedList<T>(...args).then(wrappers => wrappers.map(wrapper => wrapper.attributes))

const v1GetUnwrappedPagedList = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1Get<Response.Wrapper<T>[]>(...args).then(res => {
    assert(res.meta, 'Unexpected paged list response')
    return {
      data: res.data.map(wrapper => ({ ...wrapper.attributes, cellId: wrapper.id })),
      ...res.meta,
    }
  })

export enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
  UDT = 'udt',
  TypeScript = 'type_script',
  LockScript = 'lock_script',
  BtcTx = 'bitcoin_transaction',
  TokenCollection = 'token_collection',
  TokenItem = 'token_item',
  DID = 'did',
  BtcAddress = 'bitcoin_address',
}

enum SearchQueryType {
  Aggregate = 0,
  Single = 1,
}

export type AggregateSearchResult =
  | Response.Wrapper<Block, SearchResultType.Block>
  | Response.Wrapper<Transaction, SearchResultType.Transaction>
  | Response.Wrapper<Address, SearchResultType.Address>
  | Response.Wrapper<Address, SearchResultType.LockHash>
  | Response.Wrapper<UDT, SearchResultType.UDT>
  | Response.Wrapper<BtcTx, SearchResultType.BtcTx>
  | Response.Wrapper<Script & { scriptHash: string }, SearchResultType.TypeScript>
  | Response.Wrapper<Script, SearchResultType.LockScript>
  | Response.Wrapper<TokenCollection, SearchResultType.TokenCollection>
  | Response.Wrapper<
      {
        name: string | null
        iconUrl: string | null
        metadataUrl: string | null
        status: string
        tokenId: string
        tokenCollection: TokenCollection
      },
      SearchResultType.TokenItem
    >
  // This type is currently checked and inserted by the frontend
  | Response.Wrapper<
      {
        did: string
        address: string
      },
      SearchResultType.DID
    >
  // This type is currently checked and inserted by the frontend
  | Response.Wrapper<
      {
        addressHash: string
      },
      SearchResultType.BtcAddress
    >

export const getBtcTxList = (idList: string[]): Promise<Record<string, RawBtcRPC.BtcTx>> => {
  if (idList.length === 0) return Promise.resolve({})

  return requesterV2
    .post('/bitcoin_transactions', {
      txids: idList,
    })
    .then(res => {
      if (res.status === 200) {
        const txMap: Record<string, RawBtcRPC.BtcTx> = {}
        Object.values(res.data).forEach((tx: any) => {
          txMap[tx.result.txid] = tx.result
        })
        return txMap
      }
      throw new Error('Failed to fetch btc tx list')
    })
    .catch(() => {
      return {}
    })
}

const mergeBtcTxList = async <T extends { rgbTxid: string | null }>(txList: T[]) => {
  const txidList: string[] = txList.map(tx => tx.rgbTxid ?? '').filter(id => !!id)

  const btcTxMap = await getBtcTxList(txidList)
  const transactions = txList.map(i => {
    const btcTx: RawBtcRPC.BtcTx | null = btcTxMap[i.rgbTxid ?? ''] ?? null
    return { ...i, btcTx }
  })
  return transactions
}

export const apiFetcher = {
  fetchBlocks: (page: number, size: number, sort?: string) =>
    v1Get<Response.Wrapper<Block>[]>('blocks', {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchLatestBlocks: (size: number) => apiFetcher.fetchBlocks(1, size),

  fetchAddressInfo: (address: string) =>
    v1GetWrappedList<Address>(`addresses/${address}`).then((wrapper): Address[] => {
      return wrapper.map(
        (item): Address => ({
          ...item.attributes,
          type: item.type === 'lock_hash' ? AddressType.LockHash : AddressType.Address,
        }),
      )
    }),

  // sort field, block_timestamp, capacity
  // sort type, asc, desc
  fetchAddressLiveCells: (address: string, page: number, size: number, sort?: string) => {
    return v1GetUnwrappedPagedList<LiveCell>(`address_live_cells/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
      },
    })
  },

  fetchTransactionsByAddress: async (
    address: string,
    page: number,
    size: number,
    sort?: string,
    txTypeFilter?: string,
  ) => {
    const res = await v1GetUnwrappedPagedList<Transaction>(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
        tx_type: txTypeFilter,
      },
    })

    const transactions = await mergeBtcTxList(res.data)

    return {
      transactions,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchPendingTransactionsByAddress: async (
    address: string,
    page: number,
    size: number,
    sort?: string,
    txTypeFilter?: string,
  ) => {
    const res = await v1GetUnwrappedPagedList<Transaction>(`address_pending_transactions/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
        tx_type: txTypeFilter,
      },
    })

    const transactions = await mergeBtcTxList(res.data)

    return {
      transactions,
      pageSize: res.pageSize,
      total: res.total,
    }
  },
  fetchTransactionRaw: (hash: string) => requesterV2.get<unknown>(`transactions/${hash}/raw`).then(res => res.data),
  fetchContractResourceDistributed: () =>
    requesterV2
      .get(`statistics/contract_resource_distributed`)
      .then(res => toCamelcase<ChartItem.ContractResourceDistributed[]>(res.data)),

  fetchTransactionByHash: (hash: string, displayCells: boolean = false) =>
    v1GetUnwrapped<Transaction>(`transactions/${hash}?display_cells=${displayCells}`),

  fetchRGBDigest: (hash: string) =>
    requesterV2
      .get(`ckb_transactions/${hash}/rgb_digest`)
      .then(res => toCamelcase<Response.Response<RGBDigest>>(res.data)),

  fetchCellsByTxHash: (hash: string, type: 'inputs' | 'outputs', page: Record<'no' | 'size', number>) =>
    requesterV2
      .get(`ckb_transactions/${hash}/display_${type}`, {
        params: {
          page: page.no,
          page_size: page.size,
        },
      })
      .then(res => toCamelcase<Response.Response<Cell[]>>(res.data)),

  fetchTransactionLiteDetailsByHash: (hash: string) =>
    requesterV2
      .get(`ckb_transactions/${hash}/details`)
      .then((res: AxiosResponse) => toCamelcase<Response.Response<TransactionRecord[]>>(res.data)),

  fetchTransactions: async (page: number, size: number, sort?: string) => {
    const res = await v1GetUnwrappedPagedList<Transaction>('transactions', {
      params: {
        page,
        page_size: size,
        sort,
      },
    })

    return {
      transactions: res.data,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchLatestTransactions: (size: number) => apiFetcher.fetchTransactions(1, size),

  fetchPendingTransactions: async (page: number, size: number, sort?: string) => {
    const res = await requesterV2
      .get('pending_transactions', {
        params: {
          page,
          page_size: size,
          sort,
        },
      })
      .then(res => toCamelcase<Response.Response<Transaction[]>>(res.data))
      .then(res => {
        assert(res.meta, 'Unexpected paged list response')
        return {
          data: res.data,
          ...res.meta,
        }
      })

    return {
      transactions: res.data,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchPendingTransactionsCount: () => apiFetcher.fetchPendingTransactions(1, 1).then(res => res.total),

  fetchTransactionsByBlockHash: async (
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
  ) => {
    const res = await v1GetUnwrappedPagedList<Transaction>(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
        address_hash: filter?.startsWith('ck') ? filter : null,
        tx_hash: filter?.startsWith('0x') ? filter : null,
      },
    })

    const transactions = await mergeBtcTxList(res.data)
    return {
      transactions,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchBlock: (blockHeightOrHash: string) => v1GetUnwrapped<Block>(`blocks/${blockHeightOrHash}`),

  fetchScript: (scriptType: 'lock_scripts' | 'type_scripts', id: string) =>
    v1GetNullableWrapped<Script>(`/cell_output_${scriptType}/${id}`),

  fetchCellData: (id: string) =>
    // TODO: When will it return an empty result?
    v1GetNullableWrapped<{ data: string }>(`/cell_output_data/${id}`).then(res => res?.attributes.data ?? null),

  fetchAggregateSearchResult: (param: string) =>
    v1Get<AggregateSearchResult[]>('suggest_queries', {
      params: {
        q: param,
        filter_by: SearchQueryType.Aggregate,
      },
    }),

  fetchSearchByIdResult: (param: string) =>
    v1Get<
      | Response.Wrapper<Block, SearchResultType.Block>
      | Response.Wrapper<Transaction, SearchResultType.Transaction>
      | Response.Wrapper<Address, SearchResultType.Address>
      | Response.Wrapper<Address, SearchResultType.LockHash>
      | Response.Wrapper<UDT, SearchResultType.UDT>
      | Response.Wrapper<BtcTx, SearchResultType.BtcTx>
      | Response.Wrapper<Script & { scriptHash: string }, SearchResultType.TypeScript>
      | Response.Wrapper<Script, SearchResultType.LockScript>
    >('suggest_queries', {
      params: {
        q: param,
      },
    }),

  fetchSearchByNameResult: (param: string) =>
    v1GetUnwrappedList<UDTQueryResult>('udt_queries', {
      params: {
        q: param,
      },
    }),

  fetchStatistics: () =>
    v1GetUnwrapped<{
      tipBlockNumber: string
      averageBlockTime: string
      currentEpochDifficulty: string
      hashRate: string
      epochInfo: {
        epochNumber: string
        epochLength: string
        index: string
      }
      estimatedEpochTime: string
      transactionsLast24Hrs: string
      transactionsCountPerMinute: string
      reorgStartedAt: string | null
    }>(`statistics`),

  fetchTipBlockNumber: () =>
    v1GetUnwrapped<Pick<APIReturn<'fetchStatistics'>, 'tipBlockNumber'>>('statistics/tip_block_number').then(
      statistics => statistics.tipBlockNumber,
    ),

  fetchBlockchainInfo: () =>
    v1GetNullableWrapped<{
      blockchainInfo: {
        isInitialBlockDownload: boolean
        epoch: string
        difficulty: string
        medianTime: string
        chain: string
        alerts: {
          id: string
          message: string
          noticeNntil: string
          priority: string
        }[]
      }
    }>('statistics/blockchain_info'),

  fetchNodeVersion: () => v1GetUnwrapped<{ version: string }>('/nets/version'),

  fetchNervosDao: () =>
    v1GetUnwrapped<{
      totalDeposit: string
      depositorsCount: string
      depositChanges: string
      unclaimedCompensationChanges: string
      claimedCompensationChanges: string
      depositorChanges: string
      unclaimedCompensation: string
      claimedCompensation: string
      averageDepositTime: string
      miningReward: string
      depositCompensation: string
      treasuryAmount: string
      estimatedApc: string
    }>(`contracts/nervos_dao`),

  fetchNervosDaoTransactionsByFilter: async ({
    page,
    size,
    filter,
  }: {
    page: number
    size: number
    filter?: string
  }) => {
    const res = await v1GetUnwrappedPagedList<Transaction>(`contract_transactions/nervos_dao`, {
      params: {
        page,
        page_size: size,
        tx_hash: filter?.startsWith('0x') ? filter : null,
        address_hash: filter?.startsWith('0x') ? null : filter,
      },
    })

    const transactions = await mergeBtcTxList(res.data)

    return {
      transactions,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchNervosDaoDepositors: () => v1GetUnwrappedList<NervosDaoDepositor>(`/dao_depositors`),

  fetchStatisticTransactionCount: () =>
    v1GetUnwrappedList<ChartItem.TransactionCount>(`/daily_statistics/transactions_count`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.transactionsCount !== '0'),
    ),

  fetchStatisticAddressCount: () =>
    v1GetUnwrappedList<ChartItem.AddressCount>(`/daily_statistics/addresses_count`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.addressesCount !== '0'),
    ),

  fetchStatisticTotalDaoDeposit: () =>
    v1GetUnwrappedList<ChartItem.TotalDaoDeposit>('/daily_statistics/total_depositors_count-total_dao_deposit'),

  fetchStatisticBitcoin: () =>
    requesterV2(`/bitcoin_statistics`).then((res: AxiosResponse) => toCamelcase<ChartItem.Bitcoin[]>(res.data.data)),

  fetchBitcoinAddressesRGBCells: (address: string, page: number, size: number, sort?: string) =>
    requesterV2(`/bitcoin_addresses/${address}/rgb_cells`, {
      params: {
        page,
        page_size: size,
        sort,
      },
    }).then((res: AxiosResponse) =>
      toCamelcase<{
        data: { rgbCells: RGBCells }
        meta: {
          total: number
          pageSize: number
        }
      }>(res.data),
    ),

  fetchStatisticNewDaoDeposit: () =>
    v1GetUnwrappedList<ChartItem.NewDaoDeposit>('/daily_statistics/daily_dao_deposit-daily_dao_depositors_count'),

  // Unused currently
  fetchStatisticNewDaoWithdraw: () =>
    v1GetUnwrappedList<{ dailyDaoWithdraw: string; createdAtUnixtimestamp: string }>(
      '/daily_statistics/daily_dao_withdraw',
    ),

  fetchStatisticCirculationRatio: () =>
    v1GetUnwrappedList<ChartItem.CirculationRatio>('/daily_statistics/circulation_ratio'),

  fetchStatisticDifficultyHashRate: () =>
    v1GetUnwrappedList<ChartItem.DifficultyHashRate>(`/epoch_statistics/difficulty-uncle_rate-hash_rate`).then(
      items => {
        return (
          items
            // filter latest exceptional data out
            .filter((item, idx) => idx < items.length - 2 || item.hashRate !== '0.0')
            // Data may enter the cache, so it is purify to reduce volume.
            .map(item => ({
              ...pick(item, ['difficulty', 'epochNumber']),
              uncleRate: new BigNumber(item.uncleRate).toFixed(4),
              hashRate: new BigNumber(item.hashRate).multipliedBy(1000).toString(),
            }))
        )
      },
    ),

  fetchStatisticDifficulty: () =>
    v1GetUnwrappedList<ChartItem.Difficulty>(`/daily_statistics/avg_difficulty`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.avgDifficulty !== '0.0'),
    ),

  fetchStatisticHashRate: () =>
    v1GetUnwrappedList<ChartItem.HashRate>(`/daily_statistics/avg_hash_rate`).then(items => {
      return (
        items
          // filter latest exceptional data out
          .filter((item, idx) => idx < items.length - 2 || item.avgHashRate !== '0.0')
          .map(item => ({
            ...item,
            avgHashRate: new BigNumber(item.avgHashRate).multipliedBy(1000).toString(),
          }))
      )
    }),

  fetchStatisticUncleRate: () =>
    v1GetUnwrappedList<ChartItem.UncleRate>(`/daily_statistics/uncle_rate`).then(items => {
      return (
        items
          // filter latest exceptional data out
          .filter((item, idx) => idx < items.length - 2 || item.uncleRate !== '0')
          .map(item => ({
            ...item,
            uncleRate: new BigNumber(item.uncleRate).toFixed(4),
          }))
      )
    }),

  fetchStatisticMinerAddressDistribution: () =>
    v1GetUnwrapped<{ minerAddressDistribution: Record<string, string> }>(
      `/distribution_data/miner_address_distribution`,
    ).then(({ minerAddressDistribution }) => {
      const blockSum = Object.values(minerAddressDistribution).reduce((sum, val) => sum + Number(val), 0)
      const statisticMinerAddresses: ChartItem.MinerAddress[] = Object.entries(minerAddressDistribution).map(
        ([key, val]) => ({
          address: key,
          radio: (Number(val) / blockSum).toFixed(3),
        }),
      )
      return statisticMinerAddresses
    }),

  fetchStatisticMinerVersionDistribution: () =>
    requesterV2(`/blocks/ckb_node_versions`).then((res: AxiosResponse) =>
      toCamelcase<{ data: { version: string; blocksCount: number }[] }>(res.data),
    ),

  fetchRGBTransactions: async (page: number, size: number, sort?: string, leapDirection?: string) =>
    requesterV2('/rgb_transactions', {
      params: {
        page,
        page_size: size,
        sort,
        leap_direction: leapDirection,
      },
    }).then((res: AxiosResponse) =>
      toCamelcase<{
        data: {
          ckbTransactions: RGBTransaction[]
        }
        meta: {
          total: number
          pageSize: number
        }
      }>(res.data),
    ),

  fetchStatisticTransactionFees: () =>
    requesterV2
      .get('statistics/transaction_fees')
      .then(res => toCamelcase<FeeRateTracker.TransactionFeesStatistic>(res.data)),

  fetchStatisticCellCount: () =>
    v1GetUnwrappedList<Omit<ChartItem.CellCount, 'allCellsCount'>>(
      `/daily_statistics/live_cells_count-dead_cells_count`,
    ).then(items => {
      return items.map(item => ({
        ...item,
        allCellsCount: (Number(item.liveCellsCount) + Number(item.deadCellsCount)).toString(),
      }))
    }),

  fetchStatisticDifficultyUncleRateEpoch: () =>
    v1GetUnwrappedList<ChartItem.DifficultyUncleRateEpoch>(`/epoch_statistics/epoch_time-epoch_length`).then(
      // Data may enter the cache, so it is purify to reduce volume.
      items => items.map(item => pick(item, ['epochNumber', 'epochTime', 'epochLength'])),
    ),

  fetchStatisticAddressBalanceRank: () =>
    v1GetUnwrapped<{ addressBalanceRanking: ChartItem.AddressBalanceRank[] }>(
      `/statistics/address_balance_ranking`,
    ).then(res => res.addressBalanceRanking),

  fetchStatisticCkbHodlWave: () =>
    v1GetUnwrappedList<ChartItem.CkbHodlWave>(`/daily_statistics/ckb_hodl_wave`).then(items =>
      items.filter(item => item.ckbHodlWave != null),
    ),

  fetchStatisticBalanceDistribution: () =>
    v1GetUnwrapped<{ addressBalanceDistribution: string[][] }>(`/distribution_data/address_balance_distribution`).then(
      ({ addressBalanceDistribution }) => {
        const balanceDistributions = addressBalanceDistribution.map(distribution => {
          const [balance, addresses, sumAddresses] = distribution
          return {
            balance,
            addresses,
            sumAddresses,
          }
        })
        return balanceDistributions
      },
    ),

  fetchStatisticTxFeeHistory: () => v1GetUnwrappedList<ChartItem.TransactionFee>(`/daily_statistics/total_tx_fee`),

  fetchStatisticBlockTimeDistribution: () =>
    v1GetUnwrapped<{ blockTimeDistribution: string[][] }>(`/distribution_data/block_time_distribution`).then(
      ({ blockTimeDistribution }) => {
        const sumBlocks = blockTimeDistribution
          .flatMap(data => Number(data[1]))
          .reduce((previous, current) => previous + current)
        const statisticBlockTimeDistributions = [
          {
            time: '0',
            ratio: '0',
          },
        ].concat(
          blockTimeDistribution.map(data => {
            const [time, blocks] = data
            return {
              time,
              ratio: (Number(blocks) / sumBlocks).toFixed(5),
            }
          }),
        )
        return statisticBlockTimeDistributions
      },
    ),

  fetchStatisticAverageBlockTimes: () =>
    v1GetUnwrapped<{ averageBlockTime: ChartItem.AverageBlockTime[] }>(`/distribution_data/average_block_time`).then(
      res => res.averageBlockTime,
    ),

  fetchStatisticEpochTimeDistribution: () =>
    v1GetUnwrapped<{ epochTimeDistribution: string[][] }>(`/distribution_data/epoch_time_distribution`).then(
      ({ epochTimeDistribution }) => {
        const statisticEpochTimeDistributions: ChartItem.EpochTimeDistribution[] = epochTimeDistribution.map(data => {
          const [time, epoch] = data
          return {
            time,
            epoch,
          }
        })
        return statisticEpochTimeDistributions
      },
    ),

  fetchStatisticTotalSupply: () =>
    v1GetUnwrappedList<ChartItem.TotalSupply>(`/daily_statistics/circulating_supply-burnt-locked_capacity`),

  fetchStatisticAnnualPercentageCompensation: () =>
    v1GetUnwrapped<{ nominalApc: string[] }>(`/monetary_data/nominal_apc`).then(({ nominalApc }) => {
      const statisticAnnualPercentageCompensations = nominalApc
        .filter((_apc, index) => index % 3 === 0 || index === nominalApc.length - 1)
        .map((apc, index) => ({
          year: 0.25 * index,
          apc,
        }))
      return statisticAnnualPercentageCompensations
    }),

  fetchStatisticSecondaryIssuance: () =>
    v1GetUnwrappedList<ChartItem.SecondaryIssuance>(
      `/daily_statistics/treasury_amount-mining_reward-deposit_compensation`,
    ).then(items => {
      return items.map(item => {
        const { depositCompensation, miningReward, treasuryAmount } = item
        const sum = Number(treasuryAmount) + Number(miningReward) + Number(depositCompensation)
        const treasuryAmountPercent = Number(((Number(treasuryAmount) / sum) * 100).toFixed(2))
        const miningRewardPercent = Number(((Number(miningReward) / sum) * 100).toFixed(2))
        const depositCompensationPercent = (100 - treasuryAmountPercent - miningRewardPercent).toFixed(2)
        return {
          ...item,
          treasuryAmount: treasuryAmountPercent.toString(),
          miningReward: miningRewardPercent.toString(),
          depositCompensation: depositCompensationPercent,
        }
      })
    }),

  fetchStatisticInflationRate: () =>
    v1GetUnwrapped<{ nominalApc: string[]; nominalInflationRate: string[]; realInflationRate: string[] }>(
      `/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`,
    ).then(({ nominalApc, nominalInflationRate, realInflationRate }) => {
      const statisticInflationRates = []
      for (let i = 0; i < nominalApc.length; i++) {
        if (i % 6 === 0 || i === nominalApc.length - 1) {
          statisticInflationRates.push({
            year: i % 6 === 0 ? Math.floor(i / 6) * 0.5 : 50,
            nominalApc: nominalApc[i],
            nominalInflationRate: nominalInflationRate[i],
            realInflationRate: realInflationRate[i],
          })
        }
      }
      return statisticInflationRates
    }),

  fetchStatisticLiquidity: () =>
    v1GetUnwrappedList<ChartItem.Liquidity>(`/daily_statistics/circulating_supply-liquidity`).then(items => {
      return items.map(item => ({
        ...item,
        daoDeposit: new BigNumber(item.circulatingSupply).minus(new BigNumber(item.liquidity)).toFixed(2),
      }))
    }),

  fetchFlushChartCache: () => v1GetUnwrapped<{ flushCacheInfo: string[] }>(`statistics/flush_cache_info`),

  fetchSimpleUDT: (typeHash: string) => v1GetUnwrapped<UDT>(`/udts/${typeHash}`),

  fetchUDTTransactions: async ({
    typeHash,
    page,
    size,
    filter,
  }: {
    typeHash: string
    page: number
    size: number
    filter?: string | null
  }) => {
    const res = await v1GetUnwrappedPagedList<Transaction>(`/udt_transactions/${typeHash}`, {
      params: {
        page,
        page_size: size,
        address_hash: filter?.startsWith('0x') ? undefined : filter,
        tx_hash: filter?.startsWith('0x') ? filter : undefined,
      },
    })

    const transactions = await mergeBtcTxList(res.data)

    return {
      transactions,
      pageSize: res.pageSize,
      total: res.total,
    }
  },

  fetchTokens: (page: number, size: number, sort?: string) =>
    v1GetUnwrappedPagedList<UDT>(`/udts`, {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchXudtHoders: ({ id, number }: { id: string; number: number }) => {
    return requesterV1
      .get(`/xudts/snapshot`, {
        params: { id, number },
      })
      .then(res => toCamelcase<string>(res.data))
  },

  fetchXudt: (typeHash: string) => v1GetUnwrapped<XUDT>(`/xudts/${typeHash}`),
  fetchXudtHolderAllocation: (typeHash: string) =>
    requesterV1.get(`/udts/${typeHash}/holder_allocation`).then(res => toCamelcase<XUDTHolderAllocation>(res.data)),

  fetchXudts: (page: number, size: number, sort?: string, tags?: string) =>
    v1GetUnwrappedPagedList<XUDT>(`/xudts`, {
      params: {
        page,
        page_size: size,
        sort,
        tags,
      },
    }),

  // TODO: This API is not supported yet, use fetchUDTTransactions instead
  // fetchXudtTransactions: async ({
  //   typeHash,
  //   page,
  //   size,
  //   filter,
  // }: {
  //   typeHash: string
  //   page: number
  //   size: number
  //   filter?: string | null
  // }) => {
  //   const res = await v1GetUnwrappedPagedList<Transaction>(`/xudt_transactions/${typeHash}`, {
  //     params: {
  //       page,
  //       page_size: size,
  //       address_hash: filter?.startsWith('0x') ? undefined : filter,
  //       tx_hash: filter?.startsWith('0x') ? filter : undefined,
  //     },
  //   })

  //   const transactions = await mergeBtcTxList(res.data)

  //   return {
  //     transactions,
  //     pageSize: res.pageSize,
  //     total: res.total,
  //   }
  // },

  fetchOmigaInscription: (typeHash: string, isViewOriginal: boolean) =>
    v1GetUnwrapped<OmigaInscriptionCollection>(
      `/omiga_inscriptions/${typeHash}${isViewOriginal ? '?status=closed' : ''}`,
    ),

  fetchOmigaInscriptions: (page: number, size: number, sort?: string) =>
    v1GetUnwrappedPagedList<OmigaInscriptionCollection>(`/omiga_inscriptions`, {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  exportTransactions: ({
    type,
    id,
    date,
    block,
    isViewOriginal,
  }: {
    type: SupportedExportTransactionType
    id?: string
    date?: Record<'start' | 'end', Dayjs | undefined>
    block?: Record<'from' | 'to', number>
    isViewOriginal: boolean
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
      .get(`/${type}/download_csv${isViewOriginal ? '?status=closed' : ''}`, {
        params: { ...rangeParams, id },
      })
      .then(res => toCamelcase<string>(res.data))
  },

  fetchNFTCollections: (page: string, sort?: string, type?: string) =>
    requesterV2
      .get<{
        data: NFTCollection[]
        pagination: {
          count: number
          page: number
          next: number | null
          prev: number | null
          last: number
        }
      }>('nft/collections', {
        params: {
          page,
          sort,
          type,
        },
      })
      .then(res => res.data),

  fetchNFTCollection: (collection: string) =>
    requesterV2.get<NFTCollection>(`nft/collections/${collection}`).then(res => res.data),

  fetchNFTCollectionHolders: (id: string, page: string, sort?: string, addressHash?: string | null) =>
    requesterV2
      .get<{
        data: Record<string, number>
      }>(`/nft/collections/${id}/holders`, {
        params: {
          page,
          sort,
          address_hash: addressHash,
        },
      })
      .then(res => res.data),

  fetchNFTCollectionItems: async (id: string, page: string) => {
    const res = await requesterV2
      .get<{
        data: NFTItem[]
        pagination: {
          count: number
          page: number
          next: number | null
          prev: number | null
          last: number
        }
      }>(`/nft/collections/${id}/items`, {
        params: {
          page,
        },
      })
      .then(r => r.data)
    const sporeIds = res.data.filter(i => isDob0(i)).map(i => i.type_script?.args)
    if (sporeIds.length) {
      const dobs = await getDobs(sporeIds)
      if (dobs?.length) {
        sporeIds.forEach((id, idx) => {
          const item = res.data.find(item => item.type_script?.args === id && item.standard === 'spore')
          const dob = dobs[idx]
          if (item && dob) {
            item.dob = dob
          }
        })
      }
    }
    return res
  },
  fetchNFTCollectionItem: async (collectionId: string, id: string) => {
    const intTokenId = BigNumber(id).toFormat({ groupSeparator: '' })
    const res = await requesterV2.get<NFTItem>(`nft/collections/${collectionId}/items/${intTokenId}`).then(r => r.data)
    if (isDob0(res) && res.type_script?.args) {
      const dobs = await getDobs([res.type_script.args])
      const dob = dobs?.[0]
      if (dob) {
        res.dob = dob
      }
    }
    return res
  },

  fetchNFTItemByOwner: (owner: string, standard: string, page?: string) =>
    requesterV2
      .get<{
        data: NFTItem[]
        pagination: {
          series: string[]
        }
      }>('nft/items', {
        params: {
          owner,
          standard,
          page,
        },
      })
      .then(res => res.data),

  fetchScriptInfo: (codeHash: string, hashType: string) =>
    requesterV2
      .get('scripts/general_info', {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
        },
      })
      .then(res => toCamelcase<Response.Response<ScriptInfo>>(res.data)),

  fetchScriptCKBTransactions: async (codeHash: string, hashType: string, page: number, pageSize: number) => {
    const res = await requesterV2
      .get('scripts/ckb_transactions', {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: pageSize,
        },
      })
      .then(res =>
        toCamelcase<
          Response.Response<{
            ckbTransactions: CKBTransactionInScript[]
            // TODO: This structure is unexpected and will be adjusted in the future.
            // Refs: https://github.com/Magickbase/ckb-explorer-public-issues/issues/451
            meta: {
              total: number
              pageSize: number
            }
          }>
        >(res.data),
      )

    const transactions = await mergeBtcTxList(res.data.ckbTransactions)

    return {
      transactions,
      pageSize: res.data.meta.pageSize,
      total: res.data.meta.total,
    }
  },

  fetchScriptCells: (
    cellType: 'deployed_cells' | 'referring_cells',
    codeHash: string,
    hashType: string,
    page: number,
    pageSize: number,
  ) =>
    requesterV2
      .get(`scripts/${cellType}`, {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: pageSize,
        },
      })

      .then(res =>
        toCamelcase<
          Response.Response<{
            deployedCells?: CellInScript[]
            referringCells?: CellInScript[]
            // TODO: This structure is unexpected and will be adjusted in the future.
            // Refs: https://github.com/Magickbase/ckb-explorer-public-issues/issues/451
            meta: {
              total: number
              pageSize: number
            }
          }>
        >(res.data),
      ),

  fetchNFTCollectionTransferList: async (
    id: string,
    page: string,
    tokenId?: string | null,
    transferAction?: string | null,
    addressHash?: string | null,
    txHash?: string | null,
  ) => {
    const intTokenId = tokenId ? BigNumber(tokenId).toFormat({ groupSeparator: '' }) : tokenId
    const res = await requesterV2
      .get<TransferListRes>(`/nft/transfers`, {
        params: {
          page,
          collection_id: id,
          token_id: intTokenId,
          transfer_action: transferAction,
          address_hash: addressHash,
          tx_hash: txHash,
        },
      })
      .then(r => r.data)

    const sporeIds = [...new Set(res.data.filter(i => isDob0(i.item)).map(i => i.item.type_script?.args))]
    if (sporeIds.length) {
      const dobs = await getDobs(sporeIds)
      if (dobs?.length) {
        sporeIds.forEach((id, idx) => {
          const items = res.data.filter(i => i.item.type_script?.args === id && i.item.standard === 'spore')
          const dob = dobs[idx]
          if (items.length && dob) {
            items.forEach(i => {
              // eslint-disable-next-line no-param-reassign
              i.item.dob = dob
            })
          }
        })
      }
    }

    return res
  },

  fetchDASAccounts: async (addresses: string[]): Promise<DASAccountMap> => {
    const { data } = await requesterV2.post<Record<string, string>>('das_accounts', {
      addresses,
    })
    const dataWithNormalizeEmptyValue = Object.fromEntries(
      Object.entries(data).map(([addr, account]) => {
        return account === '' ? [addr, null] : [addr, account]
      }),
    )
    return dataWithNormalizeEmptyValue
  },
  submitTokenInfo: (typeHash: string, params: SubmitTokenInfoParams) => {
    return requesterV1.put(`/udts/${typeHash}`, params).then(res => toCamelcase<string>(res.data))
  },
  getVericodeForTokenInfo: (typeHash: string) =>
    requesterV1.put(`/udt_verifications/${typeHash}`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
    }),
  getBtcTxList,
}

// ====================
// Types
// ====================

export type APIFetcher = typeof apiFetcher

export type APIReturn<T extends keyof APIFetcher> = Awaited<ReturnType<APIFetcher[T]>>

export namespace FeeRateTracker {
  export interface TransactionFeeRate {
    id: number
    timestamp: number
    feeRate: number
    confirmationTime: number
  }

  export interface PendingTransactionFeeRate {
    id: number
    feeRate: number
  }

  export interface LastNDaysTransactionFeeRate {
    date: string
    feeRate: string
  }

  export interface TransactionFeesStatistic {
    transactionFeeRates: TransactionFeeRate[]
    pendingTransactionFeeRates: PendingTransactionFeeRate[]
    lastNDaysTransactionFeeRates: LastNDaysTransactionFeeRate[]
  }

  export interface FeeRateCard {
    priority: string
    icon: ReactNode
    feeRate?: string
    priorityClass: string
    confirmationTime: number
  }
}

export interface NFTCollection {
  id: number
  standard: string
  name: string
  description: string
  h24_ckb_transactions_count: string
  creator: string | null
  icon_url: string | null
  items_count: number | null
  holders_count: number | null
  type_script: { code_hash: string; hash_type: 'data' | 'type'; args: string } | null
  sn: string
  timestamp: number
}

export interface NFTItem {
  icon_url: string | null
  id: number
  token_id: string
  owner: string | null
  standard: string | null
  cell: {
    cell_index: number
    data: string | null
    status: string
    tx_hash: string
  } | null
  collection: NFTCollection
  name: string | null
  metadata_url: string | null
  type_script: Record<'code_hash' | 'hash_type' | 'args' | 'script_hash', string>
  dob?: Dob
}

export interface ScriptInfo {
  id: string
  scriptName: string
  scriptType: string
  codeHash: string
  hashType: HashType
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  countOfTransactions: number
  countOfDeployedCells: number
  countOfReferringCells: number
}

export interface CKBTransactionInScript {
  isBtcTimeLock: boolean
  isRgbTransaction: boolean
  rgbTxid: string | null
  id: number
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  transactionFee: number
  isCellbase: boolean
  txStatus: string
  displayInputs: Cell[]
  displayOutputs: Cell[]
}

export interface CellInScript {
  id: number
  capacity: string
  data: string
  ckbTransactionId: number
  createdAt: string
  updatedAt: string
  status: string
  addressId: number
  blockId: number
  txHash: string
  cellIndex: number
  generatedById?: number
  consumedById?: number
  cellType: string
  dataSize: number
  occupiedCapacity: number
  blockTimestamp: number
  consumedBlockTimestamp: number
  typeHash?: string
  udtAmount: number
  dao: string
  lockScriptId?: number
  typeScriptId?: number
}

export interface TransferRes {
  id: number
  from: string | null
  to: string | null
  action: 'mint' | 'normal' | 'destruction'
  item: NFTItem
  transaction: {
    tx_hash: string
    block_number: number
    block_timestamp: number
  }
}

export interface TransferListRes {
  data: TransferRes[]
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}

export type DASAccount = string

export type DASAccountMap = Record<string, DASAccount | null>

export type UDTQueryResult = {
  fullName: string
  symbol: string | null
  typeHash: string
  iconFile: string | null
  udtType: UDT['udtType']
}

type SubmitTokenInfoParams = {
  symbol: string
  email: string
  operator_website: string
  total_amount: number

  full_name?: string
  decimal?: number
  description?: string
  icon_file?: string
  token?: string
}

export interface RGBTransaction {
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  leapDirection: string
  rgbCellChanges: number
  rgbTxid: string
}
