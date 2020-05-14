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
import { getStatisticNewNodeCount } from '../../../service/app/charts/network'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '4%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticNewNodeCounts: State.StatisticNewNodeCount[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '125px' : '90px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(
          i18n.t('statistic.new_node_count'),
        )} ${localeNumberString(dataList[0].data)}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticNewNodeCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.new_node_count'),
        type: 'value',
        scale: true,
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
        name: i18n.t('statistic.new_node_count'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticNewNodeCounts.map(data => data.nodesCount),
      },
    ],
  }
}

export const NewNodeCountChart = ({
  statisticNewNodeCounts,
  isThumbnail = false,
}: {
  statisticNewNodeCounts: State.StatisticNewNodeCount[]
  isThumbnail?: boolean
}) => {
  if (!statisticNewNodeCounts || statisticNewNodeCounts.length === 0) {
    return <ChartLoading show={statisticNewNodeCounts === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticNewNodeCounts, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticNewNodeCount = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticNewNodeCount,
    payload: {
      statisticNewNodeCounts: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticNewNodeCounts } = useAppState()

  useEffect(() => {
    initStatisticNewNodeCount(dispatch)
    getStatisticNewNodeCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.new_node_count')}>
      <NewNodeCountChart statisticNewNodeCounts={statisticNewNodeCounts} />
    </ChartPage>
  )
}
