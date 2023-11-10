import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { SupportedLng, useCurrentLanguage } from '../../../utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
  parseNumericAbbr,
} from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const widthSpan = (value: string, currentLanguage: SupportedLng) =>
  tooltipWidth(value, currentLanguage === 'en' ? 125 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === t('statistic.burnt')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.burnt'), currentLanguage)} ${parseNumericAbbr(
        data[3],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.locked')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.locked'), currentLanguage)} ${parseNumericAbbr(
        data[2],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.circulating_supply')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.circulating_supply'),
        currentLanguage,
      )} ${parseNumericAbbr(data[1], 2)}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticTotalSupplies: ChartItem.TotalSupply[],
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
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.totalSupplyColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)} ${
              dataList[0].data[0]
            }</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsStringArrayOf4(data)
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
              name: t('statistic.circulating_supply'),
            },
            {
              name: t('statistic.locked'),
            },
            {
              name: t('statistic.burnt'),
            },
          ],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
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
        type: 'value',
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => parseNumericAbbr(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: t('statistic.circulating_supply'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          color: chartColor.totalSupplyColors[0],
        },
        encode: {
          x: 'timestamp',
          y: 'circulating',
        },
      },
      {
        name: t('statistic.locked'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          color: chartColor.totalSupplyColors[1],
        },
        encode: {
          x: 'timestamp',
          y: 'locked',
        },
      },
      {
        name: t('statistic.burnt'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          color: chartColor.totalSupplyColors[2],
        },
        encode: {
          x: 'timestamp',
          y: 'burnt',
        },
      },
    ],
    dataset: {
      source: statisticTotalSupplies.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        new BigNumber(shannonToCkb(data.circulatingSupply)).toFixed(0),
        new BigNumber(shannonToCkb(data.lockedCapacity)).toFixed(0),
        new BigNumber(shannonToCkb(data.burnt)).toFixed(0),
      ]),
      dimensions: ['timestamp', 'circulating', 'locked', 'burnt'],
    },
  }
}

const toCSV = (statisticTotalSupplies: ChartItem.TotalSupply[]) =>
  statisticTotalSupplies
    ? statisticTotalSupplies.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.circulatingSupply, 8),
        shannonToCkbDecimal(data.lockedCapacity, 8),
        shannonToCkbDecimal(data.burnt, 8),
      ])
    : []

export const TotalSupplyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.total_supply')}
      description={t('statistic.total_supply_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticTotalSupply}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticTotalSupply"
    />
  )
}

export default TotalSupplyChart
