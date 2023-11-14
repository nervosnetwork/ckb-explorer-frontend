import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { SupportedLng, useCurrentLanguage } from '../../../utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
  handleAxis,
} from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const widthSpan = (value: string, currentLanguage: SupportedLng) =>
  tooltipWidth(value, currentLanguage === 'en' ? 125 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === t('statistic.dead_cell')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.dead_cell'), currentLanguage)} ${handleAxis(
        data[2],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.all_cells')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.all_cells'), currentLanguage)} ${handleAxis(
        data[1],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.live_cell')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.live_cell'), currentLanguage)} ${handleAxis(
        data[3],
        2,
      )}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticCellCounts: ChartItem.CellCount[],
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
    color: chartColor.colors,
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
              name: t('statistic.all_cells'),
            },
            {
              name: t('statistic.live_cell'),
            },
            {
              name: t('statistic.dead_cell'),
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
        name: t('statistic.all_cells'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: chartColor.colors[0],
        },
        lineStyle: {
          width: 4,
        },
      },
      {
        name: t('statistic.dead_cell'),
        type: 'line',
        stack: 'sum',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: chartColor.colors[1],
        },
      },
      {
        name: t('statistic.live_cell'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: chartColor.colors[2],
        },
      },
    ],
    dataset: {
      source: statisticCellCounts.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        new BigNumber(data.allCellsCount).toFixed(0),
        new BigNumber(data.deadCellsCount).toFixed(0),
        new BigNumber(data.liveCellsCount).toFixed(0),
      ]),
      dimensions: ['timestamp', 'all', 'live', 'dead'],
    },
  }
}

const toCSV = (statisticCellCounts: ChartItem.CellCount[]) =>
  statisticCellCounts
    ? statisticCellCounts.map(data => [
        data.createdAtUnixtimestamp,
        data.allCellsCount,
        data.liveCellsCount,
        data.deadCellsCount,
      ])
    : []

export const CellCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.cell_count')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticCellCount}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticCellCount"
    />
  )
}

export default CellCountChart
