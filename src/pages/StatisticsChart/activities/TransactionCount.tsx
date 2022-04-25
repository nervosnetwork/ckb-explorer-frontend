import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticTransactionCount } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'

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
  top: isMobile() ? '3%' : '8%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticTransactionCounts: State.StatisticTransactionCount[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 120 : 65)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
            dataList[0].data[0]
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(
            i18n.t('statistic.transaction_count'),
          )} ${handleAxis(dataList[0].data[1])}</div>`
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.transaction_count'),
      type: 'value',
      scale: true,
      axisLine: {
        lineStyle: {
          color: chartColor.colors[0],
        },
      },
      axisLabel: {
        formatter: (value: string) => handleAxis(new BigNumber(value)),
      },
    },
  ],
  series: [
    {
      name: i18n.t('statistic.transaction_count'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
    },
  ],
  dataset: {
    source: statisticTransactionCounts.map(data => [
      parseDateNoTime(data.createdAtUnixtimestamp),
      new BigNumber(data.transactionsCount).toNumber(),
    ]),
  },
})

export const TransactionCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticTransactionCounts, statisticTransactionCountsFetchEnd, app } = useAppState()
  if (!statisticTransactionCountsFetchEnd || statisticTransactionCounts.length === 0) {
    return <ChartLoading show={!statisticTransactionCountsFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticTransactionCounts, app.chartColor, isThumbnail)}
      isThumbnail={isThumbnail}
    />
  )
}

const toCSV = (statisticTransactionCounts: State.StatisticTransactionCount[]) =>
  statisticTransactionCounts
    ? statisticTransactionCounts.map(data => [data.createdAtUnixtimestamp, data.transactionsCount])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticTransactionCounts } = useAppState()

  useEffect(() => {
    getStatisticTransactionCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.transaction_count')} data={toCSV(statisticTransactionCounts)}>
      <TransactionCountChart />
    </ChartPage>
  )
}
