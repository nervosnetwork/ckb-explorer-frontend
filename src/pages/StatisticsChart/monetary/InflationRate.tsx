import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticInflationRate } from '../../../service/app/charts/monetary'

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

const Colors = ['#3282BE', '#3CC68A', '#D59238']

const getOption = (
  statisticInflationRates: State.StatisticInflationRate[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: Colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 220 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.year'))} ${
              dataList[0].name
            }</div>`
            result += `<div>${tooltipColor(Colors[0])}${widthSpan(i18n.t('statistic.nominal_inflation_rate'))} ${
              dataList[0].data
            }%</div>`
            result += `<div>${tooltipColor(Colors[1])}${widthSpan(i18n.t('statistic.nominal_apc'))} ${
              dataList[1].data
            }%</div>`
            result += `<div>${tooltipColor(Colors[2])}${widthSpan(i18n.t('statistic.real_inflation_rate'))} ${
              dataList[2].data
            }%</div>`
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [
            { name: i18n.t('statistic.real_inflation_rate') },
            { name: i18n.t('statistic.nominal_apc') },
            { name: i18n.t('statistic.nominal_inflation_rate') },
          ],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.year'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticInflationRates.map(data => data.year),
        axisLabel: {
          interval: isMobile() || isThumbnail ? 11 : 3,
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
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.nominal_inflation_rate'),
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
        name: i18n.t('statistic.nominal_apc'),
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
        name: i18n.t('statistic.real_inflation_rate'),
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

export const InflationRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticInflationRates, statisticInflationRatesFetchEnd } = useAppState()
  if (!statisticInflationRatesFetchEnd || statisticInflationRates.length === 0) {
    return <ChartLoading show={!statisticInflationRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticInflationRates, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticInflationRates: State.StatisticInflationRate[]) => {
  return statisticInflationRates
    ? statisticInflationRates.map(data => [
        data.year,
        Number(data.nominalApc).toFixed(4),
        Number(data.nominalInflationRate).toFixed(4),
        Number(data.realInflationRate).toFixed(4),
      ])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticInflationRates } = useAppState()

  useEffect(() => {
    getStatisticInflationRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.inflation_rate')}
      description={i18n.t('statistic.inflation_rate_description')}
      data={toCSV(statisticInflationRates)}
    >
      <InflationRateChart />
    </ChartPage>
  )
}
