import { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import { Dayjs } from 'dayjs'
import { ReactNode } from 'react'
import { pick } from '../../utils/object'
import { toCamelcase } from '../../utils/util'
import { requesterV1, requesterV2 } from './requester'
import { Response } from './types'
import { assert } from '../../utils/error'

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
      data: res.data.map(wrapper => wrapper.attributes),
      ...res.meta,
    }
  })

export enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
  UDT = 'udt',
}

export const apiFetcher = {
  fetchBlocks: (page: number, size: number, sort?: string) =>
    v1Get<Response.Wrapper<State.Block>[]>('blocks', {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchLatestBlocks: (size: number) => apiFetcher.fetchBlocks(1, size),

  fetchAddressInfo: (address: string) =>
    v1GetWrapped<State.Address>(`addresses/${address}`).then(
      (wrapper): State.Address => ({
        ...wrapper.attributes,
        type: wrapper.type === 'lock_hash' ? 'LockHash' : 'Address',
      }),
    ),

  fetchTransactionsByAddress: (address: string, page: number, size: number, sort?: string, txTypeFilter?: string) =>
    v1GetUnwrappedPagedList<State.Transaction>(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
        tx_type: txTypeFilter,
      },
    }),

  fetchTransactionRaw: (hash: string) => requesterV2.get<unknown>(`transactions/${hash}/raw`).then(res => res.data),

  fetchTransactionByHash: (hash: string) => v1GetUnwrapped<State.Transaction>(`transactions/${hash}`),

  fetchTransactionLiteDetailsByHash: (hash: string) =>
    requesterV2
      .get(`ckb_transactions/${hash}/details`)
      .then((res: AxiosResponse) => toCamelcase<Response.Response<State.TransactionLiteDetails[]>>(res.data)),

  fetchTransactions: (page: number, size: number, sort?: string) =>
    v1GetUnwrappedPagedList<State.Transaction>('transactions', {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchLatestTransactions: (size: number) => apiFetcher.fetchTransactions(1, size),

  fetchPendingTransactions: (page: number, size: number, sort?: string) =>
    requesterV2
      .get('pending_transactions', {
        params: {
          page,
          page_size: size,
          sort,
        },
      })
      .then(res => toCamelcase<Response.Response<State.Transaction[]>>(res.data))
      .then(res => {
        assert(res.meta, 'Unexpected paged list response')
        return {
          data: res.data,
          ...res.meta,
        }
      }),

  fetchPendingTransactionsCount: () => apiFetcher.fetchPendingTransactions(1, 1).then(res => res.total),

  fetchTransactionsByBlockHash: (
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
    v1GetUnwrappedPagedList<State.Transaction>(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
        address_hash: filter?.startsWith('ck') ? filter : null,
        tx_hash: filter?.startsWith('0x') ? filter : null,
      },
    }),

  fetchBlock: (blockHeightOrHash: string) => v1GetUnwrapped<State.Block>(`blocks/${blockHeightOrHash}`),

  fetchScript: (scriptType: 'lock_scripts' | 'type_scripts', id: string) =>
    v1GetNullableWrapped<State.Script>(`/cell_output_${scriptType}/${id}`),

  fetchCellData: (id: string) =>
    // TODO: When will it return an empty result?
    v1GetNullableWrapped<{ data: string }>(`/cell_output_data/${id}`).then(res => res?.attributes.data ?? null),

  fetchSearchResult: (param: string) =>
    v1Get<
      | Response.Wrapper<State.Block, SearchResultType.Block>
      | Response.Wrapper<State.Transaction, SearchResultType.Transaction>
      | Response.Wrapper<State.Address, SearchResultType.Address>
      | Response.Wrapper<State.Address, SearchResultType.LockHash>
      | Response.Wrapper<unknown, SearchResultType.UDT>
    >('suggest_queries', {
      params: {
        q: param,
      },
    }),

  fetchStatistics: () => v1GetUnwrapped<State.Statistics>(`statistics`),

  fetchTipBlockNumber: () =>
    v1GetUnwrapped<Pick<State.Statistics, 'tipBlockNumber'>>('statistics/tip_block_number').then(
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

  fetchNervosDao: () => v1GetUnwrapped<State.NervosDao>(`contracts/nervos_dao`),

  // Unused currently
  fetchNervosDaoTransactions: (page: number, size: number) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`contract_transactions/nervos_dao`, {
      params: {
        page,
        page_size: size,
      },
    }),

  // Unused currently
  fetchNervosDaoTransactionsByHash: (hash: string) =>
    v1GetWrapped<State.Transaction>(`dao_contract_transactions/${hash}`),

  // Unused currently
  fetchNervosDaoTransactionsByAddress: (address: string, page: number, size: number) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`address_dao_transactions/${address}`, {
      params: {
        page,
        page_size: size,
      },
    }),

  fetchNervosDaoTransactionsByFilter: ({ page, size, filter }: { page: number; size: number; filter?: string }) =>
    v1GetUnwrappedPagedList<State.Transaction>(`contract_transactions/nervos_dao`, {
      params: {
        page,
        page_size: size,
        tx_hash: filter?.startsWith('0x') ? filter : null,
        address_hash: filter?.startsWith('0x') ? null : filter,
      },
    }),

  fetchNervosDaoDepositors: () => v1GetUnwrappedList<State.NervosDaoDepositor>(`/dao_depositors`),

  fetchStatisticTransactionCount: () =>
    v1GetUnwrappedList<State.StatisticTransactionCount>(`/daily_statistics/transactions_count`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.transactionsCount !== '0'),
    ),

  fetchStatisticAddressCount: () =>
    v1GetUnwrappedList<State.StatisticAddressCount>(`/daily_statistics/addresses_count`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.addressesCount !== '0'),
    ),

  fetchStatisticTotalDaoDeposit: () =>
    v1GetUnwrappedList<State.StatisticTotalDaoDeposit>('/daily_statistics/total_depositors_count-total_dao_deposit'),

  fetchStatisticNewDaoDeposit: () =>
    v1GetUnwrappedList<State.StatisticNewDaoDeposit>('/daily_statistics/daily_dao_deposit-daily_dao_depositors_count'),

  // Unused currently
  fetchStatisticNewDaoWithdraw: () =>
    v1GetUnwrappedList<State.StatisticNewDaoWithdraw>('/daily_statistics/daily_dao_withdraw'),

  fetchStatisticCirculationRatio: () =>
    v1GetUnwrappedList<State.StatisticCirculationRatio>('/daily_statistics/circulation_ratio'),

  fetchStatisticDifficultyHashRate: () =>
    v1GetUnwrappedList<State.StatisticDifficultyHashRate>(`/epoch_statistics/difficulty-uncle_rate-hash_rate`).then(
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
    v1GetUnwrappedList<State.StatisticDifficulty>(`/daily_statistics/avg_difficulty`).then(items =>
      // filter latest exceptional data out
      items.filter((item, idx) => idx < items.length - 2 || item.avgDifficulty !== '0.0'),
    ),

  fetchStatisticHashRate: () =>
    v1GetUnwrappedList<State.StatisticHashRate>(`/daily_statistics/avg_hash_rate`).then(items => {
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
    v1GetUnwrappedList<State.StatisticUncleRate>(`/daily_statistics/uncle_rate`).then(items => {
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
    v1GetUnwrapped<State.StatisticMinerAddressDistribution>(`/distribution_data/miner_address_distribution`),

  fetchStatisticMinerVersionDistribution: () =>
    requesterV2(`/blocks/ckb_node_versions`).then((res: AxiosResponse) =>
      toCamelcase<{ data: Array<{ version: string; blocksCount: number }> }>(res.data),
    ),

  fetchStatisticTransactionFees: () =>
    requesterV2
      .get('statistics/transaction_fees')
      .then(res => toCamelcase<FeeRateTracker.TransactionFeesStatistic>(res.data)),

  fetchStatisticCellCount: () =>
    v1GetUnwrappedList<Omit<State.StatisticCellCount, 'allCellsCount'>>(
      `/daily_statistics/live_cells_count-dead_cells_count`,
    ).then(items => {
      return items.map(item => ({
        ...item,
        allCellsCount: (Number(item.liveCellsCount) + Number(item.deadCellsCount)).toString(),
      }))
    }),

  fetchStatisticDifficultyUncleRateEpoch: () =>
    v1GetUnwrappedList<State.StatisticDifficultyUncleRateEpoch>(`/epoch_statistics/epoch_time-epoch_length`).then(
      // Data may enter the cache, so it is purify to reduce volume.
      items => items.map(item => pick(item, ['epochNumber', 'epochTime', 'epochLength'])),
    ),

  fetchStatisticAddressBalanceRank: () =>
    v1GetUnwrapped<State.StatisticAddressBalanceRanking>(`/statistics/address_balance_ranking`).then(
      res => res.addressBalanceRanking,
    ),

  fetchStatisticBalanceDistribution: () =>
    v1GetUnwrapped<State.StatisticAddressBalanceDistribution>(`/distribution_data/address_balance_distribution`),

  fetchStatisticTxFeeHistory: () => v1GetUnwrappedList<State.StatisticTransactionFee>(`/daily_statistics/total_tx_fee`),

  fetchStatisticBlockTimeDistribution: () =>
    v1GetUnwrapped<State.StatisticBlockTimeDistributions>(`/distribution_data/block_time_distribution`),

  fetchStatisticAverageBlockTimes: () =>
    v1GetUnwrapped<State.StatisticAverageBlockTimes>(`/distribution_data/average_block_time`).then(
      res => res.averageBlockTime,
    ),

  // Unused currently
  fetchStatisticOccupiedCapacity: () =>
    v1Get<Response.Wrapper<State.StatisticOccupiedCapacity>[]>(`/daily_statistics/occupied_capacity`),

  fetchStatisticEpochTimeDistribution: () =>
    v1GetUnwrapped<State.StatisticEpochTimeDistributions>(`/distribution_data/epoch_time_distribution`),

  // Unused currently
  fetchStatisticNewNodeCount: () =>
    v1Get<Response.Wrapper<State.StatisticNewNodeCount>[]>(`/daily_statistics/nodes_count`),

  // Unused currently
  fetchStatisticNodeDistribution: () =>
    v1GetWrapped<State.StatisticNodeDistributions>(`/distribution_data/nodes_distribution`),

  fetchStatisticTotalSupply: () =>
    v1GetUnwrappedList<State.StatisticTotalSupply>(`/daily_statistics/circulating_supply-burnt-locked_capacity`),

  fetchStatisticAnnualPercentageCompensation: () =>
    v1GetUnwrapped<State.StatisticAnnualPercentageCompensations>(`/monetary_data/nominal_apc`),

  fetchStatisticSecondaryIssuance: () =>
    v1GetUnwrappedList<State.StatisticSecondaryIssuance>(
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
    v1GetUnwrapped<State.StatisticInflationRates>(
      `/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`,
    ),

  fetchStatisticLiquidity: () =>
    v1GetUnwrappedList<State.StatisticLiquidity>(`/daily_statistics/circulating_supply-liquidity`).then(items => {
      return items.map(item => ({
        ...item,
        daoDeposit: new BigNumber(item.circulatingSupply).minus(new BigNumber(item.liquidity)).toFixed(2),
      }))
    }),

  fetchFlushChartCache: () => v1GetUnwrapped<State.StatisticCacheInfo>(`statistics/flush_cache_info`),

  fetchSimpleUDT: (typeHash: string) => v1GetUnwrapped<State.UDT>(`/udts/${typeHash}`),

  fetchSimpleUDTTransactions: ({
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
    v1GetUnwrappedPagedList<State.Transaction>(`/udt_transactions/${typeHash}`, {
      params: {
        page,
        page_size: size,
        address_hash: filter?.startsWith('0x') ? undefined : filter,
        tx_hash: filter?.startsWith('0x') ? filter : undefined,
        transfer_action: type,
      },
    }),

  fetchTokens: (page: number, size: number, sort?: string) =>
    v1GetUnwrappedPagedList<State.UDT>(`/udts`, {
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
  },

  fetchNFTCollections: (page: string, sort: string, type?: string) =>
    requesterV2
      .get<{
        data: Array<NFTCollection>
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

  fetchNFTCollectionItems: (id: string, page: string) =>
    requesterV2
      .get<{
        data: Array<NFTItem>
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
      .then(res => res.data),

  fetchNFTCollectionItem: (collectionId: string, id: string) =>
    requesterV2.get<NFTItem>(`nft/collections/${collectionId}/items/${id}`).then(res => res.data),

  fetchNFTItemByOwner: (owner: string, standard: string, page?: string) =>
    requesterV2
      .get<{
        data: Array<NFTItem>
        pagination: {
          series: Array<string>
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

  fetchScriptCKBTransactions: (codeHash: string, hashType: string, page: number, pageSize: number) =>
    requesterV2
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
      ),

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

  fetchNFTCollectionTransferList: (
    id: string,
    page: string,
    tokenId?: string | null,
    transferAction?: string | null,
    addressHash?: string | null,
    txHash?: string | null,
  ) =>
    requesterV2
      .get<TransferListRes>(`/nft/transfers`, {
        params: {
          page,
          collection_id: id,
          token_id: tokenId,
          transfer_action: transferAction,
          address_hash: addressHash,
          tx_hash: txHash,
        },
      })
      .then(res => res.data),

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
}

// ====================
// Types
// ====================

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
}

export interface ScriptInfo {
  id: string
  scriptName: string
  scriptType: string
  codeHash: string
  hashType: 'type' | 'data'
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  countOfTransactions: number
  countOfDeployedCells: number
  countOfReferringCells: number
}

export interface CKBTransactionInScript {
  id: number
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  transactionFee: number
  isCellbase: boolean
  txStatus: string
  displayInputs: State.Cell[]
  displayOutputs: State.Cell[]
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
  data: Array<TransferRes>
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
