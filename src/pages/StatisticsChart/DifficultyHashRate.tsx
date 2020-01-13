import React, { useEffect, useContext, useMemo } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
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

const getOption = (statisticDifficultyHashRates: State.StatisticDifficultyHashRate[], isThumbnail = false) => {
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
          result += `<div>${colorSpan(colors[1])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
            dataList[1].data,
          )}</div>`
        }
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('block.difficulty'), i18n.t('block.hash_rate_hps')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: statisticDifficultyHashRates.map(data => data.epochNumber),
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
        name: isMobile() || isThumbnail ? '' : i18n.t('block.hash_rate_hps'),
        type: 'value',
        splitLine: {
          show: false,
        },
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
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.hash_rate_hps'),
        type: 'line',
        yAxisIndex: '1',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.hashRate).toNumber()),
      },
    ],
  }
}

export const DifficultyHashRateChart = ({
  statisticDifficultyHashRates,
  isThumbnail = false,
}: {
  statisticDifficultyHashRates: State.StatisticDifficultyHashRate[]
  isThumbnail?: boolean
}) => {
  if (statisticDifficultyHashRates.length === 0) {
    return isThumbnail ? (
      <ChartCardLoadingPanel>
        <SmallLoading />
      </ChartCardLoadingPanel>
    ) : null
  }
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption(statisticDifficultyHashRates, isThumbnail)}
      notMerge
      lazyUpdate
      style={{
        height: isThumbnail ? '230px' : '70vh',
      }}
    />
  )
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticDifficultyHashRates } = useContext(AppContext)

  useEffect(() => {
    getStatisticDifficultyHashRate(dispatch)
  }, [dispatch])

  return useMemo(() => {
    return (
      <Content>
        <ChartTitle>{`${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`}</ChartTitle>
        {statisticDifficultyHashRates.length > 0 ? (
          <ChartPanel>
            <DifficultyHashRateChart statisticDifficultyHashRates={statisticDifficultyHashRates} />
          </ChartPanel>
        ) : (
          <LoadingPanel>
            <Loading show />
          </LoadingPanel>
        )}
      </Content>
    )
  }, [statisticDifficultyHashRates])
}
