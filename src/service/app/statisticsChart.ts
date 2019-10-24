import BigNumber from 'bignumber.js'
import { fetchStatisticsChart } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { CachedKeys } from '../../utils/const'

export interface StatisticsData {
  blockNumber: number
  type: 'Difficulty' | 'HashRate' | 'EpochNumber'
  difficulty?: number
  hashRate?: number
  epochNumber?: number
}

export interface StatisticsUncleRate {
  uncleRate: number
  epochNumber: number
}

const findDifficulty = (
  difficulties: { difficulty: string; blockNumber: number; epochNumber: number }[],
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
  const { hashRate: hashRates, difficulty: difficulties } = wrapper.attributes
  if (!hashRates && !difficulties) return []

  const dataList: StatisticsData[] = []
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
  const cachedStatisticsChartData = fetchCachedData<StatisticsData>(CachedKeys.StatisticsChart)
  if (cachedStatisticsChartData) {
    dispatch({
      type: PageActions.UpdateStatisticsChartData,
      payload: {
        statisticsChartData: cachedStatisticsChartData,
      },
    })
  }
  const cachedStatisticsUncleRates = fetchCachedData<StatisticsUncleRate>(CachedKeys.StatisticsUncleRateChart)
  if (cachedStatisticsUncleRates) {
    dispatch({
      type: PageActions.UpdateStatisticsUncleRate,
      payload: {
        statisticsUncleRates: cachedStatisticsUncleRates,
      },
    })
  }
  fetchStatisticsChart().then((wrapper: Response.Wrapper<State.StatisticsChart> | null) => {
    if (wrapper) {
      const statisticsChartData = handleStatistics(wrapper)
      const statisticsUncleRates = handleStatisticsUncleRate(wrapper)

      if (statisticsChartData && statisticsChartData.length > 0) {
        storeCachedData(CachedKeys.StatisticsChart, statisticsChartData)
        dispatch({
          type: PageActions.UpdateStatisticsChartData,
          payload: {
            statisticsChartData,
          },
        })
      }

      if (statisticsUncleRates && statisticsUncleRates.length > 0) {
        storeCachedData(CachedKeys.StatisticsUncleRateChart, statisticsUncleRates)
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
