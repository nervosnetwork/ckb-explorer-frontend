import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficultyUncleRateEpoch } from '../../../service/app/charts/mining'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { useIsMobile } from '../../../utils/hook'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'
import { parseHourFromMillisecond } from '../../../utils/date'

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 90 : 80)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: string }) => {
  if (seriesName === i18n.t('block.epoch_time')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('block.epoch_time'))} ${data} h</div>`
  }
  if (seriesName === i18n.t('block.epoch_length')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('block.epoch_length'))} ${data}</div>`
  }
  return ''
}

const getOption = (
  statisticChartData: State.StatisticDifficultyUncleRateEpoch[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
) => {
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

  return {
    color: chartColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
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
              name: i18n.t('block.epoch_time'),
            },
            {
              name: i18n.t('block.epoch_length'),
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.epoch'),
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.epoch_time'),
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
        name: isMobile || isThumbnail ? '' : i18n.t('block.epoch_length'),
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
        name: i18n.t('block.epoch_time'),
        type: 'bar',
        step: 'start',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 5,
        data: isThumbnail ? epochTimeSerie.slice(-1 * COUNT_IN_THUMBNAIL) : epochTimeSerie,
      },
      {
        name: i18n.t('block.epoch_length'),
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

export const DifficultyUncleRateEpochChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticDifficultyUncleRateEpochs, statisticDifficultyUncleRatesFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticDifficultyUncleRateEpochs, app.chartColor, isMobile, isThumbnail),
    [statisticDifficultyUncleRateEpochs, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticDifficultyUncleRatesFetchEnd || statisticDifficultyUncleRateEpochs.length === 0) {
    return <ChartLoading show={!statisticDifficultyUncleRatesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticDifficultyUncleRateEpochs: State.StatisticDifficultyUncleRateEpoch[]) =>
  statisticDifficultyUncleRateEpochs
    ? statisticDifficultyUncleRateEpochs.map(data => [data.epochNumber, data.epochTime, data.epochLength])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyUncleRateEpochs } = useAppState()

  useEffect(() => {
    getStatisticDifficultyUncleRateEpoch(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={`${i18n.t('block.epoch_time')} & ${i18n.t('block.epoch_length')}`}
      data={toCSV(statisticDifficultyUncleRateEpochs)}
    >
      <DifficultyUncleRateEpochChart />
    </ChartPage>
  )
}
