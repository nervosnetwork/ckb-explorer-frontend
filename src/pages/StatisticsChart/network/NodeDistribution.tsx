import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipWidth } from '../common'
import { getStatisticNodeDistribution } from '../../../service/app/charts/network'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '0%',
  right: '0%',
  top: '5%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticNodeDistributions: State.StatisticNodeDistribution[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'item',
          formatter: (data: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 95 : 60)
            const widthValueSpan = (value: string) =>
              `<span style="display:inline-block;color:#AACFE9;">${value}</span>`
            let result = `<div>${widthSpan(i18n.t('statistic.city'))} ${widthValueSpan(data.data.name)}</div>`
            result += `<div>${widthSpan(i18n.t('statistic.node_count'))} ${widthValueSpan(
              localeNumberString(data.data.value[2]),
            )}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    geo: {
      name: 'World',
      type: 'map',
      map: 'world',
      roam: true,
      left: '3%',
      right: '3%',
      top: 20,
      bottom: 20,
      scaleLimit: {
        min: 1,
        max: 1,
      },
      label: {
        emphasis: {
          show: !isThumbnail,
          color: '#575757',
          fontFamily: 'Lato',
          fontSize: 12,
        },
      },
      itemStyle: {
        normal: {
          areaColor: '#EEEEEE',
          borderColor: '#979797',
        },
        emphasis: {
          areaColor: '#D8D8D8',
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
          borderColor: '#228159',
          borderWidth: 0.5,
          color: '#3CC68A',
          capacity: 0.6,
        },
        emphasis: {
          label: {
            show: !isThumbnail,
            fontFamily: 'Lato',
          },
          itemStyle: {
            borderColor: '#3281BD',
            borderWidth: 1,
            color: '#AACFE9',
            opacity: 0.8,
          },
        },
      },
    ],
  }
}

export const NodeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticNodeDistributions, statisticNodeDistributionsFetchEnd } = useAppState()
  if (!statisticNodeDistributionsFetchEnd || statisticNodeDistributions.length === 0) {
    return <ChartLoading show={!statisticNodeDistributionsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticNodeDistributions, isThumbnail)} isThumbnail={isThumbnail} />
}

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    getStatisticNodeDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.node_distribution')}>
      <NodeDistributionChart />
    </ChartPage>
  )
}
