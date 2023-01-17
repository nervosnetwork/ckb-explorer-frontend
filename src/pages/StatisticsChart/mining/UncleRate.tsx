import { useEffect, useMemo } from 'react'
import { getStatisticUncleRate } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'

const max = (statisticUncleRates: State.StatisticUncleRate[]) => {
  const array = statisticUncleRates.flatMap(data => Number(data.uncleRate) * 100)
  return Math.max(5, Math.ceil(Math.max(...array)))
}

const getOption = (
  statisticUncleRates: State.StatisticUncleRate[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
) => {
  const gridThumbnail = {
    left: '4%',
    right: '12%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: '3%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              dataList[0].data[0]
            }</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('block.uncle_rate'))} ${
              dataList[0].data[1]
            }%</div>`
            return result
          },
        }
      : undefined,
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.uncle_rate'),
        type: 'value',
        scale: true,
        max: max(statisticUncleRates),
        min: 0,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('block.uncle_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        markLine: {
          symbol: 'none',
          data: [
            {
              name: i18n.t('block.uncle_rate_target'),
              yAxis: 2.5,
            },
          ],
          label: {
            formatter: (label: any) => `${label.data.value}%`,
          },
        },
      },
    ],
    dataset: {
      source: statisticUncleRates.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        (+data.uncleRate * 100).toFixed(2),
      ]),
    },
  }
}

export const UncleRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticUncleRates, statisticUncleRatesFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticUncleRates, app.chartColor, isMobile, isThumbnail),
    [statisticUncleRates, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticUncleRatesFetchEnd || statisticUncleRates.length === 0) {
    return <ChartLoading show={!statisticUncleRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticUncleRates: State.StatisticUncleRate[]) =>
  statisticUncleRates ? statisticUncleRates.map(data => [data.createdAtUnixtimestamp, data.uncleRate]) : []

export default () => {
  const dispatch = useDispatch()
  const { statisticUncleRates } = useAppState()

  useEffect(() => {
    getStatisticUncleRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('block.uncle_rate')}
      description={i18n.t('statistic.uncle_rate_description')}
      data={toCSV(statisticUncleRates)}
    >
      <UncleRateChart />
    </ChartPage>
  )
}
