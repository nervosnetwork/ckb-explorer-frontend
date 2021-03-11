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
    case PageActions.UpdateStatisticDifficultyHashRateFetchEnd:
      return {
        ...state,
        statisticDifficultyHashRatesFetchEnd: payload.statisticDifficultyHashRatesFetchEnd,
      }
    case PageActions.UpdateStatisticDifficultyUncleRateEpoch:
      return {
        ...state,
        statisticDifficultyUncleRateEpochs: payload.statisticDifficultyUncleRateEpochs,
      }
    case PageActions.UpdateStatisticDifficultyUncleRateFetchEnd:
      return {
        ...state,
        statisticDifficultyUncleRatesFetchEnd: payload.statisticDifficultyUncleRatesFetchEnd,
      }
    case PageActions.UpdateStatisticDifficulty:
      return {
        ...state,
        statisticDifficulties: payload.statisticDifficulties,
      }
    case PageActions.UpdateStatisticDifficultyFetchEnd:
      return {
        ...state,
        statisticDifficultiesFetchEnd: payload.statisticDifficultiesFetchEnd,
      }
    case PageActions.UpdateStatisticHashRate:
      return {
        ...state,
        statisticHashRates: payload.statisticHashRates,
      }
    case PageActions.UpdateStatisticHashRateFetchEnd:
      return {
        ...state,
        statisticHashRatesFetchEnd: payload.statisticHashRatesFetchEnd,
      }
    case PageActions.UpdateStatisticUncleRate:
      return {
        ...state,
        statisticUncleRates: payload.statisticUncleRates,
      }
    case PageActions.UpdateStatisticUncleRateFetchEnd:
      return {
        ...state,
        statisticUncleRatesFetchEnd: payload.statisticUncleRatesFetchEnd,
      }
    case PageActions.UpdateStatisticTransactionCount:
      return {
        ...state,
        statisticTransactionCounts: payload.statisticTransactionCounts,
      }
    case PageActions.UpdateStatisticTransactionCountFetchEnd:
      return {
        ...state,
        statisticTransactionCountsFetchEnd: payload.statisticTransactionCountsFetchEnd,
      }
    case PageActions.UpdateStatisticAddressCount:
      return {
        ...state,
        statisticAddressCounts: payload.statisticAddressCounts,
      }
    case PageActions.UpdateStatisticAddressCountFetchEnd:
      return {
        ...state,
        statisticAddressCountsFetchEnd: payload.statisticAddressCountsFetchEnd,
      }
    case PageActions.UpdateStatisticTotalDaoDeposit:
      return {
        ...state,
        statisticTotalDaoDeposits: payload.statisticTotalDaoDeposits,
      }
    case PageActions.UpdateStatisticTotalDaoDepositFetchEnd:
      return {
        ...state,
        statisticTotalDaoDepositsFetchEnd: payload.statisticTotalDaoDepositsFetchEnd,
      }
    case PageActions.UpdateStatisticNewDaoDeposit:
      return {
        ...state,
        statisticNewDaoDeposits: payload.statisticNewDaoDeposits,
      }
    case PageActions.UpdateStatisticNewDaoDepositFetchEnd:
      return {
        ...state,
        statisticNewDaoDepositsFetchEnd: payload.statisticNewDaoDepositsFetchEnd,
      }
    case PageActions.UpdateStatisticNewDaoWithdraw:
      return {
        ...state,
        statisticNewDaoWithdraw: payload.statisticNewDaoWithdraw,
      }
    case PageActions.UpdateStatisticNewDaoWithdrawFetchEnd:
      return {
        ...state,
        statisticNewDaoWithdrawFetchEnd: payload.statisticNewDaoWithdrawFetchEnd,
      }
    case PageActions.UpdateStatisticCirculationRatio:
      return {
        ...state,
        statisticCirculationRatios: payload.statisticCirculationRatios,
      }
    case PageActions.UpdateStatisticCirculationRatioFetchEnd:
      return {
        ...state,
        statisticCirculationRatiosFetchEnd: payload.statisticCirculationRatiosFetchEnd,
      }
    case PageActions.UpdateStatisticCellCount:
      return {
        ...state,
        statisticCellCounts: payload.statisticCellCounts,
      }
    case PageActions.UpdateStatisticCellCountFetchEnd:
      return {
        ...state,
        statisticCellCountsFetchEnd: payload.statisticCellCountsFetchEnd,
      }
    case PageActions.UpdateStatisticAddressBalanceRank:
      return {
        ...state,
        statisticAddressBalanceRanks: payload.statisticAddressBalanceRanks,
      }
    case PageActions.UpdateStatisticAddressBalanceRankFetchEnd:
      return {
        ...state,
        statisticAddressBalanceRanksFetchEnd: payload.statisticAddressBalanceRanksFetchEnd,
      }
    case PageActions.UpdateStatisticBalanceDistribution:
      return {
        ...state,
        statisticBalanceDistributions: payload.statisticBalanceDistributions,
      }
    case PageActions.UpdateStatisticBalanceDistributionFetchEnd:
      return {
        ...state,
        statisticBalanceDistributionsFetchEnd: payload.statisticBalanceDistributionsFetchEnd,
      }
    case PageActions.UpdateStatisticTxFeeHistory:
      return {
        ...state,
        statisticTxFeeHistories: payload.statisticTxFeeHistories,
      }
    case PageActions.UpdateStatisticTxFeeHistoryFetchEnd:
      return {
        ...state,
        statisticTxFeeHistoriesFetchEnd: payload.statisticTxFeeHistoriesFetchEnd,
      }
    case PageActions.UpdateStatisticBlockTimeDistribution:
      return {
        ...state,
        statisticBlockTimeDistributions: payload.statisticBlockTimeDistributions,
      }
    case PageActions.UpdateStatisticBlockTimeDistributionFetchEnd:
      return {
        ...state,
        statisticBlockTimeDistributionsFetchEnd: payload.statisticBlockTimeDistributionsFetchEnd,
      }
    case PageActions.UpdateStatisticAverageBlockTime:
      return {
        ...state,
        statisticAverageBlockTimes: payload.statisticAverageBlockTimes,
      }
    case PageActions.UpdateStatisticAverageBlockTimeFetchEnd:
      return {
        ...state,
        statisticAverageBlockTimesFetchEnd: payload.statisticAverageBlockTimesFetchEnd,
      }
    case PageActions.UpdateStatisticOccupiedCapacity:
      return {
        ...state,
        statisticOccupiedCapacities: payload.statisticOccupiedCapacities,
      }
    case PageActions.UpdateStatisticOccupiedCapacityFetchEnd:
      return {
        ...state,
        statisticOccupiedCapacitiesFetchEnd: payload.statisticOccupiedCapacitiesFetchEnd,
      }
    case PageActions.UpdateStatisticEpochTimeDistribution:
      return {
        ...state,
        statisticEpochTimeDistributions: payload.statisticEpochTimeDistributions,
      }
    case PageActions.UpdateStatisticEpochTimeDistributionFetchEnd:
      return {
        ...state,
        statisticEpochTimeDistributionsFetchEnd: payload.statisticEpochTimeDistributionsFetchEnd,
      }
    case PageActions.UpdateStatisticNewNodeCount:
      return {
        ...state,
        statisticNewNodeCounts: payload.statisticNewNodeCounts,
      }
    case PageActions.UpdateStatisticNewNodeCountFetchEnd:
      return {
        ...state,
        statisticNewNodeCountsFetchEnd: payload.statisticNewNodeCountsFetchEnd,
      }
    case PageActions.UpdateStatisticNodeDistribution:
      return {
        ...state,
        statisticNodeDistributions: payload.statisticNodeDistributions,
      }
    case PageActions.UpdateStatisticNodeDistributionFetchEnd:
      return {
        ...state,
        statisticNodeDistributionsFetchEnd: payload.statisticNodeDistributionsFetchEnd,
      }
    case PageActions.UpdateStatisticTotalSupply:
      return {
        ...state,
        statisticTotalSupplies: payload.statisticTotalSupplies,
      }
    case PageActions.UpdateStatisticTotalSupplyFetchEnd:
      return {
        ...state,
        statisticTotalSuppliesFetchEnd: payload.statisticTotalSuppliesFetchEnd,
      }
    case PageActions.UpdateStatisticAnnualPercentageCompensation:
      return {
        ...state,
        statisticAnnualPercentageCompensations: payload.statisticAnnualPercentageCompensations,
      }
    case PageActions.UpdateStatisticAnnualPercentageCompensationFetchEnd:
      return {
        ...state,
        statisticAnnualPercentageCompensationsFetchEnd: payload.statisticAnnualPercentageCompensationsFetchEnd,
      }
    case PageActions.UpdateStatisticSecondaryIssuance:
      return {
        ...state,
        statisticSecondaryIssuance: payload.statisticSecondaryIssuance,
      }
    case PageActions.UpdateStatisticSecondaryIssuanceFetchEnd:
      return {
        ...state,
        statisticSecondaryIssuanceFetchEnd: payload.statisticSecondaryIssuanceFetchEnd,
      }
    case PageActions.UpdateStatisticInflationRate:
      return {
        ...state,
        statisticInflationRates: payload.statisticInflationRates,
      }
    case PageActions.UpdateStatisticInflationRateFetchEnd:
      return {
        ...state,
        statisticInflationRatesFetchEnd: payload.statisticInflationRatesFetchEnd,
      }
    case PageActions.UpdateStatisticLiquidity:
      return {
        ...state,
        statisticLiquidity: payload.statisticLiquidity,
      }
    case PageActions.UpdateStatisticLiquidityFetchEnd:
      return {
        ...state,
        statisticLiquidityFetchEnd: payload.statisticLiquidityFetchEnd,
      }
    case PageActions.UpdateStatisticMinerAddressDistribution:
      return {
        ...state,
        statisticMinerAddresses: payload.statisticMinerAddresses,
      }
    case PageActions.UpdateStatisticMinerAddressDistributionFetchEnd:
      return {
        ...state,
        statisticMinerAddressesFetchEnd: payload.statisticMinerAddressesFetchEnd,
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
    case PageActions.UpdateUDTFilterStatus:
      return {
        ...state,
        udtState: {
          ...state.udtState,
          filterStatus: payload.filterStatus,
        },
      }
    case PageActions.UpdateTokens:
      return {
        ...state,
        tokensState: {
          ...state.tokensState,
          tokens: payload.tokens,
        },
      }
    case PageActions.UpdateTokensStatus:
      return {
        ...state,
        tokensState: {
          ...state.tokensState,
          status: payload.status,
        },
      }
    default:
      return state
  }
}

export default pageReducer
