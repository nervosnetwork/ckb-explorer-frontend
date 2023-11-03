import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { LanuageType, useCurrentLanguage } from '../../../utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf3,
  assertSerialsItem,
  parseNumericAbbr,
} from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { isMainnet } from '../../../utils/chain'
import { tooltipWidth, tooltipColor, SeriesItem, SmartChartPage } from '../common'
import { ChartCachedKeys } from '../../../constants/cache'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const widthSpan = (value: string, language: LanuageType) => tooltipWidth(value, language === 'en' ? 140 : 120)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string] }): string => {
    if (seriesName === t('statistic.new_dao_deposit')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.new_dao_deposit'),
        currentLanguage,
      )} ${parseNumericAbbr(data[1], 2)}</div>`
    }
    if (seriesName === t('statistic.new_dao_depositor')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.new_dao_depositor'),
        currentLanguage,
      )} ${parseNumericAbbr(data[2], 2, true)}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticNewDaoDeposits: ChartItem.NewDaoDeposit[],
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
    left: '4%',
    right: '3%',
    top: '6%',
    bottom: '5%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  return {
    color: chartColor.colors,
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
              assertSerialsDataIsStringArrayOf3(data)
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    legend: {
      data: isThumbnail
        ? []
        : [
            {
              name: t('statistic.new_dao_deposit'),
            },
            {
              name: t('statistic.new_dao_depositor'),
            },
          ],
    },
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
        name: isMobile || isThumbnail ? '' : t('statistic.new_dao_deposit'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${parseNumericAbbr(value)}`,
        },
      },
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : t('statistic.new_dao_depositor'),
        nameTextStyle: {
          align: 'right',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${parseNumericAbbr(new BigNumber(value))}`,
        },
      },
    ],
    series: [
      {
        name: t('statistic.new_dao_deposit'),
        type: 'line',
        yAxisIndex: 0,
        areaStyle: {
          color: chartColor.areaColor,
        },
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'deposit',
        },
      },
      {
        name: t('statistic.new_dao_depositor'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'depositor',
        },
      },
    ],
    dataset: {
      source: statisticNewDaoDeposits.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        new BigNumber(shannonToCkb(data.dailyDaoDeposit)).toFixed(0),
        new BigNumber(data.dailyDaoDepositorsCount).toNumber().toString(),
      ]),
      dimensions: ['timestamp', 'deposit', 'depositor'],
    },
  }
}

const toCSV = (statisticNewDaoDeposits: ChartItem.NewDaoDeposit[]) =>
  statisticNewDaoDeposits
    ? statisticNewDaoDeposits.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.dailyDaoDeposit, 8),
        data.dailyDaoDepositorsCount,
      ])
    : []

export const NewDaoDepositChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.new_dao_deposit_depositor')}
      note={isMainnet() ? `${t('common.note')}1MB = 1,000,000 CKBytes` : undefined}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticNewDaoDeposit}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.DailyDeposit}
      cacheMode="date"
    />
  )
}

export default NewDaoDepositChart
