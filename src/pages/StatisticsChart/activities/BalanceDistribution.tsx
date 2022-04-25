import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticBalanceDistribution } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis, handleLogGroupAxis } from '../../../utils/chart'
import { isMobile } from '../../../utils/screen'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth, SeriesItem } from '../common'
import { localeNumberString } from '../../../utils/number'

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
  top: isMobile() ? '3%' : '8%',
  bottom: '6%',
  containLabel: true,
}

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 270 : 110)

const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
  return `<div>${tooltipColor(color)}${widthSpan(seriesName)} ${localeNumberString(data)}</div>`
}

const getOption = (
  statisticBalanceDistributions: State.StatisticBalanceDistribution[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as (SeriesItem & { data: string })[]
          let result = `<div>${tooltipColor('#333333')}${widthSpan(
            i18n.t('statistic.addresses_balance'),
          )} ${handleLogGroupAxis(
            new BigNumber(list[0].name),
            list[0].dataIndex === statisticBalanceDistributions.length - 1 ? '+' : '',
          )} ${i18n.t('common.ckb_unit')}</div>`
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
            name: i18n.t('statistic.addresses_balance_group'),
          },
          {
            name: i18n.t('statistic.addresses_below_specific_balance'),
          },
        ],
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.addresses_balance')} (CKB)`,
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: true,
      data: statisticBalanceDistributions.map(data => data.balance),
      axisLabel: {
        formatter: (value: string, index: number) =>
          `${handleLogGroupAxis(new BigNumber(value), index === statisticBalanceDistributions.length - 1 ? '+' : '')}`,
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.addresses_balance_group'),
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
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.addresses_below_specific_balance'),
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
      name: i18n.t('statistic.addresses_balance_group'),
      type: 'bar',
      areaStyle: {
        color: chartColor.areaColor,
      },
      yAxisIndex: 0,
      barWidth: isMobile() || isThumbnail ? 20 : 50,
      data: statisticBalanceDistributions.map(data => new BigNumber(data.addresses).toNumber()),
    },
    {
      name: i18n.t('statistic.addresses_below_specific_balance'),
      type: 'line',
      yAxisIndex: 1,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticBalanceDistributions.map(data => new BigNumber(data.sumAddresses).toNumber()),
    },
  ],
})

export const BalanceDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticBalanceDistributions, statisticBalanceDistributionsFetchEnd, app } = useAppState()
  if (!statisticBalanceDistributionsFetchEnd || statisticBalanceDistributions.length === 0) {
    return <ChartLoading show={!statisticBalanceDistributionsFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticBalanceDistributions, app.chartColor, isThumbnail)}
      isThumbnail={isThumbnail}
    />
  )
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

export default () => {
  const dispatch = useDispatch()
  const { statisticBalanceDistributions } = useAppState()

  useEffect(() => {
    getStatisticBalanceDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.balance_distribution')}
      description={i18n.t('statistic.balance_distribution_description')}
      data={toCSV(statisticBalanceDistributions)}
    >
      <BalanceDistributionChart />
    </ChartPage>
  )
}
