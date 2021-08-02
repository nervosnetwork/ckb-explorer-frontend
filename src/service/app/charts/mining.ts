/* eslint-disable no-restricted-syntax */
import BigNumber from 'bignumber.js'
import {
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRateEpoch,
  fetchStatisticDifficulty,
  fetchStatisticHashRate,
  fetchStatisticUncleRate,
  fetchStatisticMinerAddressDistribution,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { ChartCachedKeys } from '../../../constants/cache'
import {
  fetchDateChartCache,
  storeDateChartCache,
  fetchEpochChartCache,
  storeEpochChartCache,
} from '../../../utils/cache'
import {
  dispatchDifficulty,
  dispatchHashRate,
  dispatchUncleRate,
  dispatchMinerAddressDistribution,
  dispatchDifficultyHashRate,
  dispatchDifficultyUncleRateEpoch,
} from './action'
import { isMobile } from '../../../utils/screen'

export const getStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  const data = fetchEpochChartCache(ChartCachedKeys.DifficultyHashRate)
  if (data) {
    dispatchDifficultyHashRate(dispatch, data)
    return
  }
  fetchStatisticDifficultyHashRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyHashRates = data.map(wrapper => ({
        epochNumber: wrapper.attributes.epochNumber,
        difficulty: wrapper.attributes.difficulty,
        hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toNumber(),
      }))
      dispatchDifficultyHashRate(dispatch, difficultyHashRates)
      if (difficultyHashRates && difficultyHashRates.length > 0) {
        storeEpochChartCache(ChartCachedKeys.DifficultyHashRate, difficultyHashRates)
      }
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

const sliceStatistics = (data: Array<State.StatisticDifficultyUncleRateEpoch>) =>
  data.slice(isMobile() ? Math.ceil(data.length / 2) : 0)

export const getStatisticDifficultyUncleRateEpoch = (dispatch: AppDispatch) => {
  const data = fetchEpochChartCache(
    ChartCachedKeys.DifficultyUncleRateEpoch,
  ) as State.StatisticDifficultyUncleRateEpoch[]

  if (data) {
    dispatchDifficultyUncleRateEpoch(dispatch, sliceStatistics(data))
    return
  }
  fetchStatisticDifficultyUncleRateEpoch()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRateEpoch>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyUncleRateEpochs = data.slice(Math.ceil(data.length / 2)).map(wrapper => ({
        epochNumber: wrapper.attributes.epochNumber,
        difficulty: wrapper.attributes.difficulty,
        uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        epochTime: wrapper.attributes.epochTime,
        epochLength: wrapper.attributes.epochLength,
      }))
      const dispatchData = sliceStatistics(difficultyUncleRateEpochs)
      dispatchDifficultyUncleRateEpoch(dispatch, dispatchData)
      if (difficultyUncleRateEpochs && difficultyUncleRateEpochs.length > 0) {
        storeEpochChartCache(ChartCachedKeys.DifficultyUncleRateEpoch, difficultyUncleRateEpochs)
      }
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
  const data = fetchDateChartCache(ChartCachedKeys.Difficulty)
  if (data) {
    dispatchDifficulty(dispatch, data)
    return
  }
  fetchStatisticDifficulty()
    .then((response: Response.Response<Response.Wrapper<State.StatisticDifficulty>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficulties = data.map(wrapper => ({
        avgDifficulty: wrapper.attributes.avgDifficulty,
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchDifficulty(dispatch, difficulties)
      if (difficulties && difficulties.length > 0) {
        storeDateChartCache(ChartCachedKeys.Difficulty, difficulties)
      }
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
  const data = fetchDateChartCache(ChartCachedKeys.HashRate)
  if (data) {
    dispatchHashRate(dispatch, data)
    return
  }
  fetchStatisticHashRate()
    .then((response: Response.Response<Response.Wrapper<State.StatisticHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const hashRates = data.map(wrapper => ({
        avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toNumber(),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchHashRate(dispatch, hashRates)
      if (hashRates && hashRates.length > 0) {
        storeDateChartCache(ChartCachedKeys.HashRate, hashRates)
      }
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
