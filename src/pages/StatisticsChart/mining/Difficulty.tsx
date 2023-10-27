import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { handleDifficulty } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { ChartCachedKeys } from '../../../constants/cache'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  statisticDifficulties: ChartItem.Difficulty[],
  chartColor: ChartColorConfig,
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
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 70 : 35)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${dataList[0].data[0]}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}\
          ${widthSpan(t('block.difficulty'))} ${handleDifficulty(dataList[0].data[1])}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('block.difficulty'),
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
        name: t('block.difficulty'),
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

const toCSV = (statisticDifficulties: ChartItem.Difficulty[]) =>
  statisticDifficulties ? statisticDifficulties.map(data => [data.createdAtUnixtimestamp, data.avgDifficulty]) : []

export const DifficultyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('block.difficulty')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticDifficulty}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.Difficulty}
      cacheMode="date"
    />
  )
}

export default DifficultyChart
