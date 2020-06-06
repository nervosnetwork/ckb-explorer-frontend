import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficultyUncleRate } from '../../../service/app/charts/mining'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { handleDifficulty } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'

const gridThumbnail = {
  left: '4%',
  right: '4%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '3%',
  top: '8%',
  bottom: '5%',
  containLabel: true,
}

const max = (statisticChartData: State.StatisticDifficultyUncleRate[]) => {
  const array = statisticChartData.flatMap(data => Number(data.uncleRate) * 100)
  return Math.max(5, Math.ceil(Math.max(...array)))
}

const getOption = (statisticChartData: State.StatisticDifficultyUncleRate[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('block.epoch'))} ${dataList[0].name}</div>`
            if (dataList[0]) {
              result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
                i18n.t('block.difficulty'),
              )} ${handleDifficulty(dataList[0].data)}</div>`
            }
            if (dataList[1]) {
              result += `<div>${tooltipColor(ChartColors[1])}${widthSpan(i18n.t('block.uncle_rate'))} ${
                dataList[1].data
              }%</div>`
            }
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          data: [{ name: i18n.t('block.difficulty') }, { name: i18n.t('block.uncle_rate') }],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('block.epoch'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticChartData.map(data => data.epochNumber),
        axisLabel: {
          formatter: (value: string) => value,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('block.difficulty'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
      {
        position: 'right',
        name: isMobile() || isThumbnail ? '' : i18n.t('block.uncle_rate'),
        type: 'value',
        scale: true,
        splitLine: {
          show: false,
        },
        max: max(statisticChartData),
        min: 0,
        axisLine: {
          lineStyle: {
            color: ChartColors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('block.difficulty'),
        type: 'line',
        step: 'start',
        areaStyle: {
          color: '#85bae0',
        },
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticChartData.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.uncle_rate'),
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 3,
        data: statisticChartData.map(data => (Number(data.uncleRate) * 100).toFixed(2)),
        markLine: isThumbnail
          ? undefined
          : {
              symbol: 'none',
              lineStyle: {
                color: ChartColors[1],
              },
              data: [
                {
                  name: i18n.t('block.uncle_rate_target'),
                  yAxis: 2.5,
                },
              ],
              label: {
                formatter: (params: any) => `${params.value}%`,
              },
            },
      },
    ],
  }
}

export const DifficultyUncleRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticDifficultyUncleRates, statisticDifficultyUncleRatesFetchEnd } = useAppState()
  if (!statisticDifficultyUncleRatesFetchEnd || statisticDifficultyUncleRates.length === 0) {
    return <ChartLoading show={!statisticDifficultyUncleRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticDifficultyUncleRates, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticDifficultyUncleRates: State.StatisticDifficultyUncleRate[]) => {
  return statisticDifficultyUncleRates
    ? statisticDifficultyUncleRates.map(data => [data.epochNumber, data.difficulty, data.uncleRate])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyUncleRates } = useAppState()

  useEffect(() => {
    getStatisticDifficultyUncleRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={`${i18n.t('block.difficulty')} & ${i18n.t('block.uncle_rate')}`}
      data={toCSV(statisticDifficultyUncleRates)}
    >
      <DifficultyUncleRateChart />
    </ChartPage>
  )
}
