import { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'
import { getStatisticInflationRate } from '../../../service/app/charts/monetary'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'

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

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 220 : 80)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
  if (seriesName === i18n.t('statistic.nominal_inflation_rate')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.nominal_inflation_rate'))} ${data}%</div>`
  }
  if (seriesName === i18n.t('statistic.nominal_apc')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.nominal_apc'))} ${data}%</div>`
  }
  if (seriesName === i18n.t('statistic.real_inflation_rate')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('statistic.real_inflation_rate'))} ${data}%</div>`
  }
  return ''
}

const getOption = (
  statisticInflationRates: State.StatisticInflationRate[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.moreColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as Array<SeriesItem & { data: string }>
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.year'))} ${list[0].name}</div>`
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
            name: i18n.t('statistic.real_inflation_rate'),
          },
          {
            name: i18n.t('statistic.nominal_apc'),
          },
          {
            name: i18n.t('statistic.nominal_inflation_rate'),
          },
        ],
  },
  grid: isThumbnail ? gridThumbnail : grid,
  dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
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
          color: chartColor.moreColors[0],
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
})

export const InflationRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticInflationRates, statisticInflationRatesFetchEnd, app } = useAppState()
  if (!statisticInflationRatesFetchEnd || statisticInflationRates.length === 0) {
    return <ChartLoading show={!statisticInflationRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticInflationRates, app.chartColor, isThumbnail)}
      isThumbnail={isThumbnail}
    />
  )
}

const toCSV = (statisticInflationRates: State.StatisticInflationRate[]) =>
  statisticInflationRates
    ? statisticInflationRates.map(data => [
        data.year,
        Number(data.nominalApc).toFixed(4),
        Number(data.nominalInflationRate).toFixed(4),
        Number(data.realInflationRate).toFixed(4),
      ])
    : []

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
