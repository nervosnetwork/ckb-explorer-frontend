import React, { useEffect, useCallback } from 'react'
import 'default-passive-events'
import { getStatisticAddressBalanceRank } from '../../../service/app/charts/activities'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { isMobile } from '../../../utils/screen'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { adaptPCEllipsis } from '../../../utils/string'
import browserHistory from '../../../routes/history'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
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
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getAddressWithRanking = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], ranking: string) => {
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const getOption = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '60px' : '35px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.address'))} ${adaptPCEllipsis(
          getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name),
          6,
          60,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.balance'))} ${localeNumberString(
          dataList[0].data,
        )} ${i18n.t('common.ckb_unit')}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.rank'))} ${dataList[0].name}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.rank'),
        nameLocation: 'middle',
        nameGap: '30',
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
        yAxisIndex: '0',
        barWidth: '8',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAddressBalanceRanks.map(data => shannonToCkb(data.balance)),
      },
    ],
  }
}

export const AddressBalanceRankChart = ({
  statisticAddressBalanceRanks,
  clickEvent,
  isThumbnail = false,
}: {
  statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[]
  clickEvent: any
  isThumbnail?: boolean
}) => {
  if (!statisticAddressBalanceRanks || statisticAddressBalanceRanks.length === 0) {
    return <ChartLoading show={statisticAddressBalanceRanks === undefined} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticAddressBalanceRanks, isThumbnail)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

export const initStatisticAddressBalanceRanks = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticAddressBalanceRank,
    payload: {
      statisticAddressBalanceRanks: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticAddressBalanceRanks } = useAppState()

  const clickEvent = useCallback(
    (param: any) => {
      if (param && param.name) {
        browserHistory.push(`/address/${getAddressWithRanking(statisticAddressBalanceRanks, param.name)}`)
      }
    },
    [statisticAddressBalanceRanks],
  )

  useEffect(() => {
    initStatisticAddressBalanceRanks(dispatch)
    getStatisticAddressBalanceRank(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.balance_ranking')}>
      <AddressBalanceRankChart statisticAddressBalanceRanks={statisticAddressBalanceRanks} clickEvent={clickEvent} />
    </ChartPage>
  )
}
