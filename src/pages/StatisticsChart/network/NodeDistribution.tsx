import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticNodeDistribution } from '../../../service/app/charts/network'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '4%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticNodeDistributions: State.StatisticNodeDistribution[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'item',
      formatter: (data: any) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '95px' : '60px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.city'))} ${data.data.name}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.node_count'))} ${localeNumberString(
          data.data.value[2],
        )}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    geo: {
      name: 'World',
      type: 'map',
      map: 'world',
      roam: true,
      left: '5%',
      right: '5%',
      top: 20,
      bottom: 20,
      scaleLimit: {
        min: 1,
        max: isThumbnail ? 1 : 3,
      },
      label: {
        emphasis: {
          show: true,
          color: ChartColors[0],
        },
      },
      itemStyle: {
        normal: {
          areaColor: '#999999',
          borderColor: '#222222',
        },
        emphasis: {
          areaColor: '#555555',
          borderWidth: 0.2,
        },
      },
    },
    series: [
      {
        name: i18n.t('statistic.node_count'),
        type: 'scatter',
        coordinateSystem: 'geo',
        data: statisticNodeDistributions,
        symbolSize: (value: number[]) => {
          if (value[2] < 5) return 8
          else if (value[2] < 10) return 15
          else return value[2] * 1.5
        },
        encode: {
          value: 2,
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false,
        },
        itemStyle: {
          borderColor: '#fff',
          color: ChartColors[0],
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
    ],
  }
}

export const NodeDistributionChart = ({
  statisticNodeDistributions,
  isThumbnail = false,
}: {
  statisticNodeDistributions: State.StatisticNodeDistribution[]
  isThumbnail?: boolean
}) => {
  if (!statisticNodeDistributions || statisticNodeDistributions.length === 0) {
    return <ChartLoading show={statisticNodeDistributions === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticNodeDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticNodeDistribution = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticNodeDistribution,
    payload: {
      statisticNodeDistributions: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticNodeDistributions } = useAppState()

  useEffect(() => {
    initStatisticNodeDistribution(dispatch)
    getStatisticNodeDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.node_distribution')}>
      <NodeDistributionChart statisticNodeDistributions={statisticNodeDistributions} />
    </ChartPage>
  )
}
