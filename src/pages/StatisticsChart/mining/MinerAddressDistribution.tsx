import { useCallback } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { tooltipColor, tooltipWidth, SmartChartPage, SmartChartPageProps } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useAdaptMobileEllipsis, useAdaptPCEllipsis, useIsMobile } from '../../../utils/hook'
import { useCurrentLanguage } from '../../../utils/i18n'
import { assertNotArray } from '../../../utils/chart'
import { ChartColorConfig } from '../../../constants/common'

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

const useOption = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return (
    statisticMinerAddresses: ChartItem.MinerAddress[],
    chartColor: ChartColorConfig,
    isMobile: boolean,
    isThumbnail = false,
    getAdaptAddressText: (address: string) => string,
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

    return {
      color: [chartColor.colors[0], ...Colors],
      tooltip: !isThumbnail
        ? {
            formatter: data => {
              assertNotArray(data)
              const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 60 : 65)
              let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.address'))} ${getAdaptAddressText(
                data.data.title,
              )}</div>`
              result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.miner_ratio'))} ${(
                Number(data.data.value) * 100
              ).toFixed(1)}%</div>`
              return result
            },
          }
        : undefined,
      grid: isThumbnail ? gridThumbnail : grid,
      series: [
        {
          name: t('statistic.miner_ratio'),
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
            name: `${getAdaptAddressText(data.address.toLowerCase())} (${(Number(data.radio) * 100).toFixed(1)}%)`,
            title: data.address.toLowerCase(),
            value: data.radio,
          })),
        },
      ],
    }
  }
}

const toCSV = (statisticMinerAddresses: ChartItem.MinerAddress[]) =>
  statisticMinerAddresses ? statisticMinerAddresses.map(data => [data.address, data.radio]) : []

export const MinerAddressDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  const history = useHistory()
  const onClick = useCallback(
    (param: echarts.CallbackDataParams) => {
      if (param && param.data.title) {
        history.push(`/address/${param.data.title}`)
      }
    },
    [history],
  )

  const isMobile = useIsMobile()
  const adaptMobileEllipsis = useAdaptMobileEllipsis()
  const adaptPCEllipsis = useAdaptPCEllipsis(80)
  const parseOption = useOption()
  const getEChartOption: SmartChartPageProps<ChartItem.MinerAddress>['getEChartOption'] = useCallback(
    (...args) =>
      parseOption(...args, address => (isMobile ? adaptMobileEllipsis(address, 4) : adaptPCEllipsis(address, 2))),
    [adaptMobileEllipsis, adaptPCEllipsis, isMobile, parseOption],
  )

  return (
    <SmartChartPage
      title={t('statistic.miner_addresses_rank')}
      isThumbnail={isThumbnail}
      chartProps={{ onClick: !isThumbnail ? onClick : undefined }}
      fetchData={explorerService.api.fetchStatisticMinerAddressDistribution}
      getEChartOption={getEChartOption}
      toCSV={toCSV}
      queryKey="fetchStatisticMinerAddressDistribution"
    />
  )
}

export default MinerAddressDistributionChart
