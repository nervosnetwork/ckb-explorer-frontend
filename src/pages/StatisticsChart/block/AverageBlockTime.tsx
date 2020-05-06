import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime, parseSimpleDateNoSecond } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ReactChartCore, ChartLoading, ChartPage } from '../common/ChartComp'
import { PageActions, AppDispatch } from '../../../contexts/providers/reducer'
import { getStatisticAverageBlockTimes } from '../../../service/app/charts/block'

const gridThumbnail = {
  left: '4%',
  right: '4%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '185px' : '80px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseSimpleDateNoSecond(
          dataList[0].name,
          '/',
          false,
        )}</div>`
        if (dataList[0]) {
          result += `<div>${colorSpan(ChartColors[0])}${widthSpan(
            i18n.t('statistic.daily_moving_average'),
          )} ${handleAxis(dataList[0].data, 2)}</div>`
        }
        if (dataList[1]) {
          result += `<div>${colorSpan(ChartColors[1])}${widthSpan(
            i18n.t('statistic.weekly_moving_average'),
          )} ${handleAxis(dataList[1].data, 2)}</div>`
        }
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('statistic.daily_moving_average'), i18n.t('statistic.weekly_moving_average')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
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
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.weekly_moving_average'),
        type: 'value',
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
        name: i18n.t('statistic.daily_moving_average'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAverageBlockTimes.map(data => new BigNumber(data.avgBlockTimeDaily).toNumber()),
      },
      {
        name: i18n.t('statistic.weekly_moving_average'),
        type: 'line',
        yAxisIndex: '1',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAverageBlockTimes.map(data => new BigNumber(data.avgBlockTimeWeekly).toNumber()),
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
