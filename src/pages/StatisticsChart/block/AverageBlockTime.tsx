import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime, parseSimpleDateNoSecond } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ReactChartCore, ChartLoading, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
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
  right: '2%',
  bottom: '5%',
  containLabel: true,
}

const maxAndMinAxis = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  const array = statisticAverageBlockTimes.flatMap(data => parseFloat(data.avgBlockTimeDaily))
  return { max: Math.ceil(Math.max(...array) / 1000), min: Math.floor(Math.min(...array) / 1000) }
}

const getOption = (
  statisticAverageBlockTimes: State.StatisticAverageBlockTime[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 180 : 100)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              i18n.t('statistic.date'),
            )} ${parseSimpleDateNoSecond(dataList[0].name, '/', false)}</div>`
            if (dataList[0]) {
              result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
                i18n.t('statistic.daily_moving_average'),
              )} ${localeNumberString(dataList[0].data)}</div>`
            }
            if (dataList[1]) {
              result += `<div>${tooltipColor(ChartColors[1])}${widthSpan(
                i18n.t('statistic.weekly_moving_average'),
              )} ${localeNumberString(dataList[1].data)}</div>`
            }
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          data: [
            { name: i18n.t('statistic.daily_moving_average') },
            { name: i18n.t('statistic.weekly_moving_average') },
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
  }
}

export const initStatisticAverageBlockTimes = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticAverageBlockTime,
    payload: {
      statisticAverageBlockTimes: undefined,
    },
  })
}

export const AverageBlockTimeChart = ({
  statisticAverageBlockTimes,
  isThumbnail = false,
}: {
  statisticAverageBlockTimes: State.StatisticAverageBlockTime[]
  isThumbnail?: boolean
}) => {
  if (!statisticAverageBlockTimes || statisticAverageBlockTimes.length === 0) {
    return <ChartLoading show={statisticAverageBlockTimes === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticAverageBlockTimes, isThumbnail)} isThumbnail={isThumbnail} />
}

export default () => {
  const dispatch = useDispatch()
  const { statisticAverageBlockTimes } = useAppState()

  useEffect(() => {
    initStatisticAverageBlockTimes(dispatch)
    getStatisticAverageBlockTimes(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.average_block_time')}>
      <AverageBlockTimeChart statisticAverageBlockTimes={statisticAverageBlockTimes} />
    </ChartPage>
  )
}
