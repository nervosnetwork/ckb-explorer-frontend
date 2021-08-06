import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficultyUncleRateEpoch } from '../../../service/app/charts/mining'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { handleDifficulty } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { ChartMoreColors } from '../../../constants/common'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { parseHourFromMillisecond } from '../../../utils/date'

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

const max = (statisticChartData: State.StatisticDifficultyUncleRateEpoch[]) => {
  const array = statisticChartData.flatMap(data => Number(data.uncleRate) * 100)
  return Math.max(5, Math.ceil(Math.max(...array)))
}

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 90 : 80)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: string }) => {
  if (seriesName === i18n.t('block.difficulty')) {
    return `<div>${tooltipColor(ChartMoreColors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
      data,
    )}</div>`
  }
  if (seriesName === i18n.t('block.uncle_rate')) {
    return `<div>${tooltipColor(ChartMoreColors[1])}${widthSpan(i18n.t('block.uncle_rate'))} ${data}%</div>`
  }
  if (seriesName === i18n.t('block.epoch_time')) {
    return `<div>${tooltipColor(ChartMoreColors[2])}${widthSpan(i18n.t('block.epoch_time'))} ${data} h</div>`
  }
  if (seriesName === i18n.t('block.epoch_length')) {
    return `<div>${tooltipColor(ChartMoreColors[3])}${widthSpan(i18n.t('block.epoch_length'))} ${data}</div>`
  }
  return ''
}

const getOption = (statisticChartData: State.StatisticDifficultyUncleRateEpoch[], isThumbnail = false) => ({
  color: ChartMoreColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
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
            name: i18n.t('block.uncle_rate'),
          },
          {
            name: i18n.t('block.epoch_time'),
          },
          {
            name: i18n.t('block.epoch_length'),
          },
        ],
        textStyle: {
          fontSize: isMobile() ? 11 : 14,
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('block.epoch'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: true,
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
          color: ChartMoreColors[0],
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
          color: ChartMoreColors[1],
        },
      },
      axisLabel: {
        formatter: (value: string) => `${value}%`,
      },
    },
    {
      position: 'left',
      scale: true,
      axisLine: {
        lineStyle: {
          color: ChartMoreColors[0],
        },
      },
      axisLabel: {
        formatter: () => '',
      },
    },
    {
      position: 'right',
      scale: true,
      axisLine: {
        lineStyle: {
          color: ChartMoreColors[1],
        },
      },
      axisLabel: {
        formatter: () => '',
      },
    },
  ],
  series: [
    {
      name: i18n.t('block.difficulty'),
      type: 'bar',
      step: 'start',
      areaStyle: {
        color: '#85bae0',
      },
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 5,
      data: statisticChartData.map(data => new BigNumber(data.difficulty).toNumber()),
    },
    {
      name: i18n.t('block.uncle_rate'),
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 5,
      data: statisticChartData.map(data => (Number(data.uncleRate) * 100).toFixed(2)),
      markLine: isThumbnail
        ? undefined
        : {
            symbol: 'none',
            lineStyle: {
              color: ChartMoreColors[1],
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
    {
      name: i18n.t('block.epoch_time'),
      type: 'bar',
      step: 'start',
      areaStyle: {
        color: ChartMoreColors[2],
      },
      yAxisIndex: 2,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 5,
      data: statisticChartData.map(data => parseHourFromMillisecond(data.epochTime)),
    },
    {
      name: i18n.t('block.epoch_length'),
      type: 'bar',
      step: 'start',
      areaStyle: {
        color: ChartMoreColors[3],
      },
      yAxisIndex: 3,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 5,
      data: statisticChartData.map(data => data.epochLength),
    },
  ],
})

export const DifficultyUncleRateEpochChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticDifficultyUncleRateEpochs, statisticDifficultyUncleRatesFetchEnd } = useAppState()
  if (!statisticDifficultyUncleRatesFetchEnd || statisticDifficultyUncleRateEpochs.length === 0) {
    return <ChartLoading show={!statisticDifficultyUncleRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore option={getOption(statisticDifficultyUncleRateEpochs, isThumbnail)} isThumbnail={isThumbnail} />
  )
}

const toCSV = (statisticDifficultyUncleRateEpochs: State.StatisticDifficultyUncleRateEpoch[]) =>
  statisticDifficultyUncleRateEpochs
    ? statisticDifficultyUncleRateEpochs.map(data => [
        data.epochNumber,
        data.difficulty,
        data.uncleRate,
        data.epochTime,
        data.epochLength,
      ])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyUncleRateEpochs } = useAppState()

  useEffect(() => {
    getStatisticDifficultyUncleRateEpoch(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={`${i18n.t('block.difficulty')} & ${i18n.t('block.uncle_rate')} & ${i18n.t('block.epoch_time')} & ${i18n.t(
        'block.epoch_length',
      )}`}
      data={toCSV(statisticDifficultyUncleRateEpochs)}
    >
      <DifficultyUncleRateEpochChart />
    </ChartPage>
  )
}
