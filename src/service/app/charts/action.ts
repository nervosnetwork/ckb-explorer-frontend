import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

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
