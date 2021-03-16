import React, { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router'
import { getStatisticAddressBalanceRank } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { isMobile } from '../../../utils/screen'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { adaptPCEllipsis } from '../../../utils/string'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { ChartColors } from '../../../utils/const'

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
  top: isMobile() ? '3%' : '8%',
  bottom: '5%',
  containLabel: true,
}

const getAddressWithRanking = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], ranking: string) => {
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const getOption = (
  statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 35)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.address'))} ${adaptPCEllipsis(
              getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name),
              6,
              60,
            )}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
              i18n.t('statistic.balance'),
            )} ${localeNumberString(dataList[0].data)} ${i18n.t('common.ckb_unit')}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.rank'))} ${
              dataList[0].name
            }</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.rank'),
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
        name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.balance_ranking')} ${i18n.t('statistic.log')}`,
        type: 'log',
        logBase: 10,
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => {
            return `${handleAxis(value)}B`
          },
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

export const AddressBalanceRankChart = ({
  clickEvent,
  isThumbnail = false,
}: {
  clickEvent: any
  isThumbnail?: boolean
}) => {
  const { statisticAddressBalanceRanks, statisticAddressBalanceRanksFetchEnd } = useAppState()
  if (!statisticAddressBalanceRanksFetchEnd || statisticAddressBalanceRanks.length === 0) {
    return <ChartLoading show={!statisticAddressBalanceRanksFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticAddressBalanceRanks, isThumbnail)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

const toCSV = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[]) => {
  return statisticAddressBalanceRanks
    ? statisticAddressBalanceRanks.map(data => [data.ranking, shannonToCkbDecimal(data.balance, 8)])
    : []
}

export default () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { statisticAddressBalanceRanks } = useAppState()

  const clickEvent = useCallback(
    (param: any) => {
      if (param && param.name) {
        history.push(`/address/${getAddressWithRanking(statisticAddressBalanceRanks, param.name)}`)
      }
    },
    [statisticAddressBalanceRanks, history],
  )

  useEffect(() => {
    getStatisticAddressBalanceRank(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.balance_ranking')}
      description={i18n.t('statistic.balance_ranking_description')}
      data={toCSV(statisticAddressBalanceRanks)}
    >
      <AddressBalanceRankChart clickEvent={clickEvent} />
    </ChartPage>
  )
}
