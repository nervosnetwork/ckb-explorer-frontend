import BigNumber from 'bignumber.js'
import {
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRate,
  fetchStatisticDifficulty,
  fetchStatisticHashRate,
  fetchStatisticUncleRate,
  fetchStatisticMinerAddressDistribution,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { CachedKeys } from '../../../utils/const'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { dispatchDifficulty, dispatchHashRate, dispatchUncleRate } from './action'

export const getStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyHashRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyHashRates = data.map(wrapper => {
        return {
          epochNumber: wrapper.attributes.epochNumber,
          difficulty: wrapper.attributes.difficulty,
          hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toNumber(),
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficultyHashRate,
        payload: {
          statisticDifficultyHashRates: difficultyHashRates,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficultyHashRateFetchEnd,
        payload: {
          statisticDifficultyHashRatesFetchEnd: true,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticDifficultyHashRateFetchEnd,
        payload: {
          statisticDifficultyHashRatesFetchEnd: true,
        },
      })
    })
}

export const getStatisticDifficultyUncleRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyUncleRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyUncleRates = data.map(wrapper => {
        return {
          epochNumber: wrapper.attributes.epochNumber,
          difficulty: wrapper.attributes.difficulty,
          uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRate,
        payload: {
          statisticDifficultyUncleRates: difficultyUncleRates,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRateFetchEnd,
        payload: {
          statisticDifficultyUncleRatesFetchEnd: true,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRateFetchEnd,
        payload: {
          statisticDifficultyUncleRatesFetchEnd: true,
        },
      })
    })
}

export const getStatisticDifficulty = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.Difficulty)
  if (data) {
    dispatchDifficulty(dispatch, data)
    return
  }
  fetchStatisticDifficulty()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficulty>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficulties = data.map(wrapper => {
        return {
          avgDifficulty: wrapper.attributes.avgDifficulty,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatchDifficulty(dispatch, difficulties)
      storeDateChartCache(CachedKeys.Difficulty, difficulties)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticDifficultyFetchEnd,
        payload: {
          statisticDifficultiesFetchEnd: true,
        },
      })
    })
}

export const getStatisticHashRate = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.HashRate)
  if (data) {
    dispatchHashRate(dispatch, data)
    return
  }
  fetchStatisticHashRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const hashRates = data.map(wrapper => {
        return {
          avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toNumber(),
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatchHashRate(dispatch, hashRates)
      storeDateChartCache(CachedKeys.HashRate, hashRates)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticHashRateFetchEnd,
        payload: {
          statisticHashRatesFetchEnd: true,
        },
      })
    })
}

export const getStatisticUncleRate = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.UncleRate)
  if (data) {
    dispatchUncleRate(dispatch, data)
    return
  }
  fetchStatisticUncleRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticUncleRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const uncleRates = data.map(wrapper => {
        return {
          uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatchUncleRate(dispatch, uncleRates)
      storeDateChartCache(CachedKeys.UncleRate, uncleRates)
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
  fetchStatisticMinerAddressDistribution()
    .then((wrapper: Response.Wrapper<State.StatisticMinerAddressDistribution> | null) => {
      if (!wrapper) return
      let statisticMinerAddresses: State.StatisticMinerAddress[] = []
      let blockSum = 0
      for (let value of Object.entries(wrapper.attributes.minerAddressDistribution)) {
        blockSum += Number(value[1])
      }
      for (let value of Object.entries(wrapper.attributes.minerAddressDistribution)) {
        statisticMinerAddresses.push({
          address: value[0],
          radio: (Number(value[1]) / blockSum).toFixed(3),
        })
      }
      dispatch({
        type: PageActions.UpdateStatisticMinerAddressDistribution,
        payload: {
          statisticMinerAddresses,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticMinerAddressDistributionFetchEnd,
        payload: {
          statisticMinerAddressesFetchEnd: true,
        },
      })
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
