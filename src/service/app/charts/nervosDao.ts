import { fetchStatisticTotalDaoDeposit, fetchStatisticNewDaoWithdraw } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchTotalDeposit } from './action'

export const getStatisticTotalDaoDeposit = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.TotalDeposit)
  if (data) {
    dispatchTotalDeposit(dispatch, data)
    return
  }
  fetchStatisticTotalDaoDeposit()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]> | null) => {
      if (!response) return
      const { data } = response
      const totalDaoDeposits = data.map(wrapper => ({
        totalDaoDeposit: wrapper.attributes.totalDaoDeposit,
        totalDepositorsCount: wrapper.attributes.totalDepositorsCount,
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchTotalDeposit(dispatch, totalDaoDeposits)
      if (totalDaoDeposits && totalDaoDeposits.length > 0) {
        storeDateChartCache(ChartCachedKeys.TotalDeposit, totalDaoDeposits)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticTotalDaoDepositFetchEnd,
        payload: {
          statisticTotalDaoDepositsFetchEnd: true,
        },
      })
    })
}

export const getStatisticNewDaoWithdraw = (dispatch: AppDispatch) => {
  fetchStatisticNewDaoWithdraw()
    .then((response: Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewDaoWithdraw = data.map(wrapper => ({
        dailyDaoWithdraw: wrapper.attributes.dailyDaoWithdraw,
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatch({
        type: PageActions.UpdateStatisticNewDaoWithdraw,
        payload: {
          statisticNewDaoWithdraw,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticNewDaoWithdrawFetchEnd,
        payload: {
          statisticNewDaoWithdrawFetchEnd: true,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticNewDaoWithdrawFetchEnd,
        payload: {
          statisticNewDaoWithdrawFetchEnd: true,
        },
      })
    })
}
