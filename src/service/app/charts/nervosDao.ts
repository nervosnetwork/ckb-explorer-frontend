import { fetchStatisticTotalDaoDeposit, fetchStatisticNewDaoDeposit } from '../../http/fetcher'
import { AppDispatch, PageActions } from '../../../contexts/providers/reducer'

export const getStatisticTotalDaoDeposit = (dispatch: AppDispatch) => {
  fetchStatisticTotalDaoDeposit().then(
    (response: Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]> | null) => {
      if (!response) return
      const { data } = response
      const totalDaoDeposits = data.map(wrapper => {
        return {
          totalDaoDeposit: wrapper.attributes.totalDaoDeposit,
          totalDepositorsCount: wrapper.attributes.totalDepositorsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticTotalDaoDeposit,
        payload: {
          statisticTotalDaoDeposits: totalDaoDeposits,
        },
      })
    },
  )
}

export const getStatisticNewDaoDeposit = (dispatch: AppDispatch) => {
  fetchStatisticNewDaoDeposit().then(
    (response: Response.Response<Response.Wrapper<State.StatisticNewDaoDeposit>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewDaoDeposits = data.map(wrapper => {
        return {
          dailyDaoDeposit: wrapper.attributes.dailyDaoDeposit,
          dailyDaoDepositorsCount: wrapper.attributes.dailyDaoDepositorsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticNewDaoDeposit,
        payload: {
          statisticNewDaoDeposits,
        },
      })
    },
  )
}
