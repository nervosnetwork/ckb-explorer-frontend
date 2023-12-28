import { useTranslation } from 'react-i18next'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG, assertIsArray } from '../../../utils/chart'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  statisticUncleRates: ChartItem.UncleRate[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  const gridThumbnail = {
    left: '4%',
    right: '12%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: isMobile ? '12%' : '5%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 75 : 50)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${dataList[0].data[0]}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('block.uncle_rate'))} ${
              dataList[0].data[1]
            }%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    /* Selection starts from 1% because the uncle rate starts from 0 on launch */
    dataZoom: DATA_ZOOM_CONFIG.map(zoom => ({ ...zoom, show: !isThumbnail, start: 1 })),
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('block.uncle_rate'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: t('block.uncle_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        markLine: {
          symbol: 'none',
          data: [
            {
              name: t('block.uncle_rate_target'),
              yAxis: 2.5,
            },
          ],
          label: {
            formatter: (label: { data: { value: string } }) => `${label.data.value}%`,
          },
        },
      },
    ],
    dataset: {
      source: statisticUncleRates.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        (+data.uncleRate * 100).toFixed(2),
      ]),
    },
  }
}

const toCSV = (statisticUncleRates: ChartItem.UncleRate[]) =>
  statisticUncleRates ? statisticUncleRates.map(data => [data.createdAtUnixtimestamp, data.uncleRate]) : []

export const UncleRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('block.uncle_rate')}
      description={t('statistic.uncle_rate_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticUncleRate}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticUncleRate"
    />
  )
}

export default UncleRateChart
