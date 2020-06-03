import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
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
  right: '3%',
  top: isMobile() ? '3%' : '8%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 80 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.time'))} ${
              dataList[0].name
            }</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.block_count'))} ${
              dataList[0].data
            }%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.time'),
        nameLocation: 'middle',
        nameGap: 30,
        data: statisticBlockTimeDistributions.map(data => data.time),
        axisLabel: {
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
        yAxisIndex: 0,
        areaStyle: {
          color: '#85bae0',
        },
        barWidth: isMobile() || isThumbnail ? 10 : 20,
        data: statisticBlockTimeDistributions.map(data => (Number(data.ratio) * 100).toFixed(3)),
      },
    ],
  }
}

export const BlockTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticBlockTimeDistributions, statisticBlockTimeDistributionsFetchEnd } = useAppState()
  if (!statisticBlockTimeDistributionsFetchEnd || statisticBlockTimeDistributions.length === 0) {
    return <ChartLoading show={!statisticBlockTimeDistributionsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticBlockTimeDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[]) => {
  return statisticBlockTimeDistributions
    ? statisticBlockTimeDistributions.map(data => [data.time, Number(data.ratio).toFixed(4)])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticBlockTimeDistributions } = useAppState()

  useEffect(() => {
    getStatisticBlockTimeDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.block_time_distribution_more')}
      description={i18n.t('statistic.block_time_distribution_description')}
      data={toCSV(statisticBlockTimeDistributions)}
    >
      <BlockTimeDistributionChart />
    </ChartPage>
  )
}
