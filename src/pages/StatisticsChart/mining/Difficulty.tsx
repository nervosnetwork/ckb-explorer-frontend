import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useQuery } from 'react-query'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { useAppState } from '../../../contexts/providers'
import { handleDifficulty } from '../../../utils/number'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchStatisticDifficulty } from '../../../service/http/fetcher'

const getOption = (
  statisticDifficulties: State.StatisticDifficulty[],
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
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 70 : 35)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              dataList[0].data[0]
            }</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}\
          ${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(dataList[0].data[1])}</div>`
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.difficulty'),
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
        name: i18n.t('block.difficulty'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'value',
        },
      },
    ],
    dataset: {
      source: statisticDifficulties.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        new BigNumber(data.avgDifficulty).toNumber(),
      ]),
      dimensions: ['timestamp', 'value'],
    },
  }
}

const toCSV = (statisticDifficulties: State.StatisticDifficulty[]) =>
  statisticDifficulties ? statisticDifficulties.map(data => [data.createdAtUnixtimestamp, data.avgDifficulty]) : []

export const DifficultyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { app } = useAppState()

  const query = useQuery(['fetchStatisticDifficulty'], async () => {
    const cache = fetchDateChartCache<State.StatisticDifficulty[]>(ChartCachedKeys.Difficulty)
    if (cache) return cache

    const { data } = await fetchStatisticDifficulty()
    const difficulties = data.map(wrapper => wrapper.attributes)
    if (difficulties && difficulties.length > 0) {
      storeDateChartCache<State.StatisticDifficulty[]>(ChartCachedKeys.Difficulty, difficulties)
    }
    return difficulties
  })
  const statisticDifficulties = useMemo(() => query.data ?? [], [query.data])

  const option = useMemo(
    () => getOption(statisticDifficulties, app.chartColor, isMobile, isThumbnail),
    [statisticDifficulties, app.chartColor, isMobile, isThumbnail],
  )

  const content = query.isLoading ? (
    <ChartLoading show isThumbnail={isThumbnail} />
  ) : (
    <ReactChartCore option={option} isThumbnail={isThumbnail} />
  )

  return isThumbnail ? (
    content
  ) : (
    <ChartPage title={i18n.t('block.difficulty')} data={toCSV(statisticDifficulties)}>
      {content}
    </ChartPage>
  )
}

export default DifficultyChart
