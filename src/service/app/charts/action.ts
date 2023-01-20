import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

export const dispatchTransactionFee = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticTxFeeHistory,
    payload: {
      statisticTxFeeHistories: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticTxFeeHistoryFetchEnd,
    payload: {
      statisticTxFeeHistoriesFetchEnd: true,
    },
  })
}

export const dispatchAverageBlockTime = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticAverageBlockTime,
    payload: {
      statisticAverageBlockTimes: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticAverageBlockTimeFetchEnd,
    payload: {
      statisticAverageBlockTimesFetchEnd: true,
    },
  })
}

export const dispatchBlockTimeDistribution = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticBlockTimeDistribution,
    payload: {
      statisticBlockTimeDistributions: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticBlockTimeDistributionFetchEnd,
    payload: {
      statisticBlockTimeDistributionsFetchEnd: true,
    },
  })
}

export const dispatchEpochTimeDistribution = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticEpochTimeDistribution,
    payload: {
      statisticEpochTimeDistributions: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticEpochTimeDistributionFetchEnd,
    payload: {
      statisticEpochTimeDistributionsFetchEnd: true,
    },
  })
}

export const dispatchTotalSupply = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticTotalSupply,
    payload: {
      statisticTotalSupplies: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticTotalSupplyFetchEnd,
    payload: {
      statisticTotalSuppliesFetchEnd: true,
    },
  })
}

export const dispatchAPC = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticAnnualPercentageCompensation,
    payload: {
      statisticAnnualPercentageCompensations: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticAnnualPercentageCompensationFetchEnd,
    payload: {
      statisticAnnualPercentageCompensationsFetchEnd: true,
    },
  })
}

export const dispatchSecondaryIssuance = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticSecondaryIssuance,
    payload: {
      statisticSecondaryIssuance: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticSecondaryIssuanceFetchEnd,
    payload: {
      statisticSecondaryIssuanceFetchEnd: true,
    },
  })
}

export const dispatchInflationRate = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticInflationRate,
    payload: {
      statisticInflationRates: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticInflationRateFetchEnd,
    payload: {
      statisticInflationRatesFetchEnd: true,
    },
  })
}

export const dispatchLiquidity = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticLiquidity,
    payload: {
      statisticLiquidity: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticLiquidityFetchEnd,
    payload: {
      statisticLiquidityFetchEnd: true,
    },
  })
}

export const dispatchTotalDeposit = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticTotalDaoDeposit,
    payload: {
      statisticTotalDaoDeposits: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticTotalDaoDepositFetchEnd,
    payload: {
      statisticTotalDaoDepositsFetchEnd: true,
    },
  })
}

export const dispatchDailyDeposit = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticNewDaoDeposit,
    payload: {
      statisticNewDaoDeposits: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticNewDaoDepositFetchEnd,
    payload: {
      statisticNewDaoDepositsFetchEnd: true,
    },
  })
}

export const dispatchDepositCirculationRatio = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticCirculationRatio,
    payload: {
      statisticCirculationRatios: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticCirculationRatioFetchEnd,
    payload: {
      statisticCirculationRatiosFetchEnd: true,
    },
  })
}

export const dispatchNodeDistribution = (dispatch: AppDispatch, data: any) => {
  dispatch({
    type: PageActions.UpdateStatisticNodeDistribution,
    payload: {
      statisticNodeDistributions: data,
    },
  })
  dispatch({
    type: PageActions.UpdateStatisticNodeDistributionFetchEnd,
    payload: {
      statisticNodeDistributionsFetchEnd: true,
    },
  })
}
