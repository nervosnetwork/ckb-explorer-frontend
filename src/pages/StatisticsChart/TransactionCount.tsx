import React, { useEffect, useContext } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticTransactionCount } from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel, LoadingPanel } from './styled'
import { parseDateNoTime } from '../../utils/date'
import { isMobile } from '../../utils/screen'

const colors = ['#3182bd']

const getOption = (statisticTransactionCounts: State.StatisticTransactionCount[]) => {
  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:120px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('statistic.transaction_count'))} ${handleAxis(
          dataList[0].data,
        )}</div>`
        return result
      },
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: statisticTransactionCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() ? '' : i18n.t('statistic.transaction_count'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.transaction_count'),
        type: 'line',
        yAxisIndex: '0',
        symbol: 'circle',
        symbolSize: 3,
        data: statisticTransactionCounts.map(data => new BigNumber(data.transactionsCount).toNumber()),
      },
    ],
  }
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticTransactionCounts } = useContext(AppContext)

  useEffect(() => {
    getStatisticTransactionCount(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{i18n.t('statistic.transaction_count')}</ChartTitle>
      {statisticTransactionCounts.length > 0 ? (
        <ChartPanel>
          <ReactEchartsCore
            echarts={echarts}
            option={getOption(statisticTransactionCounts)}
            notMerge
            lazyUpdate
            style={{
              height: '70vh',
            }}
          />
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <Loading show />
        </LoadingPanel>
      )}
    </Content>
  )
}
