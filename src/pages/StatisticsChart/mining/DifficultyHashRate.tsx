import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { handleDifficulty, handleHashRate } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { fetchStatisticDifficultyHashRate } from '../../../service/http/fetcher'
import { ChartCachedKeys } from '../../../constants/cache'

const getOption = (
  statisticDifficultyHashRates: State.StatisticDifficultyHashRate[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
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

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 70 : 50)

  const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
    if (seriesName === i18n.t('block.uncle_rate')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('block.uncle_rate'))} ${data}%</div>`
    }
    if (seriesName === i18n.t('block.difficulty')) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(data)}</div>`
    }
    if (seriesName.startsWith(i18n.t('block.hash_rate'))) {
      return `<div>${tooltipColor(color)}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(data)}</div>`
    }
    return ''
  }
  return {
    color: chartColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any): string => {
            const list = dataList as Array<SeriesItem & { data: string }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('block.epoch'))} ${list[0].name}</div>`
            list.forEach(data => {
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
              name: i18n.t('block.difficulty'),
            },
            {
              name: i18n.t('block.hash_rate_hps'),
            },
            {
              name: i18n.t('block.uncle_rate'),
            },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid(),
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('block.epoch'),
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.difficulty'),
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.hash_rate_hps'),
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
        name: i18n.t('block.difficulty'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.hash_rate_hps'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.hashRate).toNumber()),
      },
      {
        name: i18n.t('block.uncle_rate'),
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
                  name: i18n.t('block.uncle_rate_target'),
                  yAxis: 2.5,
                },
              ],
              label: {
                formatter: (params: any) => `${params.value}%`,
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
      fetchData={fetchStatisticDifficultyHashRate}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.DifficultyHashRate}
      cacheMode="epoch"
    />
  )
}

export default DifficultyHashRateChart
