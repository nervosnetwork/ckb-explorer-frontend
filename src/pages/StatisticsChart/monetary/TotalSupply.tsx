import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, parseNumericAbbr } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 80)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
  if (seriesName === i18n.t('statistic.burnt')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.burnt'))} ${parseNumericAbbr(data[3], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.locked')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.locked'))} ${parseNumericAbbr(data[2], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.circulating_supply')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.circulating_supply'))} ${parseNumericAbbr(
      data[1],
      2,
    )}</div>`
  }
  return ''
}

const getOption = (
  statisticTotalSupplies: State.StatisticTotalSupply[],
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
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.totalSupplyColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const list = dataList as Array<SeriesItem & { data: [string, string, string, string] }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              list[0].data[0]
            }</div>`
            list.forEach(data => {
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
              name: i18n.t('statistic.circulating_supply'),
            },
            {
              name: i18n.t('statistic.locked'),
            },
            {
              name: i18n.t('statistic.burnt'),
            },
          ],
    },
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
        name: i18n.t('statistic.circulating_supply'),
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
        name: i18n.t('statistic.locked'),
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
        name: i18n.t('statistic.burnt'),
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

const toCSV = (statisticTotalSupplies: State.StatisticTotalSupply[]) =>
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
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.TotalSupply}
      cacheMode="date"
    />
  )
}

export default TotalSupplyChart
