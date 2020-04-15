import React, { useEffect } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticBalanceDistribution } from '../../service/app/statisticsChart'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n, { currentLanguage } from '../../utils/i18n'
import { handleAxis, handleGroupAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { ChartColors } from '../../utils/const'
import { ChartLoading, ReactChartCore } from './ChartComponents'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'
import { localeNumberString } from '../../utils/number'

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

const getOption = (statisticBalanceDistributions: State.StatisticBalanceDistribution[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? 280 : 110}px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.addresses_balance'))} ${handleGroupAxis(
          new BigNumber(dataList[0].name),
          dataList[0].dataIndex === statisticBalanceDistributions.length - 1 ? '+' : '',
        )} ${i18n.t('common.ckb_unit')}</div>`
        if (dataList[0]) {
          result += `<div>${colorSpan(ChartColors[0])}${widthSpan(
            i18n.t('statistic.addresses_balance_group'),
          )} ${localeNumberString(dataList[0].data)}</div>`
        }
        if (dataList[1]) {
          result += `<div>${colorSpan(ChartColors[1])}${widthSpan(
            i18n.t('statistic.addresses_below_specific_balance'),
          )} ${localeNumberString(dataList[1].data)}</div>`
        }
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('block.addresses_balance_group'), i18n.t('block.addresses_below_specific_balance')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.addresses_balance')} (CKB)`,
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: true,
        data: statisticBalanceDistributions.map(data => data.balance),
        axisLabel: {
          formatter: (value: string, index: number) =>
            `${handleGroupAxis(new BigNumber(value), index === statisticBalanceDistributions.length - 1 ? '+' : '')}`,
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
        yAxisIndex: '0',
        barWidth: isMobile() || isThumbnail ? 20 : 50,
        data: statisticBalanceDistributions.map(data => new BigNumber(data.addresses).toNumber()),
      },
      {
        name: i18n.t('statistic.addresses_below_specific_balance'),
        type: 'line',
        yAxisIndex: '1',
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
    <Content>
      <ChartTitle>{i18n.t('statistic.balance_distribution')}</ChartTitle>
      <ChartPanel>
        <BalanceDistributionChart statisticBalanceDistributions={statisticBalanceDistributions} />
      </ChartPanel>
    </Content>
  )
}
