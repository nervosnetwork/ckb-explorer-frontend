import { FC } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { assertSerialsDataIsString, assertIsArray, assertSerialsItem, handleAxis } from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { parseHourFromMillisecond } from '../../../utils/date'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'
import { LanuageType, useCurrentLanguage } from '../../../utils/i18n'

const widthSpan = (value: string, currentLanguage: LanuageType) =>
  tooltipWidth(value, currentLanguage === 'en' ? 90 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({ seriesName, data, color }: SeriesItem & { data: string }) => {
    if (seriesName === t('block.epoch_time')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('block.epoch_time'), currentLanguage)} ${data} h</div>`
    }
    if (seriesName === t('block.epoch_length')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('block.epoch_length'), currentLanguage)} ${data}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticChartData: State.StatisticDifficultyUncleRateEpoch[],
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
  const grid = {
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const COUNT_IN_THUMBNAIL = 90
  const epochNumberSerie = statisticChartData.map(data => data.epochNumber)
  const epochTimeSerie = statisticChartData.map(data => parseHourFromMillisecond(data.epochTime))
  const epochLengthSerie = statisticChartData.map(data => data.epochLength)
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
        data: isThumbnail ? epochNumberSerie.slice(-1 * COUNT_IN_THUMBNAIL) : epochNumberSerie,
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
        data: isThumbnail ? epochTimeSerie.slice(-1 * COUNT_IN_THUMBNAIL) : epochTimeSerie,
      },
      {
        name: t('block.epoch_length'),
        type: 'bar',
        step: 'start',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 5,
        data: isThumbnail ? epochLengthSerie.slice(-1 * COUNT_IN_THUMBNAIL) : epochLengthSerie,
      },
    ],
  }
}

const toCSV = (statisticDifficultyUncleRateEpochs: State.StatisticDifficultyUncleRateEpoch[]) =>
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
      cacheKey={ChartCachedKeys.DifficultyUncleRateEpoch}
      cacheMode="epoch"
    />
  )
}

export default DifficultyUncleRateEpochChart
