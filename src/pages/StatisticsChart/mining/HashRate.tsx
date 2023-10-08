import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { handleHashRate } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { explorerService } from '../../../services/ExplorerService'
import { ChartCachedKeys } from '../../../constants/cache'

const getOption = (
  statisticHashRates: State.StatisticHashRate[],
  chartColor: State.ChartColor,
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
    left: '3%',
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
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              dataList[0].data[0]
            }</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(
              i18n.t('block.hash_rate'),
            )} ${handleHashRate(dataList[0].data[1])}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : i18n.t('block.hash_rate'),
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
  }
}

const toCSV = (statisticHashRates: State.StatisticHashRate[]) =>
  statisticHashRates ? statisticHashRates.map(data => [data.createdAtUnixtimestamp, data.avgHashRate]) : []

export const HashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('block.hash_rate')}
      description={t('glossary.hash_rate')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticHashRate}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.HashRate}
      cacheMode="date"
    />
  )
}

export default HashRateChart
