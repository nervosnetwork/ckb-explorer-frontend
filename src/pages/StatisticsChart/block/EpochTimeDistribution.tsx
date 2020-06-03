import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticEpochTimeDistribution } from '../../../service/app/charts/block'
import { localeNumberString } from '../../../utils/number'
import { parseHour } from '../../../utils/date'

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
  statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 80 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.time_hour'))} ${parseHour(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
              i18n.t('statistic.epochs'),
            )} ${localeNumberString(dataList[0].data)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.time_hour'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: statisticEpochTimeDistributions.map(data => data.time),
        axisLabel: {
          formatter: (value: string) => parseHour(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.epochs'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => localeNumberString(value),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.epochs'),
        type: 'bar',
        yAxisIndex: 0,
        areaStyle: {
          color: '#85bae0',
        },
        barWidth: isMobile() || isThumbnail ? 2 : 5,
        data: statisticEpochTimeDistributions.map(data => data.epoch),
      },
    ],
  }
}

export const EpochTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticEpochTimeDistributions, statisticEpochTimeDistributionsFetchEnd } = useAppState()
  if (!statisticEpochTimeDistributionsFetchEnd || statisticEpochTimeDistributions.length === 0) {
    return <ChartLoading show={!statisticEpochTimeDistributionsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticEpochTimeDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[]) => {
  return statisticEpochTimeDistributions
    ? statisticEpochTimeDistributions.map(data => [parseHour(data.time), data.epoch])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticEpochTimeDistributions } = useAppState()

  useEffect(() => {
    getStatisticEpochTimeDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.epoch_time_distribution_more')}
      description={i18n.t('statistic.epoch_time_distribution_description')}
      data={toCSV(statisticEpochTimeDistributions)}
    >
      <EpochTimeDistributionChart />
    </ChartPage>
  )
}
