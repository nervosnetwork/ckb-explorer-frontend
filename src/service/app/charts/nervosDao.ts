import {
  fetchStatisticTotalDaoDeposit,
  fetchStatisticNewDaoDeposit,
  fetchStatisticNewDaoWithdraw,
  fetchStatisticCirculationRatio,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchChartCache, storeChartCache } from '../../../utils/cache'
import { CachedKeys } from '../../../utils/const'

export const getStatisticTotalDaoDeposit = (dispatch: AppDispatch) => {
  const data = fetchChartCache(CachedKeys.TotalDeposit)
  if (data) {
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
    return
  }
  fetchStatisticTotalDaoDeposit()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]> | null) => {
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
      dispatch({
        type: PageActions.UpdateStatisticTotalDaoDepositFetchEnd,
        payload: {
          statisticTotalDaoDepositsFetchEnd: true,
        },
      })
      storeChartCache(CachedKeys.TotalDeposit, totalDaoDeposits)
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

export const getStatisticNewDaoDeposit = (dispatch: AppDispatch) => {
  const data = fetchChartCache(CachedKeys.DailyDeposit)
  if (data) {
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
    return
  }
  fetchStatisticNewDaoDeposit()
    .then((response: Response.Response<Response.Wrapper<State.StatisticNewDaoDeposit>[]> | null) => {
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
      dispatch({
        type: PageActions.UpdateStatisticNewDaoDepositFetchEnd,
        payload: {
          statisticNewDaoDepositsFetchEnd: true,
        },
      })
      storeChartCache(CachedKeys.DailyDeposit, statisticNewDaoDeposits)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticNewDaoDepositFetchEnd,
        payload: {
          statisticNewDaoDepositsFetchEnd: true,
        },
      })
    })
}

export const getStatisticNewDaoWithdraw = (dispatch: AppDispatch) => {
  fetchStatisticNewDaoWithdraw()
    .then((response: Response.Response<Response.Wrapper<State.StatisticNewDaoWithdraw>[]> | null) => {
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

export const getStatisticCirculationRatio = (dispatch: AppDispatch) => {
  const data = fetchChartCache(CachedKeys.DepositCirculationRatio)
  if (data) {
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
    return
  }
  fetchStatisticCirculationRatio()
    .then((response: Response.Response<Response.Wrapper<State.StatisticCirculationRatio>[]> | null) => {
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
      dispatch({
        type: PageActions.UpdateStatisticCirculationRatioFetchEnd,
        payload: {
          statisticCirculationRatiosFetchEnd: true,
        },
      })
      storeChartCache(CachedKeys.DepositCirculationRatio, statisticCirculationRatios)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticCirculationRatioFetchEnd,
        payload: {
          statisticCirculationRatiosFetchEnd: true,
        },
      })
    })
}
