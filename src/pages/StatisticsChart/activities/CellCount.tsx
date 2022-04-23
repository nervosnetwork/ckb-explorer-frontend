import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticCellCount } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ReactChartCore, ChartLoading, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'

const gridThumbnail = {
  left: '4%',
  right: '4%',
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

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 80)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: [string, string, string] }): string => {
  if (seriesName === i18n.t('statistic.live_cell')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.live_cell'))} ${handleAxis(data[1], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.all_cells')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.all_cells'))} ${handleAxis(data[2], 2)}</div>`
  }
  return ''
}

const getOption = (
  statisticCellCounts: State.StatisticCellCount[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as Array<SeriesItem & { data: [string, string, string] }>
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${list[0].data[0]}</div>`
          list.forEach(data => {
            result += parseTooltip(data)
          })
          return result
        },
      }
    : undefined,
  legend: !isThumbnail
    ? {
        data: [
          {
            name: i18n.t('statistic.live_cell'),
          },
          {
            name: i18n.t('statistic.all_cells'),
          },
        ],
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
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.live_cell'),
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
    {
      position: 'right',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.all_cells'),
      type: 'value',
      scale: true,
      axisLine: {
        lineStyle: {
          color: chartColor.colors[1],
        },
      },
      axisLabel: {
        formatter: (value: string) => handleAxis(new BigNumber(value)),
      },
    },
  ],
  series: [
    {
      name: i18n.t('statistic.live_cell'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      encode: {
        x: 'timestamp',
        y: 'live',
      },
    },
    {
      name: i18n.t('statistic.all_cells'),
      type: 'line',
      yAxisIndex: 1,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      encode: {
        x: 'timestamp',
        y: 'all',
      },
    },
  ],
  dataset: {
    source: statisticCellCounts.map(data => [
      parseDateNoTime(data.createdAtUnixtimestamp),
      new BigNumber(data.liveCellsCount).toNumber(),
      new BigNumber(data.allCellsCount).toNumber(),
    ]),
    dimensions: ['timestamp', 'live', 'all'],
  },
})

export const CellCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticCellCounts, statisticCellCountsFetchEnd, app } = useAppState()
  if (!statisticCellCountsFetchEnd || statisticCellCounts.length === 0) {
    return <ChartLoading show={!statisticCellCountsFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore option={getOption(statisticCellCounts, app.chartColor, isThumbnail)} isThumbnail={isThumbnail} />
  )
}

const toCSV = (statisticCellCounts: State.StatisticCellCount[]) =>
  statisticCellCounts
    ? statisticCellCounts.map(data => [data.createdAtUnixtimestamp, data.liveCellsCount, data.allCellsCount])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticCellCounts } = useAppState()

  useEffect(() => {
    getStatisticCellCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.cell_count')} data={toCSV(statisticCellCounts)}>
      <CellCountChart />
    </ChartPage>
  )
}
