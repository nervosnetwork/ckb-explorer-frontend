/* eslint-disable no-restricted-syntax */
import BigNumber from 'bignumber.js'
import { fetchStatisticUncleRate, fetchStatisticMinerAddressDistribution } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { dispatchUncleRate, dispatchMinerAddressDistribution } from './action'

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

export const getStatisticMinerAddressDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.MinerAddressDistribution)
  if (data) {
    dispatchMinerAddressDistribution(dispatch, data)
    return
  }
  fetchStatisticMinerAddressDistribution()
    .then((wrapper: Response.Wrapper<State.StatisticMinerAddressDistribution> | null) => {
      if (!wrapper) return
      const statisticMinerAddresses: State.StatisticMinerAddress[] = []
      let blockSum = 0
      for (const value of Object.entries(wrapper.attributes.minerAddressDistribution)) {
        blockSum += Number(value[1])
      }
      for (const value of Object.entries(wrapper.attributes.minerAddressDistribution)) {
        statisticMinerAddresses.push({
          address: value[0],
          radio: (Number(value[1]) / blockSum).toFixed(3),
        })
      }
      dispatchMinerAddressDistribution(dispatch, statisticMinerAddresses)
      if (statisticMinerAddresses && statisticMinerAddresses.length > 0) {
        storeDateChartCache(ChartCachedKeys.MinerAddressDistribution, statisticMinerAddresses)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticMinerAddressDistributionFetchEnd,
        payload: {
          statisticMinerAddressesFetchEnd: true,
        },
      })
    })
}
