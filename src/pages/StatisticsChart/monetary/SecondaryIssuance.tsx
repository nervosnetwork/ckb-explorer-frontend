import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchStatisticSecondaryIssuance } from '../../../service/http/fetcher'

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 155 : 70)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
  if (seriesName === i18n.t('nervos_dao.deposit_compensation')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('nervos_dao.deposit_compensation'))} ${data[3]}%</div>`
  }
  if (seriesName === i18n.t('nervos_dao.mining_reward')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('nervos_dao.mining_reward'))} ${data[2]}%</div>`
  }
  if (seriesName === i18n.t('nervos_dao.burnt')) {
    return `<div>${tooltipColor(color)}${widthSpan(i18n.t('nervos_dao.burnt'))} ${data[1]}%</div>`
  }
  return ''
}

const getOption = (
  statisticSecondaryIssuance: State.StatisticSecondaryIssuance[],
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.secondaryIssuanceColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const list = dataList as Array<SeriesItem & { data: [string, string, string, string] }>
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              dataList[0].data[0]
            }</div>`
            list.forEach(data => {
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [
            {
              name: i18n.t('nervos_dao.burnt'),
            },
            {
              name: i18n.t('nervos_dao.mining_reward'),
            },
            {
              name: i18n.t('nervos_dao.deposit_compensation'),
            },
          ],
    },
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
        type: 'value',
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
        name: i18n.t('nervos_dao.burnt'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'treasury',
        },
      },
      {
        name: i18n.t('nervos_dao.mining_reward'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'reward',
        },
      },
      {
        name: i18n.t('nervos_dao.deposit_compensation'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'compensation',
        },
      },
    ],
    dataset: {
      source: statisticSecondaryIssuance.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        data.treasuryAmount,
        data.miningReward,
        data.depositCompensation,
      ]),
      dimensions: ['timestamp', 'treasury', 'reward', 'compensation'],
    },
  }
}

const toCSV = (statisticSecondaryIssuance: State.StatisticSecondaryIssuance[]) =>
  statisticSecondaryIssuance
    ? statisticSecondaryIssuance.map(data => [
        data.createdAtUnixtimestamp,
        data.treasuryAmount,
        data.miningReward,
        data.depositCompensation,
      ])
    : []

export const SecondaryIssuanceChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('nervos_dao.secondary_issuance')}
      description={t('statistic.secondary_issuance_description')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticSecondaryIssuance}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.SecondaryIssuance}
      cacheMode="date"
    />
  )
}

export default SecondaryIssuanceChart
