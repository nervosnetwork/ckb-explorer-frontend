import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsString,
  assertSerialsItem,
  handleAxis,
} from '../../../utils/chart'
import { handleDifficulty, handleHashRate } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { explorerService } from '../../../services/ExplorerService'
import { ChartCachedKeys } from '../../../constants/cache'
import { useCurrentLanguage } from '../../../utils/i18n'

const useOption = (
  statisticDifficultyHashRates: State.StatisticDifficultyHashRate[],
  chartColor: State.ChartColor,
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const gridThumbnail = {
    left: '4%',
    right: '4%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = () => ({
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  })

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 70 : 50)

  const useTooltip = () => {
    return ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
      if (seriesName === t('block.uncle_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.uncle_rate'))} ${data}%</div>`
      }
      if (seriesName === t('block.difficulty')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.difficulty'))} ${handleDifficulty(data)}</div>`
      }
      if (seriesName.startsWith(t('block.hash_rate'))) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.hash_rate'))} ${handleHashRate(data)}</div>`
      }
      return ''
    }
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList): string => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('block.epoch'))} ${dataList[0].name}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsString(data)
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
              name: t('block.difficulty'),
            },
            {
              name: t('block.hash_rate_hps'),
            },
            {
              name: t('block.uncle_rate'),
            },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid(),
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('block.epoch'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticDifficultyHashRates.map(data => data.epochNumber),
        axisLabel: {
          formatter: (value: string) => value,
        },
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
            color: chartColor.moreColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : t('block.hash_rate_hps'),
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: chartColor.moreColors[1],
          },
        },
        scale: true,
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
      {
        position: 'right',
        type: 'value',
        max: 100,
        show: false,
        axisLabel: {
          formatter: () => '',
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
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: t('block.hash_rate_hps'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.hashRate).toNumber()),
      },
      {
        name: t('block.uncle_rate'),
        type: 'line',
        smooth: true,
        yAxisIndex: 2,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        z: 0,
        markLine: isThumbnail
          ? undefined
          : {
              symbol: 'none',
              data: [
                {
                  name: t('block.uncle_rate_target'),
                  yAxis: 2.5,
                },
              ],
              label: {
                formatter: (params: { value: string }) => `${params.value}%`,
              },
            },
        data: statisticDifficultyHashRates.map(data => (Number(data.uncleRate) * 100).toFixed(2)),
      },
    ],
  }
}

const toCSV = (statisticDifficultyHashRates: State.StatisticDifficultyHashRate[]) =>
  statisticDifficultyHashRates
    ? statisticDifficultyHashRates.map(data => [data.epochNumber, data.difficulty, data.hashRate, data.uncleRate])
    : []

export const DifficultyHashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={`${t('block.difficulty')} & ${t('block.hash_rate')} & ${t('block.uncle_rate')}`}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticDifficultyHashRate}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.DifficultyHashRate}
      cacheMode="epoch"
    />
  )
}

export default DifficultyHashRateChart
