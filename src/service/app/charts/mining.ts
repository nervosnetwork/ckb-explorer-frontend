/* eslint-disable no-restricted-syntax */
import BigNumber from 'bignumber.js'
import { fetchStatisticUncleRate } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { dispatchUncleRate } from './action'

export const getStatisticUncleRate = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.UncleRate)
  if (data) {
    dispatchUncleRate(dispatch, data)
    return
  }
  fetchStatisticUncleRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticUncleRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const uncleRates = data.map(wrapper => ({
        uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchUncleRate(dispatch, uncleRates)
      if (uncleRates && uncleRates.length > 0) {
        storeDateChartCache(ChartCachedKeys.UncleRate, uncleRates)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticUncleRateFetchEnd,
        payload: {
          statisticUncleRatesFetchEnd: true,
        },
      })
    })
}
