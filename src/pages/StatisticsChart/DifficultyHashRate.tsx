import React, { useEffect, useContext } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticDifficultyHashRate } from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { handleAxis } from '../../utils/chart'
import { handleDifficulty, handleHashRate } from '../../utils/number'
import { ChartTitle, ChartPanel, LoadingPanel } from './styled'

const colors = ['#3182bd', '#66CC99']

const getOption = (statisticChartData: State.StatisticDifficultyHashRate[]) => {
  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:100px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('block.block_number'))} ${dataList[0].name}</div>`
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
          dataList[0].data,
        )}</div>`
        result += `<div>${colorSpan(colors[1])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
          dataList[1].data,
        )}</div>`
        return result
      },
    },
    legend: {
      data: [i18n.t('block.difficulty'), i18n.t('block.hash_rate_hps')],
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
        data: statisticChartData.map(data => data.blockNumber),
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: i18n.t('block.difficulty'),
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
      {
        position: 'right',
        name: i18n.t('block.hash_rate_hps'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('block.difficulty'),
        type: 'line',
        yAxisIndex: '0',
        symbol: 'none',
        data: statisticChartData.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.hash_rate_hps'),
        type: 'line',
        yAxisIndex: '1',
        symbol: 'none',
        data: statisticChartData.map(data => new BigNumber(data.hashRate).toNumber()),
      },
    ],
  }
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticDifficultyHashRates } = useContext(AppContext)

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{`${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`}</ChartTitle>
      {statisticDifficultyHashRates.length > 0 ? (
        <ChartPanel>
          <ReactEchartsCore
            echarts={echarts}
            option={getOption(statisticDifficultyHashRates)}
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
