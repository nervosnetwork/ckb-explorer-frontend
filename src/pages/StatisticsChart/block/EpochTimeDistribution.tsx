import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { localeNumberString } from '../../../utils/number'
import { parseHourFromMinute } from '../../../utils/date'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'
import { fetchStatisticEpochTimeDistribution } from '../../../service/http/fetcher'
import { ChartCachedKeys } from '../../../constants/cache'

const getOption = (
  statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[],
  chartColor: State.ChartColor,
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
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 80 : 80)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              i18n.t('statistic.time_hour'),
            )} ${parseHourFromMinute(dataList[0].name)}</div>`
            result += `\
            <div>${tooltipColor(chartColor.colors[0])}\
            ${widthSpan(i18n.t('statistic.epochs'))} \
            ${localeNumberString(dataList[0].data)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.time_hour'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: statisticEpochTimeDistributions.map(data => data.time),
        axisLabel: {
          formatter: (value: string) => parseHourFromMinute(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.epochs'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => localeNumberString(value),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.epochs'),
        type: 'bar',
        yAxisIndex: 0,
        areaStyle: {
          color: chartColor.areaColor,
        },
        barWidth: isMobile || isThumbnail ? 2 : 5,
        data: statisticEpochTimeDistributions.map(data => data.epoch),
      },
    ],
  }
}

const fetchStatisticEpochTimeDistributions = async () => {
  const {
    attributes: { epochTimeDistribution },
  } = await fetchStatisticEpochTimeDistribution()
  const statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[] = epochTimeDistribution.map(data => {
    const [time, epoch] = data
    return {
      time,
      epoch,
    }
  })
  return statisticEpochTimeDistributions
}

const toCSV = (statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[]) =>
  statisticEpochTimeDistributions
    ? statisticEpochTimeDistributions.map(data => [parseHourFromMinute(data.time), data.epoch])
    : []

export const EpochTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.epoch_time_distribution_more')}
      description={t('statistic.epoch_time_distribution_description')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticEpochTimeDistributions}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.EpochTimeDistribution}
      cacheMode="date"
    />
  )
}

export default EpochTimeDistributionChart
