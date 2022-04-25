import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticHashRate } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { handleHashRate } from '../../../utils/number'
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
  top: '5%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticHashRates: State.StatisticHashRate[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
            dataList[0].data[0]
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
            dataList[0].data[1],
          )}</div>`
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
      name: isMobile() || isThumbnail ? '' : i18n.t('block.hash_rate'),
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
      name: i18n.t('block.hash_rate'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
    },
  ],
  dataset: {
    source: statisticHashRates.map(data => [
      parseDateNoTime(data.createdAtUnixtimestamp),
      new BigNumber(data.avgHashRate).toNumber(),
    ]),
    dimensions: ['timestamp', 'value'],
  },
})

export const HashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticHashRates, statisticHashRatesFetchEnd, app } = useAppState()
  if (!statisticHashRatesFetchEnd || statisticHashRates.length === 0) {
    return <ChartLoading show={!statisticHashRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore option={getOption(statisticHashRates, app.chartColor, isThumbnail)} isThumbnail={isThumbnail} />
  )
}

const toCSV = (statisticHashRates: State.StatisticHashRate[]) =>
  statisticHashRates ? statisticHashRates.map(data => [data.createdAtUnixtimestamp, data.avgHashRate]) : []

export default () => {
  const dispatch = useDispatch()
  const { statisticHashRates } = useAppState()

  useEffect(() => {
    getStatisticHashRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('block.hash_rate')} data={toCSV(statisticHashRates)}>
      <HashRateChart />
    </ChartPage>
  )
}
