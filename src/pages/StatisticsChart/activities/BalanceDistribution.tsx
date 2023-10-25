import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { LanuageType, useCurrentLanguage } from '../../../utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsString,
  assertSerialsItem,
  handleAxis,
  handleLogGroupAxis,
} from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { localeNumberString } from '../../../utils/number'
import { ChartCachedKeys } from '../../../constants/cache'
import { explorerService } from '../../../services/ExplorerService'

const widthSpan = (value: string, currentLanguage: string) => tooltipWidth(value, currentLanguage === 'en' ? 270 : 110)

const parseTooltip = ({
  seriesName,
  data,
  color,
  currentLanguage,
}: SeriesItem & { data: string; currentLanguage: LanuageType }): string => {
  return `<div>${tooltipColor(color)}${widthSpan(seriesName, currentLanguage)} ${localeNumberString(data)}</div>`
}

const useOption = (
  statisticBalanceDistributions: State.StatisticBalanceDistribution[],
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
    left: '2%',
    right: '3%',
    top: isMobile ? '3%' : '8%',
    bottom: '6%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const firstData = dataList[0]
            assertSerialsItem(firstData)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              t('statistic.addresses_balance'),
              currentLanguage,
            )} ${handleLogGroupAxis(
              new BigNumber(firstData.name),
              firstData.dataIndex === statisticBalanceDistributions.length - 1 ? '+' : '',
            )} ${t('common.ckb_unit')}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsString(data)
              result += parseTooltip({ ...data, currentLanguage })
            })
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          data: [
            {
              name: t('statistic.addresses_balance_group'),
            },
            {
              name: t('statistic.addresses_below_specific_balance'),
            },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : `${t('statistic.addresses_balance')} (CKB)`,
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: statisticBalanceDistributions.map(data => data.balance),
        axisLabel: {
          formatter: (value: string, index: number) =>
            `${handleLogGroupAxis(
              new BigNumber(value),
              index === statisticBalanceDistributions.length - 1 ? '+' : '',
            )}`,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.addresses_balance_group'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'left',
        },
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : t('statistic.addresses_below_specific_balance'),
        type: 'value',
        splitLine: {
          show: false,
        },
        scale: true,
        nameTextStyle: {
          align: 'right',
        },
        axisLine: {
          lineStyle: {
            color: chartColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: t('statistic.addresses_balance_group'),
        type: 'bar',
        areaStyle: {
          color: chartColor.areaColor,
        },
        yAxisIndex: 0,
        barWidth: isMobile || isThumbnail ? 20 : 50,
        data: statisticBalanceDistributions.map(data => new BigNumber(data.addresses).toNumber()),
      },
      {
        name: t('statistic.addresses_below_specific_balance'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticBalanceDistributions.map(data => new BigNumber(data.sumAddresses).toNumber()),
      },
    ],
  }
}

const fetchStatisticBalanceDistributions = async () => {
  const { addressBalanceDistribution } = await explorerService.api.fetchStatisticBalanceDistribution()
  const balanceDistributions = addressBalanceDistribution.map(distribution => {
    const [balance, addresses, sumAddresses] = distribution
    return {
      balance,
      addresses,
      sumAddresses,
    }
  })
  return balanceDistributions
}

const toCSV = (statisticBalanceDistributions?: State.StatisticBalanceDistribution[]) =>
  statisticBalanceDistributions
    ? statisticBalanceDistributions.map((data, index) => [
        `"${handleLogGroupAxis(
          new BigNumber(data.balance),
          index === statisticBalanceDistributions.length - 1 ? '+' : '',
        )}"`,
        data.addresses,
        data.sumAddresses,
      ])
    : []

export const BalanceDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.balance_distribution')}
      description={t('statistic.balance_distribution_description')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticBalanceDistributions}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.BalanceDistribution}
      cacheMode="date"
    />
  )
}

export default BalanceDistributionChart
