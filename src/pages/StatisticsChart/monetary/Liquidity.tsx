import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
  parseNumericAbbr,
} from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  statisticLiquidity: ChartItem.Liquidity[],
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string, language: string) => tooltipWidth(value, language === 'en' ? 140 : 120)

  const useTooltip = () => {
    return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
      if (seriesName === t('statistic.circulating_supply')) {
        return `<div>${tooltipColor(color)}${widthSpan(
          t('statistic.circulating_supply'),
          currentLanguage,
        )} ${parseNumericAbbr(data[3], 2)}</div>`
      }
      if (seriesName === t('statistic.dao_deposit')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.dao_deposit'), currentLanguage)} ${parseNumericAbbr(
          data[2],
          2,
        )}</div>`
      }
      if (seriesName === t('statistic.tradable')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.tradable'), currentLanguage)} ${parseNumericAbbr(
          data[1],
          2,
        )}</div>`
      }
      return ''
    }
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.liquidityColors,
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
              name: t('statistic.dao_deposit'),
            },
            {
              name: t('statistic.tradable'),
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
          formatter: (value: string) => parseNumericAbbr(value),
        },
      },
    ],
    series: [
      {
        name: t('statistic.tradable'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          origin: 'start',
        },
        encode: {
          x: 'timestamp',
          y: 'liquidity',
        },
      },
      {
        name: t('statistic.dao_deposit'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          origin: 'start',
        },
        encode: {
          x: 'timestamp',
          y: 'deposit',
        },
      },
      {
        name: t('statistic.circulating_supply'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'circulating',
        },
      },
    ],
    dataset: {
      source: statisticLiquidity.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        shannonToCkb(data.liquidity),
        shannonToCkb(data.daoDeposit),
        shannonToCkb(data.circulatingSupply),
      ]),
      dimensions: ['timestamp', 'liquidity', 'deposit', 'circulating'],
    },
  }
}

const toCSV = (statisticLiquidity: ChartItem.Liquidity[]) =>
  statisticLiquidity
    ? statisticLiquidity.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.circulatingSupply, 8),
        shannonToCkbDecimal(data.daoDeposit, 8),
        shannonToCkbDecimal(data.liquidity, 8),
      ])
    : []

export const LiquidityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.liquidity')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticLiquidity}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticLiquidity"
    />
  )
}

export default LiquidityChart
