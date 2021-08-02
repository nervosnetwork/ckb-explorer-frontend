import { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime, parseSimpleDateNoSecond } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../constants/common'
import { ReactChartCore, ChartLoading, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticAverageBlockTimes } from '../../../service/app/charts/block'
import { localeNumberString } from '../../../utils/number'

const gridThumbnail = {
  left: '3%',
  right: '3%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '2%',
  right: '3%',
  top: '8%',
  bottom: '5%',
  containLabel: true,
}

const maxAndMinAxis = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  const array = statisticAverageBlockTimes.flatMap(data => parseFloat(data.avgBlockTimeDaily))
  return {
    max: Math.ceil(Math.max(...array) / 1000),
    min: Math.floor(Math.min(...array) / 1000),
  }
}

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 180 : 100)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: string }): string => {
  if (seriesName === i18n.t('statistic.daily_moving_average')) {
    return `<div>${tooltipColor(ChartColors[0])}${widthSpan(
      i18n.t('statistic.daily_moving_average'),
    )} ${localeNumberString(data)}</div>`
  }
  if (seriesName === i18n.t('statistic.weekly_moving_average')) {
    return `<div>${tooltipColor(ChartColors[1])}${widthSpan(
      i18n.t('statistic.weekly_moving_average'),
    )} ${localeNumberString(data)}</div>`
  }
  return ''
}

const getOption = (
  statisticAverageBlockTimes: State.StatisticAverageBlockTime[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: ChartColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as Array<{ seriesName: string; data: string; name: string }>
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseSimpleDateNoSecond(
            list[0].name,
            '/',
            false,
          )}</div>`
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
            name: i18n.t('statistic.daily_moving_average'),
          },
          {
            name: i18n.t('statistic.weekly_moving_average'),
          },
        ],
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
      data: statisticAverageBlockTimes.map(data => data.timestamp),
      axisLabel: {
        formatter: (value: string) => parseDateNoTime(value),
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.daily_moving_average'),
      type: 'value',
      scale: true,
      nameTextStyle: {
        align: 'left',
      },
      max: () => maxAndMinAxis(statisticAverageBlockTimes).max,
      min: () => maxAndMinAxis(statisticAverageBlockTimes).min,
      axisLine: {
        lineStyle: {
          color: ChartColors[0],
        },
      },
      axisLabel: {
        formatter: (value: string) => localeNumberString(value),
      },
    },
    {
      position: 'right',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.weekly_moving_average'),
      type: 'value',
      scale: true,
      nameTextStyle: {
        align: 'right',
      },
      max: () => maxAndMinAxis(statisticAverageBlockTimes).max,
      min: () => maxAndMinAxis(statisticAverageBlockTimes).min,
      axisLine: {
        lineStyle: {
          color: ChartColors[1],
        },
      },
      axisLabel: {
        formatter: (value: string) => localeNumberString(value),
      },
    },
  ],
  series: [
    {
      name: i18n.t('statistic.daily_moving_average'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticAverageBlockTimes.map(data => (Number(data.avgBlockTimeDaily) / 1000).toFixed(2)),
    },
    {
      name: i18n.t('statistic.weekly_moving_average'),
      type: 'line',
      yAxisIndex: 1,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticAverageBlockTimes.map(data => (Number(data.avgBlockTimeWeekly) / 1000).toFixed(2)),
    },
  ],
})

export const AverageBlockTimeChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticAverageBlockTimes, statisticAverageBlockTimesFetchEnd } = useAppState()
  if (!statisticAverageBlockTimesFetchEnd || statisticAverageBlockTimes.length === 0) {
    return <ChartLoading show={!statisticAverageBlockTimesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticAverageBlockTimes, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) =>
  statisticAverageBlockTimes
    ? statisticAverageBlockTimes.map(data => [data.timestamp, data.avgBlockTimeDaily, data.avgBlockTimeWeekly])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticAverageBlockTimes } = useAppState()

  useEffect(() => {
    getStatisticAverageBlockTimes(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.average_block_time')}
      description={i18n.t('statistic.average_block_time_description')}
      data={toCSV(statisticAverageBlockTimes)}
    >
      <AverageBlockTimeChart />
    </ChartPage>
  )
}
