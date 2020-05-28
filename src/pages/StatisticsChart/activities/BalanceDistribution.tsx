import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticBalanceDistribution } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis, handleLogGroupAxis } from '../../../utils/chart'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
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
  right: '2%',
  bottom: '6%',
  containLabel: true,
}

const getOption = (
  statisticBalanceDistributions: State.StatisticBalanceDistribution[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 270 : 110)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(
              i18n.t('statistic.addresses_balance'),
            )} ${handleLogGroupAxis(
              new BigNumber(dataList[0].name),
              dataList[0].dataIndex === statisticBalanceDistributions.length - 1 ? '+' : '',
            )} ${i18n.t('common.ckb_unit')}</div>`
            if (dataList[0]) {
              result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
                i18n.t('statistic.addresses_balance_group'),
              )} ${localeNumberString(dataList[0].data)}</div>`
            }
            if (dataList[1]) {
              result += `<div>${tooltipColor(ChartColors[1])}${widthSpan(
                i18n.t('statistic.addresses_below_specific_balance'),
              )} ${localeNumberString(dataList[1].data)}</div>`
            }
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          data: [
            { name: i18n.t('block.addresses_balance_group') },
            { name: i18n.t('block.addresses_below_specific_balance') },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
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
            `${handleLogGroupAxis(
              new BigNumber(value),
              index === statisticBalanceDistributions.length - 1 ? '+' : '',
            )}`,
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
            color: ChartColors[0],
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
            color: ChartColors[1],
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
          color: '#85bae0',
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
  }
}

export const BalanceDistributionChart = ({
  statisticBalanceDistributions,
  isThumbnail = false,
}: {
  statisticBalanceDistributions: State.StatisticBalanceDistribution[]
  isThumbnail?: boolean
}) => {
  if (!statisticBalanceDistributions || statisticBalanceDistributions.length === 0) {
    return <ChartLoading show={statisticBalanceDistributions === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticBalanceDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticBalanceDistribution = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticBalanceDistribution,
    payload: {
      statisticBalanceDistributions: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticBalanceDistributions } = useAppState()

  useEffect(() => {
    initStatisticBalanceDistribution(dispatch)
    getStatisticBalanceDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.balance_distribution')}>
      <BalanceDistributionChart statisticBalanceDistributions={statisticBalanceDistributions} />
    </ChartPage>
  )
}
