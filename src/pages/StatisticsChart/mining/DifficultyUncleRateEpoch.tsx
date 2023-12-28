import { FC } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { assertIsArray, assertSerialsItem, handleAxis } from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { parseHourFromMillisecond } from '../../../utils/date'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { SupportedLng, useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const widthSpan = (value: string, currentLanguage: SupportedLng) =>
  tooltipWidth(value, currentLanguage === 'en' ? 90 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({ seriesName, data, color }: SeriesItem & { data?: unknown }) => {
    // empty epoch time is invalid and could be hidden, epoch time is expected to be around 4 hours
    if (seriesName === t('block.epoch_time') && data) {
      return `<div>${tooltipColor(color)}${widthSpan(t('block.epoch_time'), currentLanguage)} ${data} h</div>`
    }
    // empty epoch length is invalid and could be hidden, epoch length is determined by avg block time, it's expected to be 4h / avg_block_time
    if (seriesName === t('block.epoch_length') && data) {
      return `<div>${tooltipColor(color)}${widthSpan(t('block.epoch_length'), currentLanguage)} ${data}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticChartData: ChartItem.DifficultyUncleRateEpoch[],
  chartColor: ChartColorConfig,
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
  const grid = {
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const COUNT_IN_THUMBNAIL = 90
  const epochNumberSeries = statisticChartData.map(data => data.epochNumber)
  const epochTimeSeries = statisticChartData.map(data => parseHourFromMillisecond(data.epochTime))
  const epochLengthSeries = statisticChartData.map(data => data.epochLength)
  const endValue = statisticChartData[statisticChartData.length - 1]?.epochNumber ?? '0'
  const startValue = Math.max(+endValue - COUNT_IN_THUMBNAIL, 0).toString()
  const parseTooltip = useTooltip()

  return {
    color: chartColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('block.epoch'), currentLanguage)} ${
              dataList[0].name
            }</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
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
              name: t('block.epoch_time'),
            },
            {
              name: t('block.epoch_length'),
            },
          ],
          textStyle: {
            fontSize: isMobile ? 11 : 14,
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail
      ? []
      : [
          {
            show: true,
            realtime: true,
            startValue,
            endValue,
            xAxisIndex: [0],
          },
          {
            type: 'inside',
            realtime: true,
            startValue,
            endValue,
            xAxisIndex: [0],
          },
        ],

    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('block.epoch'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: isThumbnail ? epochNumberSeries.slice(-1 * COUNT_IN_THUMBNAIL) : epochNumberSeries,
        axisLabel: {
          formatter: (value: string) => value,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('block.epoch_time'),
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
        name: isMobile || isThumbnail ? '' : t('block.epoch_length'),
        type: 'value',
        scale: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: chartColor.moreColors[1],
          },
        },
      },
      {
        position: 'left',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.moreColors[0],
          },
        },
        axisLabel: {
          formatter: () => '',
        },
      },
      {
        position: 'right',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.moreColors[1],
          },
        },
        axisLabel: {
          formatter: () => '',
        },
      },
    ],
    series: [
      {
        name: t('block.epoch_time'),
        type: 'bar',
        step: 'start',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 5,
        data: isThumbnail ? epochTimeSeries.slice(-1 * COUNT_IN_THUMBNAIL) : epochTimeSeries,
      },
      {
        name: t('block.epoch_length'),
        type: 'bar',
        step: 'start',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 5,
        data: isThumbnail ? epochLengthSeries.slice(-1 * COUNT_IN_THUMBNAIL) : epochLengthSeries,
      },
    ],
  }
}

const toCSV = (statisticDifficultyUncleRateEpochs: ChartItem.DifficultyUncleRateEpoch[]) =>
  statisticDifficultyUncleRateEpochs
    ? statisticDifficultyUncleRateEpochs.map(data => [data.epochNumber, data.epochTime, data.epochLength])
    : []

export const DifficultyUncleRateEpochChart: FC<{ isThumbnail?: boolean }> = ({ isThumbnail = false }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={`${t('block.epoch_time')} & ${t('block.epoch_length')}`}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticDifficultyUncleRateEpoch}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticDifficultyUncleRateEpoch"
    />
  )
}

export default DifficultyUncleRateEpochChart
