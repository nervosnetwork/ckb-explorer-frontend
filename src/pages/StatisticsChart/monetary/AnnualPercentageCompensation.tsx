import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '../../../utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG, assertIsArray } from '../../../utils/chart'
import { ChartCachedKeys } from '../../../constants/cache'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  statisticAnnualPercentageCompensations: ChartItem.AnnualPercentageCompensation[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '2%',
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
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 220 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.year'))} ${dataList[0].data[0]}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.nominal_apc'))} ${
              dataList[0].data[1]
            }%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.year'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval: isMobile || isThumbnail ? 7 : 3,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: t('statistic.nominal_apc'),
        type: 'value',
        nameTextStyle: {
          align: 'left',
        },
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
        name: t('statistic.nominal_apc'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
      },
    ],
    dataset: {
      source: statisticAnnualPercentageCompensations.map(data => [data.year, (+data.apc).toFixed(2)]),
    },
  }
}

const toCSV = (statisticAnnualPercentageCompensations: ChartItem.AnnualPercentageCompensation[]) =>
  statisticAnnualPercentageCompensations
    ? statisticAnnualPercentageCompensations.map(data => [data.year, (Number(data.apc) / 100).toFixed(4)])
    : []

export const AnnualPercentageCompensationChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.nominal_apc')}
      description={t('statistic.nominal_rpc_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticAnnualPercentageCompensation}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.APC}
      cacheMode="forever"
    />
  )
}

export default AnnualPercentageCompensationChart
