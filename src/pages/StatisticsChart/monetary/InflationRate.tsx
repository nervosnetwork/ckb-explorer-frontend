import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '../../../utils/i18n'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG, assertSerialsDataIsString, assertIsArray, assertSerialsItem } from '../../../utils/chart'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'

const useOption = (
  statisticInflationRates: State.StatisticInflationRate[],
  chartColor: State.ChartColor,
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 220 : 80)

  const useTooltip = () => {
    return ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
      if (seriesName === t('statistic.nominal_inflation_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.nominal_inflation_rate'))} ${data}%</div>`
      }
      if (seriesName === t('statistic.nominal_apc')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.nominal_apc'))} ${data}%</div>`
      }
      if (seriesName === t('statistic.real_inflation_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.real_inflation_rate'))} ${data}%</div>`
      }
      return ''
    }
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.year'))} ${dataList[0].name}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsString(data)
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [
            {
              name: t('statistic.real_inflation_rate'),
            },
            {
              name: t('statistic.nominal_apc'),
            },
            {
              name: t('statistic.nominal_inflation_rate'),
            },
          ],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.year'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticInflationRates.map(data => data.year),
        axisLabel: {
          interval: isMobile || isThumbnail ? 11 : 3,
          formatter: (value: string) => value,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        type: 'value',
        axisLine: {
          lineStyle: {
            color: chartColor.moreColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: t('statistic.nominal_inflation_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'dashed',
        },
        data: statisticInflationRates.map(data => Number(data.nominalInflationRate).toFixed(4)),
      },
      {
        name: t('statistic.nominal_apc'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'dashed',
        },
        data: statisticInflationRates.map(data => Number(data.nominalApc).toFixed(4)),
      },
      {
        name: t('statistic.real_inflation_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'solid',
          width: 3,
        },
        data: statisticInflationRates.map(data => Number(data.realInflationRate).toFixed(4)),
      },
    ],
  }
}

const fetchStatisticInflationRates = async () => {
  const {
    attributes: { nominalApc, nominalInflationRate, realInflationRate },
  } = await explorerService.api.fetchStatisticInflationRate()
  const statisticInflationRates = []
  for (let i = 0; i < nominalApc.length; i++) {
    if (i % 6 === 0 || i === nominalApc.length - 1) {
      statisticInflationRates.push({
        year: i % 6 === 0 ? Math.floor(i / 6) * 0.5 : 50,
        nominalApc: nominalApc[i],
        nominalInflationRate: nominalInflationRate[i],
        realInflationRate: realInflationRate[i],
      })
    }
  }
  return statisticInflationRates
}

const toCSV = (statisticInflationRates: State.StatisticInflationRate[]) =>
  statisticInflationRates
    ? statisticInflationRates.map(data => [
        data.year,
        Number(data.nominalApc).toFixed(4),
        Number(data.nominalInflationRate).toFixed(4),
        Number(data.realInflationRate).toFixed(4),
      ])
    : []

export const InflationRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.inflation_rate')}
      description={t('statistic.inflation_rate_description')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticInflationRates}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.InflationRate}
      cacheMode="forever"
    />
  )
}

export default InflationRateChart
