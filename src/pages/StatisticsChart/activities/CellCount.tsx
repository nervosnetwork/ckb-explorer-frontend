import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 80)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
  if (seriesName === i18n.t('statistic.dead_cell')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.dead_cell'))} ${handleAxis(data[2], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.all_cells')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.all_cells'))} ${handleAxis(data[1], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.live_cell')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.live_cell'))} ${handleAxis(data[3], 2)}</div>`
  }
  return ''
}

const getOption = (
  statisticCellCounts: State.StatisticCellCount[],
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
    color: chartColor.colors,
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
              name: i18n.t('statistic.all_cells'),
            },
            {
              name: i18n.t('statistic.live_cell'),
            },
            {
              name: i18n.t('statistic.dead_cell'),
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
        name: i18n.t('statistic.all_cells'),
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
        name: i18n.t('statistic.dead_cell'),
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
        name: i18n.t('statistic.live_cell'),
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

const toCSV = (statisticCellCounts: State.StatisticCellCount[]) =>
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
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.CellCount}
      cacheMode="date"
    />
  )
}

export default CellCountChart
