import { useCallback } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchStatisticMinerAddressDistribution } from '../../../service/http/fetcher'

const Colors = [
  '#069ECD',
  '#69C7D4',
  '#AACFE9',
  '#29B97A',
  '#66CC99',
  '#228159',
  '#525860',
  '#74808E',
  '#9DA6B0',
  '#FBB04C',
]

const getOption = (
  statisticMinerAddresses: State.StatisticMinerAddress[],
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
    left: '3%',
    right: '3%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  const addressText = (address: string) =>
    isMobile ? adaptMobileEllipsis(address, 4) : adaptPCEllipsis(address, 2, 80)

  return {
    color: [chartColor.colors[0], ...Colors],
    tooltip: !isThumbnail
      ? {
          formatter: (data: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 65)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.address'))} ${addressText(
              data.data.title,
            )}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('statistic.miner_ratio'))} ${(
              Number(data.data.value) * 100
            ).toFixed(1)}%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    series: [
      {
        name: i18n.t('statistic.miner_ratio'),
        type: 'pie',
        radius: isMobile || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: statisticMinerAddresses.map(data => ({
          name: `${addressText(data.address.toLowerCase())} (${(Number(data.radio) * 100).toFixed(1)}%)`,
          title: data.address.toLowerCase(),
          value: data.radio,
        })),
      },
    ],
  }
}

const fetchStatisticMinerAddresses = async () => {
  const {
    attributes: { minerAddressDistribution },
  } = await fetchStatisticMinerAddressDistribution()
  const blockSum = Object.values(minerAddressDistribution).reduce((sum, val) => sum + Number(val), 0)
  const statisticMinerAddresses: State.StatisticMinerAddress[] = Object.entries(minerAddressDistribution).map(
    ([key, val]) => ({
      address: key,
      radio: (Number(val) / blockSum).toFixed(3),
    }),
  )
  return statisticMinerAddresses
}

const toCSV = (statisticMinerAddresses: State.StatisticMinerAddress[]) =>
  statisticMinerAddresses ? statisticMinerAddresses.map(data => [data.address, data.radio]) : []

export const MinerAddressDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  const history = useHistory()
  const clickEvent = useCallback(
    (param: any) => {
      if (param && param.data.title) {
        history.push(`/address/${param.data.title}`)
      }
    },
    [history],
  )

  return (
    <SmartChartPage
      title={t('statistic.miner_addresses_rank')}
      isThumbnail={isThumbnail}
      chartProps={{ clickEvent: !isThumbnail ? clickEvent : undefined }}
      fetchData={fetchStatisticMinerAddresses}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.MinerAddressDistribution}
      cacheMode="date"
    />
  )
}

export default MinerAddressDistributionChart
