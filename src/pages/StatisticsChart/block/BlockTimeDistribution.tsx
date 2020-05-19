import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticBlockTimeDistribution } from '../../../service/app/charts/block'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '5%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '80px' : '80px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.time'))} ${dataList[0].name}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.block_count'))} ${
          dataList[0].data
        }%</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.time'),
        nameLocation: 'middle',
        nameGap: '30',
        data: statisticBlockTimeDistributions.map(data => data.time),
        axisLabel: {
          min: 0,
          max: 50,
          interval: 49,
          formatter: (value: string) => Number(value).toFixed(0),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.block_count'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.block_count'),
        type: 'line',
        yAxisIndex: '0',
        areaStyle: {
          color: '#85bae0',
        },
        barWidth: isMobile() || isThumbnail ? 10 : 20,
        data: statisticBlockTimeDistributions.map(data => data.ratio),
      },
    ],
  }
}

export const BlockTimeDistributionChart = ({
  statisticBlockTimeDistributions,
  isThumbnail = false,
}: {
  statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[]
  isThumbnail?: boolean
}) => {
  if (!statisticBlockTimeDistributions || statisticBlockTimeDistributions.length === 0) {
    return <ChartLoading show={statisticBlockTimeDistributions === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticBlockTimeDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticBlockTimeDistribution = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticBlockTimeDistribution,
    payload: {
      statisticBlockTimeDistributions: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticBlockTimeDistributions } = useAppState()

  useEffect(() => {
    initStatisticBlockTimeDistribution(dispatch)
    getStatisticBlockTimeDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.block_time_distribution_more')}>
      <BlockTimeDistributionChart statisticBlockTimeDistributions={statisticBlockTimeDistributions} />
    </ChartPage>
  )
}
