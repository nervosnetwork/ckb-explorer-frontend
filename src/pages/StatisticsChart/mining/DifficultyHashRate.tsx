import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficultyHashRate } from '../../../service/app/charts/mining'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { handleDifficulty, handleHashRate } from '../../../utils/number'
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
const grid = () => {
  return {
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
}

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 70 : 50)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: string }): string => {
  if (seriesName === i18n.t('block.difficulty')) {
    return `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
      data,
    )}</div>`
  }
  if (seriesName.startsWith(i18n.t('block.hash_rate'))) {
    return `<div>${tooltipColor(ChartColors[1])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(data)}</div>`
  }
  return ''
}

const getOption = (
  statisticDifficultyHashRates: State.StatisticDifficultyHashRate[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any): string => {
            const list = dataList as Array<{ seriesName: string; data: string; name: string }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('block.epoch'))} ${list[0].name}</div>`
            list.forEach(data => {
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          data: [
            {
              name: i18n.t('block.difficulty'),
            },
            {
              name: i18n.t('block.hash_rate_hps'),
            },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid(),
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('block.epoch'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticDifficultyHashRates.map(data => data.epochNumber),
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
        name: isMobile() || isThumbnail ? '' : i18n.t('block.hash_rate_hps'),
        type: 'value',
        splitLine: {
          show: false,
        },
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
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
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.hash_rate_hps'),
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.hashRate).toNumber()),
      },
    ],
  }
}

export const DifficultyHashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticDifficultyHashRates, statisticDifficultyHashRatesFetchEnd } = useAppState()
  if (!statisticDifficultyHashRatesFetchEnd || statisticDifficultyHashRates.length === 0) {
    return <ChartLoading show={!statisticDifficultyHashRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticDifficultyHashRates, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticDifficultyHashRates: State.StatisticDifficultyHashRate[]) => {
  return statisticDifficultyHashRates
    ? statisticDifficultyHashRates.map(data => [data.epochNumber, data.difficulty, data.hashRate])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyHashRates } = useAppState()

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={`${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`}
      data={toCSV(statisticDifficultyHashRates)}
    >
      <DifficultyHashRateChart />
    </ChartPage>
  )
}
