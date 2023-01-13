import { useEffect, useMemo } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticNewNodeCount } from '../../../service/app/charts/network'

const getOption = (
  statisticNewNodeCounts: State.StatisticNewNodeCount[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '4%',
    right: '3%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 90)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(
              i18n.t('statistic.new_node_count'),
            )} ${localeNumberString(dataList[0].data)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
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
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.new_node_count'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
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
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticNewNodeCounts.map(data => data.nodesCount),
      },
    ],
  }
}

export const NewNodeCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticNewNodeCounts, statisticNewNodeCountsFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticNewNodeCounts, app.chartColor, isMobile, isThumbnail),
    [statisticNewNodeCounts, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticNewNodeCountsFetchEnd || statisticNewNodeCounts.length === 0) {
    return <ChartLoading show={!statisticNewNodeCountsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticNewNodeCounts: State.StatisticNewNodeCount[]) =>
  statisticNewNodeCounts ? statisticNewNodeCounts.map(data => [data.createdAtUnixtimestamp, data.nodesCount]) : []

export default () => {
  const dispatch = useDispatch()
  const { statisticNewNodeCounts } = useAppState()

  useEffect(() => {
    getStatisticNewNodeCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.new_node_count')} data={toCSV(statisticNewNodeCounts)}>
      <NewNodeCountChart />
    </ChartPage>
  )
}
