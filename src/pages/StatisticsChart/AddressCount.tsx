import React, { useEffect, useContext } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticAddressCount } from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel, LoadingPanel } from './styled'
import { parseDateNoTime } from '../../utils/date'

const colors = ['#3182bd']

const getOption = (statisticAddressCounts: State.StatisticAddressCount[]) => {
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
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('statistic.address_count'))} ${handleAxis(
          dataList[0].data,
        )}</div>`
        return result
      },
    },
    legend: {
      data: [i18n.t('statistic.address_count')],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: statisticAddressCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: i18n.t('statistic.address_count'),
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
        name: i18n.t('statistic.address_count'),
        type: 'line',
        yAxisIndex: '0',
        symbol: 'none',
        data: statisticAddressCounts.map(data => new BigNumber(data.addressesCount).toNumber()),
      },
    ],
  }
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticAddressCounts } = useContext(AppContext)

  useEffect(() => {
    getStatisticAddressCount(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{i18n.t('statistic.address_count')}</ChartTitle>
      {statisticAddressCounts.length > 0 ? (
        <ChartPanel>
          <ReactEchartsCore
            echarts={echarts}
            option={getOption(statisticAddressCounts)}
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
