import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, parseNumericAbbr } from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage, SmartChartPageProps } from '../common'
import { fetchStatisticAddressBalanceRank } from '../../../service/http/fetcher'
import { ChartCachedKeys } from '../../../constants/cache'
import { useAdaptPCEllipsis } from '../../../utils/hook'

const getAddressWithRanking = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], ranking: string) => {
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const getOption = (
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
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 35)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              i18n.t('statistic.address'),
            )} ${getAdaptAddressText(getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name))}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('statistic.balance'))} \
          ${localeNumberString(dataList[0].data)} ${i18n.t('common.ckb_unit')}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('statistic.rank'))} ${
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
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.rank'),
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
        name: isMobile || isThumbnail ? '' : `${i18n.t('statistic.balance_ranking')} ${i18n.t('statistic.log')}`,
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
        name: i18n.t('statistic.balance_ranking'),
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

const fetchStatisticAddressBalanceRanks = async () => {
  const resp = await fetchStatisticAddressBalanceRank()
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
  const clickEvent = useCallback(
    (param: any) => {
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
  const getEChartOption: SmartChartPageProps<State.StatisticAddressBalanceRank>['getEChartOption'] = useCallback(
    (...args) => getOption(...args, address => adaptPCEllipsis(address, 6)),
    [adaptPCEllipsis],
  )

  return (
    <SmartChartPage
      title={t('statistic.balance_ranking')}
      description={t('statistic.balance_ranking_description')}
      isThumbnail={isThumbnail}
      chartProps={{ clickEvent: !isThumbnail ? clickEvent : undefined }}
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
