import { useEffect, useMemo } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime, parseSimpleDate, parseSimpleDateNoSecond } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { ReactChartCore, ChartLoading, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'
import { getStatisticAverageBlockTimes } from '../../../service/app/charts/block'
import { localeNumberString } from '../../../utils/number'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'

const getOption = (
  statisticAverageBlockTimes: State.StatisticAverageBlockTime[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
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

  const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
    if (seriesName === i18n.t('statistic.daily_moving_average')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.daily_moving_average'))} ${localeNumberString(
        data[1],
      )}</div>`
    }
    if (seriesName === i18n.t('statistic.weekly_moving_average')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.weekly_moving_average'))} ${localeNumberString(
        data[2],
      )}</div>`
    }
    return ''
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const list = dataList as Array<SeriesItem & { data: string }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              i18n.t('statistic.date'),
            )} ${parseSimpleDateNoSecond(new Date(list[0].data[0]), '/', false)}</div>`
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
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category', // TODO: use type: time
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(new Date(value)),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.daily_moving_average'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'left',
        },
        max: () => maxAndMinAxis(statisticAverageBlockTimes).max,
        min: () => maxAndMinAxis(statisticAverageBlockTimes).min,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => localeNumberString(value),
        },
      },
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.weekly_moving_average'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'right',
        },
        max: () => maxAndMinAxis(statisticAverageBlockTimes).max,
        min: () => maxAndMinAxis(statisticAverageBlockTimes).min,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[1],
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
        encode: {
          x: 'timestamp',
          y: 'daily',
        },
      },
      {
        name: i18n.t('statistic.weekly_moving_average'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'weekly',
        },
      },
    ],
    dataset: {
      source: statisticAverageBlockTimes.map(data => [
        parseSimpleDate(data.timestamp * 1000),
        (Number(data.avgBlockTimeDaily) / 1000).toFixed(2),
        (Number(data.avgBlockTimeWeekly) / 1000).toFixed(2),
      ]),
      dimensions: ['timestamp', 'daily', 'weekly'],
    },
  }
}

export const AverageBlockTimeChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticAverageBlockTimes, statisticAverageBlockTimesFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticAverageBlockTimes, app.chartColor, isMobile, isThumbnail),
    [statisticAverageBlockTimes, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticAverageBlockTimesFetchEnd || statisticAverageBlockTimes.length === 0) {
    return <ChartLoading show={!statisticAverageBlockTimesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
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
