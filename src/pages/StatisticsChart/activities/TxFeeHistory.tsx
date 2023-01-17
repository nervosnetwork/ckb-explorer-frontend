import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticTxFeeHistory } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { useIsMobile } from '../../../utils/hook'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { shannonToCkbDecimal } from '../../../utils/util'
import { isMainnet } from '../../../utils/chain'

const getOption = (
  statisticTxFeeHistories: State.StatisticTransactionFee[],
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
    left: '6%',
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
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 145 : 90)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
              dataList[0].data[0]
            }</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('statistic.tx_fee'))} ${handleAxis(
              dataList[0].data[1],
            )}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : `${i18n.t('statistic.tx_fee')} ${i18n.t('statistic.log')}`,
        type: isMainnet() ? 'log' : 'value',
        logBase: 10,
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
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
      },
    ],
    dataset: {
      source: statisticTxFeeHistories.map(d => [
        parseDateNoTime(d.createdAtUnixtimestamp),
        shannonToCkbDecimal(d.totalTxFee, 4),
      ]),
    },
  }
}

export const TxFeeHistoryChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const isMobile = useIsMobile()
  const { statisticTxFeeHistories, statisticTxFeeHistoriesFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticTxFeeHistories, app.chartColor, isMobile, isThumbnail),
    [statisticTxFeeHistories, app.chartColor, isMobile, isThumbnail],
  )
  if (!statisticTxFeeHistoriesFetchEnd || statisticTxFeeHistories.length === 0) {
    return <ChartLoading show={!statisticTxFeeHistoriesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticTxFeeHistories: State.StatisticTransactionFee[]) =>
  statisticTxFeeHistories
    ? statisticTxFeeHistories.map(data => [data.createdAtUnixtimestamp, shannonToCkbDecimal(data.totalTxFee, 8)])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticTxFeeHistories } = useAppState()

  useEffect(() => {
    getStatisticTxFeeHistory(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.tx_fee_history')}
      description={i18n.t('statistic.tx_fee_description')}
      data={toCSV(statisticTxFeeHistories)}
    >
      <TxFeeHistoryChart />
    </ChartPage>
  )
}
