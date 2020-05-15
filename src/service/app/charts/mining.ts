import BigNumber from 'bignumber.js'
import {
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRate,
  fetchStatisticDifficulty,
  fetchStatisticHashRate,
  fetchStatisticUncleRate,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

export const getStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyHashRate().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]> | null) => {
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
    },
  )
}

export const getStatisticDifficultyUncleRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyUncleRate().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRate>[]> | null) => {
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
    },
  )
}

export const getStatisticDifficulty = (dispatch: AppDispatch) => {
  fetchStatisticDifficulty().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficulty>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficulties = data.map(wrapper => {
        return {
          avgDifficulty: wrapper.attributes.avgDifficulty,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficulty,
        payload: {
          statisticDifficulties: difficulties,
        },
      })
    },
  )
}

export const getStatisticHashRate = (dispatch: AppDispatch) => {
  fetchStatisticHashRate().then((response: Response.Response<Response.Wrapper<State.StatisticHashRate>[]> | null) => {
    if (!response) return
    const { data } = response
    const hashRates = data.map(wrapper => {
      return {
        avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toNumber(),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticHashRate,
      payload: {
        statisticHashRates: hashRates,
      },
    })
  })
}

export const getStatisticUncleRate = (dispatch: AppDispatch) => {
  fetchStatisticUncleRate().then((response: Response.Response<Response.Wrapper<State.StatisticUncleRate>[]> | null) => {
    if (!response) return
    const { data } = response
    const uncleRates = data.map(wrapper => {
      return {
        uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticUncleRate,
      payload: {
        statisticUncleRates: uncleRates,
      },
    })
  })
}
