import { useEffect, useMemo } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'
import { getStatisticLiquidity } from '../../../service/app/charts/monetary'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'

const getOption = (
  statisticLiquidity: State.StatisticLiquidity[],
  chartColor: State.App['chartColor'],
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 140 : 120)

  const parseTooltip = ({
    seriesName,
    data,
    color,
  }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === i18n.t('statistic.circulating_supply')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.circulating_supply'))} ${handleAxis(
        data[3],
        2,
      )}</div>`
    }
    if (seriesName === i18n.t('statistic.dao_deposit')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.dao_deposit'))} ${handleAxis(data[2], 2)}</div>`
    }
    if (seriesName === i18n.t('statistic.tradable')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.tradable'))} ${handleAxis(data[1], 2)}</div>`
    }
    return ''
  }
  return {
    color: chartColor.liquidityColors,
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
              name: i18n.t('statistic.dao_deposit'),
            },
            {
              name: i18n.t('statistic.tradable'),
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
          formatter: (value: string) => handleAxis(value),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.tradable'),
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
        name: i18n.t('statistic.dao_deposit'),
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
        name: i18n.t('statistic.circulating_supply'),
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

export const LiquidityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticLiquidity, statisticLiquidityFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticLiquidity, app.chartColor, isMobile, isThumbnail),
    [statisticLiquidity, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticLiquidityFetchEnd || statisticLiquidity.length === 0) {
    return <ChartLoading show={!statisticLiquidityFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticLiquidity: State.StatisticLiquidity[]) =>
  statisticLiquidity
    ? statisticLiquidity.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.circulatingSupply, 8),
        shannonToCkbDecimal(data.daoDeposit, 8),
        shannonToCkbDecimal(data.liquidity, 8),
      ])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticLiquidity } = useAppState()

  useEffect(() => {
    getStatisticLiquidity(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.liquidity')} data={toCSV(statisticLiquidity)}>
      <LiquidityChart />
    </ChartPage>
  )
}
