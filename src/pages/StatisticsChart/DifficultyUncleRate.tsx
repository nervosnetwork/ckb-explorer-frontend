import React, { useEffect, useMemo } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticDifficultyUncleRate } from '../../service/app/statisticsChart'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { handleAxis } from '../../utils/chart'
import { handleDifficulty } from '../../utils/number'
import { ChartTitle, ChartPanel, LoadingPanel, ChartCardLoadingPanel } from './styled'
import { isMobile } from '../../utils/screen'
import SmallLoading from '../../components/Loading/SmallLoading'

const colors = ['#3182bd', '#66CC99']

const gridThumbnail = {
  left: '4%',
  right: '4%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true,
}

const getOption = (statisticChartData: State.StatisticDifficultyUncleRate[], isThumbnail = false) => {
  return {
    color: colors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:100px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('block.epoch_number'))} ${handleAxis(
          dataList[0].name,
          1,
        )}</div>`
        if (dataList[0]) {
          result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
            dataList[0].data,
          )}</div>`
        }
        if (dataList[1]) {
          result += `<div>${colorSpan(colors[1])}${widthSpan(i18n.t('block.uncle_rate'))} ${dataList[1].data}%</div>`
        }
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('block.difficulty'), i18n.t('block.uncle_rate')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: statisticChartData.map(data => data.epochNumber),
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('block.difficulty'),
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
        name: isMobile() || isThumbnail ? '' : i18n.t('block.uncle_rate'),
        type: 'value',
        scale: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('block.difficulty'),
        type: 'line',
        step: 'start',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticChartData.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.uncle_rate'),
        type: 'line',
        yAxisIndex: '1',
        symbol: 'circle',
        symbolSize: 3,
        data: statisticChartData.map(data => (Number(data.uncleRate) * 100).toFixed(2)),
        markLine: {
          symbol: 'none',
          data: [
            {
              name: i18n.t('block.uncle_rate_target'),
              yAxis: '2.5',
            },
          ],
          label: {
            formatter: (params: any) => `${params.value}%`,
          },
        },
      },
    ],
  }
}

export const DifficultyUncleRateChart = ({
  statisticDifficultyUncleRates,
  isThumbnail = false,
}: {
  statisticDifficultyUncleRates: State.StatisticDifficultyUncleRate[]
  isThumbnail?: boolean
}) => {
  if (statisticDifficultyUncleRates.length === 0) {
    return isThumbnail ? (
      <ChartCardLoadingPanel>
        <SmallLoading />
      </ChartCardLoadingPanel>
    ) : null
  }
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption(statisticDifficultyUncleRates, isThumbnail)}
      notMerge
      lazyUpdate
      style={{
        height: isThumbnail ? '230px' : '70vh',
      }}
    />
  )
}

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyUncleRates } = useAppState()

  useEffect(() => {
    getStatisticDifficultyUncleRate(dispatch)
  }, [dispatch])

  return useMemo(() => {
    return (
      <Content>
        <ChartTitle>{`${i18n.t('block.difficulty')} & ${i18n.t('block.uncle_rate')}`}</ChartTitle>
        {statisticDifficultyUncleRates.length > 0 ? (
          <ChartPanel>
            <DifficultyUncleRateChart statisticDifficultyUncleRates={statisticDifficultyUncleRates} />
          </ChartPanel>
        ) : (
          <LoadingPanel>
            <Loading show />
          </LoadingPanel>
        )}
      </Content>
    )
  }, [statisticDifficultyUncleRates])
}
