import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficulty } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { handleDifficulty } from '../../../utils/number'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

const gridThumbnail = {
  left: '4%',
  right: '10%',
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

const getOption = (statisticDifficulties: State.StatisticDifficulty[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '70px' : '35px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
          dataList[0].data,
        )}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticDifficulties.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
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
    ],
    series: [
      {
        name: i18n.t('block.difficulty'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficulties.map(data => new BigNumber(data.avgDifficulty).toNumber()),
      },
    ],
  }
}

export const DifficultyChart = ({
  statisticDifficulties,
  isThumbnail = false,
}: {
  statisticDifficulties: State.StatisticDifficulty[]
  isThumbnail?: boolean
}) => {
  if (!statisticDifficulties || statisticDifficulties.length === 0) {
    return <ChartLoading show={statisticDifficulties === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticDifficulties, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticDifficulty = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticDifficulty,
    payload: {
      statisticDifficulties: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficulties } = useAppState()

  useEffect(() => {
    initStatisticDifficulty(dispatch)
    getStatisticDifficulty(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('block.difficulty')}>
      <DifficultyChart statisticDifficulties={statisticDifficulties} />
    </ChartPage>
  )
}
