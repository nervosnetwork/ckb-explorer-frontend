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

  const datas: StatisticsData[] = []
  if (hashRates && hashRates.length > 0) {
    hashRates.forEach(hashRate => {
      datas.push({
        type: 'HashRate',
        blockNumber: hashRate.blockNumber,
        hashRate: new BigNumber(hashRate.hashRate).multipliedBy(1000).toNumber(),
      })
      const difficulty = findDifficulty(difficulties, hashRate.blockNumber)
      if (difficulty !== undefined) {
        datas.push({
          type: 'Difficulty',
          blockNumber: difficulty.blockNumber,
          difficulty: Number(difficulty.difficulty),
        })
        datas.push({
          type: 'EpochNumber',
          blockNumber: difficulty.blockNumber,
          epochNumber: difficulty.epochNumber,
        })
      }
    })
  } else if (difficulties && difficulties.length > 0) {
    difficulties.forEach(difficulty => {
      datas.push({
        type: 'Difficulty',
        blockNumber: difficulty.blockNumber,
        difficulty: Number(difficulty.difficulty),
      })
      datas.push({
        type: 'EpochNumber',
        blockNumber: difficulty.blockNumber,
        epochNumber: difficulty.epochNumber,
      })
    })
  }

  return datas
}

const handleStatisticsUnlceRate = (wrapper: Response.Wrapper<State.StatisticsChart>) => {
  const { uncleRate: uncleRates = [] } = wrapper.attributes
  return uncleRates.map(uncleRate => {
    return {
      ...uncleRate,
      uncleRate: Number(uncleRate.uncleRate.toFixed(4)),
    }
  })
}

export const getStatisticsChart = (dispatch: AppDispatch) => {
  const cachedStatisticsChartDatas = fetchCachedData<StatisticsData>(CachedKeys.StatisticsChart)
  if (cachedStatisticsChartDatas) {
    dispatch({
      type: PageActions.UpdateStatisticsChartData,
      payload: {
        statisticsChartDatas: cachedStatisticsChartDatas,
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
      const statisticsChartDatas = handleStatistics(wrapper)
      const statisticsUncleRates = handleStatisticsUnlceRate(wrapper)

      if (statisticsChartDatas && statisticsChartDatas.length > 0) {
        storeCachedData(CachedKeys.StatisticsChart, statisticsChartDatas)
        dispatch({
          type: PageActions.UpdateStatisticsChartData,
          payload: {
            statisticsChartDatas,
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

export default getStatisticsChart
