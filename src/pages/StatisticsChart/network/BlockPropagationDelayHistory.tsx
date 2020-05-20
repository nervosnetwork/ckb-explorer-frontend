import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticBlockPropagationDelayHistory } from '../../../service/app/charts/network'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '3%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticBlockPropagationDelayHistories: State.StatisticBlockPropagationDelayHistory[],
  isThumbnail = false,
) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      axisPointer: {
        show: true,
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1,
        },
      },
      formatter: (params: any) => {
        let date = params.value.length > 1 ? params.value[0] : params.name
        let time = params.value.length > 1 ? params.value[1] : params.value
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '280px' : '90px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(date)}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(
          i18n.t('statistic.block_propagation_delay_history'),
        )} ${localeNumberString(time)}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        type: 'category',
        nameLocation: 'middle',
        nameGap: '30',
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.block_propagation_delay_history'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'left',
        },
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => value,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.block_propagation_delay_history'),
        type: 'scatter',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticBlockPropagationDelayHistories,
      },
      {
        type: 'line',
        yAxisIndex: '0',
        data: statisticBlockPropagationDelayHistories.filter((_data: any, index: number) => index % 18 === 1),
      },
      {
        type: 'line',
        yAxisIndex: '0',
        data: statisticBlockPropagationDelayHistories.filter((_data: any, index: number) => index % 18 === 9),
      },
      {
        type: 'line',
        yAxisIndex: '0',
        data: statisticBlockPropagationDelayHistories.filter((_data: any, index: number) => index % 18 === 17),
      },
    ],
  }
}

export const BlockPropagationDelayHistoryChart = ({
  statisticBlockPropagationDelayHistories,
  isThumbnail = false,
}: {
  statisticBlockPropagationDelayHistories: State.StatisticBlockPropagationDelayHistory[]
  isThumbnail?: boolean
}) => {
  if (!statisticBlockPropagationDelayHistories || statisticBlockPropagationDelayHistories.length === 0) {
    return <ChartLoading show={statisticBlockPropagationDelayHistories === undefined} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticBlockPropagationDelayHistories, isThumbnail)}
      isThumbnail={isThumbnail}
    />
  )
}

export const initStatisticBlockPropagationDelayHistory = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticBlockPropagationDelayHistory,
    payload: {
      statisticBlockPropagationDelayHistories: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticBlockPropagationDelayHistories } = useAppState()

  useEffect(() => {
    initStatisticBlockPropagationDelayHistory(dispatch)
    getStatisticBlockPropagationDelayHistory(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.block_propagation_delay_history')}>
      <BlockPropagationDelayHistoryChart
        statisticBlockPropagationDelayHistories={statisticBlockPropagationDelayHistories}
      />
    </ChartPage>
  )
}
