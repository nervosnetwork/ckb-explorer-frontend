import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, assertIsArray, parseNumericAbbr } from '../../../utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage, SmartChartPageProps } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useAdaptPCEllipsis } from '../../../hooks'
import { ChartColorConfig } from '../../../constants/common'
import EllipsisMiddle from '../../../components/EllipsisMiddle'
import { Link } from '../../../components/Link'
import styles from './addressRankingBalance.module.scss'
import Tooltip from '../../../components/Tooltip'

const getAddressWithRanking = (statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[], ranking?: string) => {
  if (!ranking) return ''
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const useOption = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return (
    statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[],
    chartColor: ChartColorConfig,
    isMobile: boolean,
    isThumbnail = false,
    getAdaptAddressText: (address: string) => string,
  ): EChartsOption => {
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
            ${localeNumberString(dataList[0].data as number)} ${t('common.ckb_unit')}</div>`
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
            formatter: (value: number) => `${parseNumericAbbr(value)}`,
          },
        },
      ],
      series: [
        {
          name: t('statistic.balance_ranking'),
          type: 'bar',
          yAxisIndex: 0,
          barWidth: 8,
          data: statisticAddressBalanceRanks.map(data => shannonToCkb(data.balance)),
        },
      ],
    }
  }
}

const toCSV = (statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[]) =>
  statisticAddressBalanceRanks
    ? statisticAddressBalanceRanks.map(data => [data.ranking, shannonToCkbDecimal(data.balance, 8)])
    : []

export const AddressBalanceRankChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const history = useHistory()
  const [t, { language }] = useTranslation()

  const [statisticAddressBalanceRanks, setStatisticAddressBalanceRanks] = useState<ChartItem.AddressBalanceRank[]>([])
  const handleClick = useCallback(
    (param: CallbackDataParams) => {
      if (param && param.name && statisticAddressBalanceRanks.length > 0) {
        const address = getAddressWithRanking(statisticAddressBalanceRanks, param.name)
        if (address) {
          history.push(`/${language}/address/${address}`)
        }
      }
    },
    [statisticAddressBalanceRanks, history, language],
  )

  const adaptPCEllipsis = useAdaptPCEllipsis(60)
  const parseOption = useOption()
  const getEChartOption: SmartChartPageProps<ChartItem.AddressBalanceRank>['getEChartOption'] = useCallback(
    (...args) => parseOption(...args, address => adaptPCEllipsis(address, 6)),
    [adaptPCEllipsis, parseOption],
  )

  if (isThumbnail) {
    return (
      <SmartChartPage
        title={t('statistic.top_50_holders')}
        description={t('statistic.balance_ranking_description')}
        isThumbnail={isThumbnail}
        chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
        fetchData={explorerService.api.fetchStatisticAddressBalanceRank}
        onFetched={setStatisticAddressBalanceRanks}
        getEChartOption={getEChartOption}
        toCSV={toCSV}
        queryKey="fetchStatisticAddressBalanceRank"
      />
    )
  }

  return (
    <>
      <SmartChartPage
        title={t('statistic.top_50_holders')}
        description={t('statistic.balance_ranking_description')}
        isThumbnail={isThumbnail}
        chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
        fetchData={explorerService.api.fetchStatisticAddressBalanceRank}
        onFetched={setStatisticAddressBalanceRanks}
        getEChartOption={getEChartOption}
        toCSV={toCSV}
        queryKey="fetchStatisticAddressBalanceRank"
      />
      <div className={styles.list}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>{t('statistic.address')}</th>
              <th>{`${t('statistic.balance')}(CKB)`}</th>
            </tr>
          </thead>
          <tbody>
            {statisticAddressBalanceRanks.map(data => {
              const b = shannonToCkbDecimal(data.balance, 8)
              const r = Math.round(b)

              return (
                <tr key={data.address}>
                  <td>{data.ranking}</td>
                  <td className={styles.address}>
                    <Link className="monospace" to={`/address/${data.address}`}>
                      <EllipsisMiddle>{data.address}</EllipsisMiddle>
                    </Link>
                  </td>
                  <td>
                    {r === b ? null : (
                      <Tooltip trigger={<span className={styles.roundSign}>~</span>} placement="top">
                        {t('statistic.rounded')}
                      </Tooltip>
                    )}
                    {localeNumberString(r)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AddressBalanceRankChart
