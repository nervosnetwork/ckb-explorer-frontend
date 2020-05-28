import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticTxFeeHistory } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { shannonToCkbDecimal } from '../../../utils/util'
import { isMainnet } from '../../../utils/chain'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '6%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticTxFeeHistories: State.StatisticTransactionFee[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 145 : 90)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.tx_fee'))} ${handleAxis(
              dataList[0].data,
            )}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticTxFeeHistories.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.tx_fee')} ${i18n.t('statistic.log')}`,
        type: isMainnet() ? 'log' : 'value',
        logBase: 10,
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.tx_fee'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticTxFeeHistories.map(data => shannonToCkbDecimal(data.totalTxFee, 4)),
      },
    ],
  }
}

export const TxFeeHistoryChart = ({
  statisticTxFeeHistories,
  isThumbnail = false,
}: {
  statisticTxFeeHistories: State.StatisticTransactionFee[]
  isThumbnail?: boolean
}) => {
  if (!statisticTxFeeHistories || statisticTxFeeHistories.length === 0) {
    return <ChartLoading show={statisticTxFeeHistories === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticTxFeeHistories, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticTxFeeHistory = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticTxFeeHistory,
    payload: {
      statisticTxFeeHistories: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticTxFeeHistories } = useAppState()

  useEffect(() => {
    initStatisticTxFeeHistory(dispatch)
    getStatisticTxFeeHistory(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.tx_fee_history')}>
      <TxFeeHistoryChart statisticTxFeeHistories={statisticTxFeeHistories} />
    </ChartPage>
  )
}
