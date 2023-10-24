import { useTranslation } from 'react-i18next'
import { LanuageType, useCurrentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
} from '../../../utils/chart'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'

const widthSpan = (value: string, currentLanguage: LanuageType) =>
  tooltipWidth(value, currentLanguage === 'en' ? 155 : 70)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === t('nervos_dao.deposit_compensation')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.deposit_compensation'), currentLanguage)} ${
        data[3]
      }%</div>`
    }
    if (seriesName === t('nervos_dao.mining_reward')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.mining_reward'), currentLanguage)} ${data[2]}%</div>`
    }
    if (seriesName === t('nervos_dao.burnt')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.burnt'), currentLanguage)} ${data[1]}%</div>`
    }
    return ''
  }
}

const useOption = (
  statisticSecondaryIssuance: State.StatisticSecondaryIssuance[],
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.secondaryIssuanceColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)} ${
              dataList[0].data[0]
            }</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsStringArrayOf4(data)
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
              name: t('nervos_dao.burnt'),
            },
            {
              name: t('nervos_dao.mining_reward'),
            },
            {
              name: t('nervos_dao.deposit_compensation'),
            },
          ],
    },
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
        name: t('nervos_dao.burnt'),
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
        name: t('nervos_dao.mining_reward'),
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
        name: t('nervos_dao.deposit_compensation'),
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
      fetchData={explorerService.api.fetchStatisticSecondaryIssuance}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.SecondaryIssuance}
      cacheMode="date"
    />
  )
}

export default SecondaryIssuanceChart
