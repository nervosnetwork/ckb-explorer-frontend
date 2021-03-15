import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticLiquidity } from '../../../service/app/charts/monetary'
import { handleAxis } from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'

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

const Colors = [ChartColors[0], '#74808E', '#69C7D4']

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 140 : 120)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: string }): string => {
  if (seriesName === i18n.t('statistic.circulating_supply')) {
    return `<div>${tooltipColor(Colors[2])}${widthSpan(i18n.t('statistic.circulating_supply'))} ${handleAxis(
      data,
      2,
    )}</div>`
  }
  if (seriesName === i18n.t('statistic.dao_deposit')) {
    return `<div>${tooltipColor(Colors[1])}${widthSpan(i18n.t('statistic.dao_deposit'))} ${handleAxis(data, 2)}</div>`
  }
  if (seriesName === i18n.t('statistic.tradable')) {
    return `<div>${tooltipColor(Colors[0])}${widthSpan(i18n.t('statistic.tradable'))} ${handleAxis(data, 2)}</div>`
  }
  return ''
}

const getOption = (statisticLiquidity: State.StatisticLiquidity[], isThumbnail = false): echarts.EChartOption => {
  return {
    color: Colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const list = dataList as Array<{ seriesName: string; data: string; name: string }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              list[0].name,
            )}</div>`
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
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticLiquidity.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
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
        data: statisticLiquidity.map(data => shannonToCkb(data.liquidity)),
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
        data: statisticLiquidity.map(data => shannonToCkb(data.daoDeposit)),
      },
      {
        name: i18n.t('statistic.circulating_supply'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticLiquidity.map(data => shannonToCkb(data.circulatingSupply)),
      },
    ],
  }
}

export const LiquidityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticLiquidity, statisticLiquidityFetchEnd } = useAppState()
  if (!statisticLiquidityFetchEnd || statisticLiquidity.length === 0) {
    return <ChartLoading show={!statisticLiquidityFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticLiquidity, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticLiquidity: State.StatisticLiquidity[]) => {
  return statisticLiquidity
    ? statisticLiquidity.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.circulatingSupply, 8),
        shannonToCkbDecimal(data.daoDeposit, 8),
        shannonToCkbDecimal(data.liquidity, 8),
      ])
    : []
}

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
