import { useTranslation } from 'react-i18next'
import { DATA_ZOOM_CONFIG, assertIsArray } from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'
import { useCurrentLanguage } from '../../../utils/i18n'

const useOption = (
  statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[],
  chartColor: State.ChartColor,
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
    left: '5%',
    right: '3%',
    top: isMobile ? '3%' : '8%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 80 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.time'))} ${dataList[0].name}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.block_count'))} ${
              dataList[0].data
            }%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.time'),
        nameLocation: 'middle',
        nameGap: 30,
        data: statisticBlockTimeDistributions.map(data => data.time),
        axisLabel: {
          interval: 49,
          formatter: (value: string) => Number(value).toFixed(0),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.block_count'),
        type: 'value',
        scale: true,
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
        name: t('statistic.block_count'),
        type: 'line',
        yAxisIndex: 0,
        areaStyle: {
          color: chartColor.areaColor,
        },
        barWidth: isMobile || isThumbnail ? 10 : 20,
        data: statisticBlockTimeDistributions.map(data => (Number(data.ratio) * 100).toFixed(3)),
      },
    ],
  }
}

const fetchStatisticBlockTimeDistributions = async () => {
  const {
    attributes: { blockTimeDistribution },
  } = await explorerService.api.fetchStatisticBlockTimeDistribution()
  const sumBlocks = blockTimeDistribution
    .flatMap(data => Number(data[1]))
    .reduce((previous, current) => previous + current)
  const statisticBlockTimeDistributions = [
    {
      time: '0',
      ratio: '0',
    },
  ].concat(
    blockTimeDistribution.map(data => {
      const [time, blocks] = data
      return {
        time,
        ratio: (Number(blocks) / sumBlocks).toFixed(5),
      }
    }),
  )
  return statisticBlockTimeDistributions
}

const toCSV = (statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[]) =>
  statisticBlockTimeDistributions
    ? statisticBlockTimeDistributions.map(data => [data.time, Number(data.ratio).toFixed(4)])
    : []

export const BlockTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.block_time_distribution_more')}
      description={t('statistic.block_time_distribution_description')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticBlockTimeDistributions}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.BlockTimeDistribution}
      cacheMode="date"
    />
  )
}

export default BlockTimeDistributionChart
