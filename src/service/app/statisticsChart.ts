import BigNumber from 'bignumber.js'
import {
  fetchStatisticsChart,
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRate,
  fetchStatisticTransactionCount,
  fetchStatisticAddressCount,
} from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'

const findDifficulty = (
  difficulties: {
    difficulty: string
    blockNumber: number
    epochNumber: number
  }[],
  blockNumber: number,
) => {
  if (difficulties && difficulties.length > 0) {
    const result = difficulties.find(difficulty => {
      return difficulty.blockNumber === blockNumber
    })
    return result || undefined
  }
  return undefined
}

const handleStatistics = (wrapper: Response.Wrapper<State.StatisticsChart>) => {
  let { hashRate: hashRates, difficulty: difficulties } = wrapper.attributes
  if (!hashRates && !difficulties) return []

  difficulties = difficulties.filter(difficulty => difficulty.epochNumber >= 4)
  hashRates = hashRates.filter(hashRate => hashRate.blockNumber >= difficulties[0].blockNumber)

  const dataList: State.StatisticsBaseData[] = []
  if (hashRates && hashRates.length > 0) {
    hashRates.forEach(hashRate => {
      dataList.push({
        type: 'HashRate',
        blockNumber: hashRate.blockNumber,
        hashRate: new BigNumber(hashRate.hashRate).multipliedBy(1000).toNumber(),
      })
      const difficulty = findDifficulty(difficulties, hashRate.blockNumber)
      if (difficulty !== undefined) {
        dataList.push({
          type: 'Difficulty',
          blockNumber: difficulty.blockNumber,
          difficulty: Number(difficulty.difficulty),
        })
        dataList.push({
          type: 'EpochNumber',
          blockNumber: difficulty.blockNumber,
          epochNumber: difficulty.epochNumber,
        })
      }
    })
  } else if (difficulties && difficulties.length > 0) {
    difficulties.forEach(difficulty => {
      dataList.push({
        type: 'Difficulty',
        blockNumber: difficulty.blockNumber,
        difficulty: Number(difficulty.difficulty),
      })
      dataList.push({
        type: 'EpochNumber',
        blockNumber: difficulty.blockNumber,
        epochNumber: difficulty.epochNumber,
      })
    })
  }

  return dataList
}

const handleStatisticsUncleRate = (wrapper: Response.Wrapper<State.StatisticsChart>) => {
  const { uncleRate: uncleRates = [] } = wrapper.attributes
  return uncleRates.map(uncleRate => {
    return {
      ...uncleRate,
      uncleRate: Number(uncleRate.uncleRate.toFixed(4)),
    }
  })
}

export const getStatisticsChart = (dispatch: AppDispatch) => {
  fetchStatisticsChart().then((wrapper: Response.Wrapper<State.StatisticsChart> | null) => {
    if (wrapper) {
      const statisticsChartData = handleStatistics(wrapper)
      const statisticsUncleRates = handleStatisticsUncleRate(wrapper)

      if (statisticsChartData && statisticsChartData.length > 0) {
        dispatch({
          type: PageActions.UpdateStatisticsChartData,
          payload: {
            statisticsChartData,
          },
        })
      }

      if (statisticsUncleRates && statisticsUncleRates.length > 0) {
        dispatch({
          type: PageActions.UpdateStatisticsUncleRate,
          payload: {
            statisticsUncleRates,
          },
        })
      }
    }
  })
}

export const getStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyHashRate().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyHashRates = data
        .map(wrapper => {
          return {
            blockNumber: wrapper.attributes.blockNumber,
            difficulty: wrapper.attributes.difficulty,
            hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toNumber(),
          }
        })
        .reverse()
      if (difficultyHashRates.length === 0) return
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
      const difficultyUncleRates = data
        .map(wrapper => {
          return {
            epochNumber: wrapper.attributes.epochNumber,
            difficulty: wrapper.attributes.difficulty,
            uncleRate: new BigNumber(wrapper.attributes.uncleRate).toNumber().toFixed(4),
          }
        })
        .reverse()
      if (difficultyUncleRates.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRate,
        payload: {
          statisticDifficultyUncleRates: difficultyUncleRates,
        },
      })
    },
  )
}

export const getStatisticTransactionCount = (dispatch: AppDispatch) => {
  fetchStatisticTransactionCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const transactionCounts = data.map(wrapper => {
        return {
          transactionsCount: wrapper.attributes.transactionsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      if (transactionCounts.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticTransactionCount,
        payload: {
          statisticTransactionCounts: transactionCounts,
        },
      })
    },
  )
}

export const getStatisticAddressCount = (dispatch: AppDispatch) => {
  fetchStatisticAddressCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticAddressCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const addressCounts = data.map(wrapper => {
        return {
          addressesCount: wrapper.attributes.addressesCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      if (addressCounts.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticAddressCount,
        payload: {
          statisticAddressCounts: addressCounts,
        },
      })
    },
  )
}

export default getStatisticsChart
