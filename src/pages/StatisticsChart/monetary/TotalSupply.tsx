import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../constants/common'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticTotalSupply } from '../../../service/app/charts/monetary'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'

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

const Colors = ['#049ECD', '#69C7D4', '#74808E']

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 80)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: [string, string, string, string] }): string => {
  if (seriesName === i18n.t('statistic.burnt')) {
    return `<div>${tooltipColor(Colors[2])}${widthSpan(i18n.t('statistic.burnt'))} ${handleAxis(data[3], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.locked')) {
    return `<div>${tooltipColor(Colors[1])}${widthSpan(i18n.t('statistic.locked'))} ${handleAxis(data[2], 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.circulating_supply')) {
    return `<div>${tooltipColor(Colors[0])}${widthSpan(i18n.t('statistic.circulating_supply'))} ${handleAxis(
      data[1],
      2,
    )}</div>`
  }
  return ''
}

const getOption = (
  statisticTotalSupplies: State.StatisticTotalSupply[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: Colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as Array<{ seriesName: string; data: [string, string, string, string]; name: string }>
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${list[0].data[0]}</div>`
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
      type: 'value',
      axisLine: {
        lineStyle: {
          color: ChartColors[0],
        },
      },
      axisLabel: {
        formatter: (value: string) => handleAxis(new BigNumber(value)),
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
        color: Colors[0],
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
        color: Colors[1],
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
        color: Colors[2],
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
})

export const TotalSupplyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticTotalSupplies, statisticTotalSuppliesFetchEnd } = useAppState()
  if (!statisticTotalSuppliesFetchEnd || statisticTotalSupplies.length === 0) {
    return <ChartLoading show={!statisticTotalSuppliesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticTotalSupplies, isThumbnail)} isThumbnail={isThumbnail} />
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

export default () => {
  const dispatch = useDispatch()
  const { statisticTotalSupplies } = useAppState()

  useEffect(() => {
    getStatisticTotalSupply(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.total_supply')}
      description={i18n.t('statistic.total_supply_description')}
      data={toCSV(statisticTotalSupplies)}
    >
      <TotalSupplyChart />
    </ChartPage>
  )
}
