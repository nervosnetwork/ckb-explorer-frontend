import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

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
