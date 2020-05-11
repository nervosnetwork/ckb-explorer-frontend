import { PageActions } from '../actions'

export const pageReducer = (
  state: State.AppState,
  { type, payload }: { type: PageActions; payload: State.PagePayload },
): State.AppState => {
  switch (type) {
    // home page
    case PageActions.UpdateHomeBlocks:
      return {
        ...state,
        homeBlocks: payload.homeBlocks,
      }

    // block list page
    case PageActions.UpdateBlockList:
      return {
        ...state,
        blockListState: {
          ...state.blockListState,
          blocks: payload.blocks,
        },
      }
    case PageActions.UpdateBlockListTotal:
      return {
        ...state,
        blockListState: {
          ...state.blockListState,
          total: payload.total,
        },
      }

    // address page
    case PageActions.UpdateAddress:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          address: payload.address,
        },
      }
    case PageActions.UpdateAddressTransactions:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateAddressTotal:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          total: payload.total,
        },
      }
    case PageActions.UpdateAddressStatus:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          addressStatus: payload.addressStatus,
        },
      }
    case PageActions.UpdateAddressTransactionsStatus:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          transactionsStatus: payload.transactionsStatus,
        },
      }

    // block detail page
    case PageActions.UpdateBlock:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          block: payload.block,
        },
      }
    case PageActions.UpdateBlockTransactions:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateBlockTotal:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          total: payload.total,
        },
      }
    case PageActions.UpdateBlockStatus:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          status: payload.status,
        },
      }

    // transaction page
    case PageActions.UpdateTransaction:
      return {
        ...state,
        transactionState: {
          ...state.transactionState,
          transaction: payload.transaction,
        },
      }
    case PageActions.UpdateTransactionStatus:
      return {
        ...state,
        transactionState: {
          ...state.transactionState,
          status: payload.status,
        },
      }
    case PageActions.UpdateTransactions:
      return {
        ...state,
        transactionsState: {
          ...state.transactionsState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateTransactionsTotal:
      return {
        ...state,
        transactionsState: {
          ...state.transactionsState,
          total: payload.total,
        },
      }
    case PageActions.UpdateTransactionScriptFetched:
      return {
        ...state,
        transactionState: {
          ...state.transactionState,
          scriptFetched: payload.scriptFetched,
        },
      }

    // statistic chart page
    case PageActions.UpdateStatistics:
      return {
        ...state,
        statistics: payload.statistics,
      }
    case PageActions.UpdateStatisticDifficultyHashRate:
      return {
        ...state,
        statisticDifficultyHashRates: payload.statisticDifficultyHashRates,
      }
    case PageActions.UpdateStatisticDifficultyUncleRate:
      return {
        ...state,
        statisticDifficultyUncleRates: payload.statisticDifficultyUncleRates,
      }
    case PageActions.UpdateStatisticDifficulty:
      return {
        ...state,
        statisticDifficulties: payload.statisticDifficulties,
      }
    case PageActions.UpdateStatisticHashRate:
      return {
        ...state,
        statisticHashRates: payload.statisticHashRates,
      }
    case PageActions.UpdateStatisticUncleRate:
      return {
        ...state,
        statisticUncleRates: payload.statisticUncleRates,
      }
    case PageActions.UpdateStatisticTransactionCount:
      return {
        ...state,
        statisticTransactionCounts: payload.statisticTransactionCounts,
      }
    case PageActions.UpdateStatisticAddressCount:
      return {
        ...state,
        statisticAddressCounts: payload.statisticAddressCounts,
      }
    case PageActions.UpdateStatisticTotalDaoDeposit:
      return {
        ...state,
        statisticTotalDaoDeposits: payload.statisticTotalDaoDeposits,
      }
    case PageActions.UpdateStatisticNewDaoDeposit:
      return {
        ...state,
        statisticNewDaoDeposits: payload.statisticNewDaoDeposits,
      }
    case PageActions.UpdateStatisticNewDaoWithdraw:
      return {
        ...state,
        statisticNewDaoWithdraw: payload.statisticNewDaoWithdraw,
      }
    case PageActions.UpdateStatisticCirculationRatio:
      return {
        ...state,
        statisticCirculationRatios: payload.statisticCirculationRatios,
      }
    case PageActions.UpdateStatisticCellCount:
      return {
        ...state,
        statisticCellCounts: payload.statisticCellCounts,
      }
    case PageActions.UpdateStatisticAddressBalanceRank:
      return {
        ...state,
        statisticAddressBalanceRanks: payload.statisticAddressBalanceRanks,
      }
    case PageActions.UpdateStatisticBalanceDistribution:
      return {
        ...state,
        statisticBalanceDistributions: payload.statisticBalanceDistributions,
      }
    case PageActions.UpdateStatisticTxFeeHistory:
      return {
        ...state,
        statisticTxFeeHistories: payload.statisticTxFeeHistories,
      }
    case PageActions.UpdateStatisticBlockTimeDistribution:
      return {
        ...state,
        statisticBlockTimeDistributions: payload.statisticBlockTimeDistributions,
      }
    case PageActions.UpdateStatisticAverageBlockTime:
      return {
        ...state,
        statisticAverageBlockTimes: payload.statisticAverageBlockTimes,
      }
    case PageActions.UpdateStatisticOccupiedCapacity:
      return {
        ...state,
        statisticOccupiedCapacities: payload.statisticOccupiedCapacities,
      }
    case PageActions.UpdateStatisticEpochTimeDistribution:
      return {
        ...state,
        statisticEpochTimeDistributions: payload.statisticEpochTimeDistributions,
      }
    case PageActions.UpdateStatisticNewNodeCount:
      return {
        ...state,
        statisticNewNodeCounts: payload.statisticNewNodeCounts,
      }
    case PageActions.UpdateStatisticNodeDistribution:
      return {
        ...state,
        statisticNodeDistributions: payload.statisticNodeDistributions,
      }

    // nervos dao page
    case PageActions.UpdateNervosDao:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          nervosDao: payload.nervosDao,
        },
      }
    case PageActions.UpdateNervosDaoTransactions:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateNervosDaoTransactionsStatus:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          transactionsStatus: payload.transactionsStatus,
        },
      }
    case PageActions.UpdateNervosDaoTransactionsTotal:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          total: payload.total,
        },
      }
    case PageActions.UpdateNervosDaoDepositors:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          depositors: payload.depositors,
        },
      }
    case PageActions.UpdateNervosDaoStatus:
      return {
        ...state,
        nervosDaoState: {
          ...state.nervosDaoState,
          status: payload.status,
        },
      }

    // simple udt page
    case PageActions.UpdateUDT:
      return {
        ...state,
        udtState: {
          ...state.udtState,
          udt: payload.udt,
        },
      }
    case PageActions.UpdateUDTTransactions:
      return {
        ...state,
        udtState: {
          ...state.udtState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateUDTTransactionsTotal:
      return {
        ...state,
        udtState: {
          ...state.udtState,
          total: payload.total,
        },
      }
    case PageActions.UpdateUDTStatus:
      return {
        ...state,
        udtState: {
          ...state.udtState,
          status: payload.status,
        },
      }
    default:
      return state
  }
}

export default pageReducer
