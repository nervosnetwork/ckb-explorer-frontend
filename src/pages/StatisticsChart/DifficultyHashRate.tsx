import React, { useEffect } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticDifficultyHashRate } from '../../service/app/statisticsChart'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { handleAxis } from '../../utils/chart'
import { handleDifficulty, handleHashRate } from '../../utils/number'
import { ChartTitle, ChartPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { ChartColors } from '../../utils/const'
import { ChartLoading, ReactChartCore } from './ChartComponents'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'

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
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticDifficultyHashRates: State.StatisticDifficultyHashRate[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:100px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('block.epoch'))} ${handleAxis(
          dataList[0].name,
          1,
          true,
        )}</div>`
        if (dataList[0]) {
          result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
            dataList[0].data,
          )}</div>`
        }
        if (dataList[1]) {
          result += `<div>${colorSpan(ChartColors[1])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
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
        name: isMobile() || isThumbnail ? '' : i18n.t('block.epoch'),
        nameLocation: 'middle',
        nameGap: '30',
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
            color: ChartColors[0],
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
        name: i18n.t('block.difficulty'),
        type: 'line',
        step: 'start',
        areaStyle: {
          color: '#85bae0',
        },
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toNumber()),
      },
      {
        name: i18n.t('block.hash_rate_hps'),
        type: 'line',
        smooth: true,
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
  if (!statisticDifficultyHashRates || statisticDifficultyHashRates.length === 0) {
    return <ChartLoading show={statisticDifficultyHashRates === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticDifficultyHashRates, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticDifficultyHashRate,
    payload: {
      statisticDifficultyHashRates: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficultyHashRates } = useAppState()

  useEffect(() => {
    initStatisticDifficultyHashRate(dispatch)
    getStatisticDifficultyHashRate(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{`${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`}</ChartTitle>
      <ChartPanel>
        <DifficultyHashRateChart statisticDifficultyHashRates={statisticDifficultyHashRates} />
      </ChartPanel>
    </Content>
  )
}
