import {
  fetchStatisticTotalDaoDeposit,
  fetchStatisticNewDaoDeposit,
  fetchStatisticNewDaoWithdraw,
  fetchStatisticCirculationRatio,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

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

export const getStatisticNewDaoWithdraw = (dispatch: AppDispatch) => {
  fetchStatisticNewDaoWithdraw().then(
    (response: Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewDaoWithdraw = data.map(wrapper => {
        return {
          dailyDaoWithdraw: wrapper.attributes.dailyDaoWithdraw,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticNewDaoWithdraw,
        payload: {
          statisticNewDaoWithdraw,
        },
      })
    },
  )
}

export const getStatisticCirculationRatio = (dispatch: AppDispatch) => {
  fetchStatisticCirculationRatio().then(
    (response: Response.Response<Response.Wrapper<State.StatisticCirculationRatio>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticCirculationRatios = data.map(wrapper => {
        return {
          circulationRatio: wrapper.attributes.circulationRatio,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticCirculationRatio,
        payload: {
          statisticCirculationRatios,
        },
      })
    },
  )
}
