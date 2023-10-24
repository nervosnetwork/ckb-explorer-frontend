import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, assertIsArray, parseNumericAbbr } from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage, SmartChartPageProps } from '../common'
import { explorerService } from '../../../services/ExplorerService'
import { ChartCachedKeys } from '../../../constants/cache'
import { useAdaptPCEllipsis } from '../../../utils/hook'

const getAddressWithRanking = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], ranking?: string) => {
  if (!ranking) return ''
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const useOption = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return (
    statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[],
    chartColor: State.ChartColor,
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
            formatter: dataList => {
              assertIsArray(dataList)
              const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 60 : 35)
              let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.address'))} ${getAdaptAddressText(
                getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name),
              )}</div>`
              result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.balance'))} \
            ${localeNumberString(dataList[0].data)} ${t('common.ckb_unit')}</div>`
              result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.rank'))} ${
                dataList[0].name
              }</div>`
              return result
            },
          }
        : undefined,
      grid: isThumbnail ? gridThumbnail : grid,
      dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
      xAxis: [
        {
          name: isMobile || isThumbnail ? '' : t('statistic.rank'),
          nameLocation: 'middle',
          nameGap: 30,
          type: 'category',
          boundaryGap: false,
          data: statisticAddressBalanceRanks.map(data => data.ranking),
        },
      ],
      yAxis: [
        {
          position: 'left',
          name: isMobile || isThumbnail ? '' : `${t('statistic.balance_ranking')} ${t('statistic.log')}`,
          type: 'log',
          logBase: 10,
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
      ],
      series: [
        {
          name: t('statistic.balance_ranking'),
          type: 'bar',
          yAxisIndex: 0,
          barWidth: 8,
          symbol: isThumbnail ? 'none' : 'circle',
          symbolSize: 3,
          data: statisticAddressBalanceRanks.map(data => shannonToCkb(data.balance)),
        },
      ],
    }
  }
}

const fetchStatisticAddressBalanceRanks = async () => {
  const resp = await explorerService.api.fetchStatisticAddressBalanceRank()
  return resp.attributes.addressBalanceRanking
}

const toCSV = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[]) =>
  statisticAddressBalanceRanks
    ? statisticAddressBalanceRanks.map(data => [data.ranking, shannonToCkbDecimal(data.balance, 8)])
    : []

export const AddressBalanceRankChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const history = useHistory()
  const [t] = useTranslation()

  const [statisticAddressBalanceRanks, setStatisticAddressBalanceRanks] = useState<State.StatisticAddressBalanceRank[]>(
    [],
  )
  const handleClick = useCallback(
    (param: echarts.CallbackDataParams) => {
      if (param && param.name && statisticAddressBalanceRanks.length > 0) {
        const address = getAddressWithRanking(statisticAddressBalanceRanks, param.name)
        if (address) {
          history.push(`/address/${address}`)
        }
      }
    },
    [statisticAddressBalanceRanks, history],
  )

  const adaptPCEllipsis = useAdaptPCEllipsis(60)
  const parseOption = useOption()
  const getEChartOption: SmartChartPageProps<State.StatisticAddressBalanceRank>['getEChartOption'] = useCallback(
    (...args) => parseOption(...args, address => adaptPCEllipsis(address, 6)),
    [adaptPCEllipsis, parseOption],
  )

  return (
    <SmartChartPage
      title={t('statistic.balance_ranking')}
      description={t('statistic.balance_ranking_description')}
      isThumbnail={isThumbnail}
      chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
      fetchData={fetchStatisticAddressBalanceRanks}
      onFetched={setStatisticAddressBalanceRanks}
      getEChartOption={getEChartOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.AddressBalanceRank}
      cacheMode="date"
    />
  )
}

export default AddressBalanceRankChart
