import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticOccupiedCapacity } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { shannonToCkb } from '../../../utils/util'

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

const getOption = (
  statisticOccupiedCapacities: State.StatisticOccupiedCapacity[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 170 : 165)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
              `${i18n.t('statistic.occupied_capacity')} (CKB)`,
            )} ${handleAxis(dataList[0].data)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticOccupiedCapacities.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.occupied_capacity')} (CKB)`,
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
        name: i18n.t('statistic.occupied_capacity'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticOccupiedCapacities.map(data => shannonToCkb(data.occupiedCapacity)),
      },
    ],
  }
}

export const OccupiedCapacityChart = ({
  statisticOccupiedCapacities,
  isThumbnail = false,
}: {
  statisticOccupiedCapacities: State.StatisticOccupiedCapacity[]
  isThumbnail?: boolean
}) => {
  if (!statisticOccupiedCapacities || statisticOccupiedCapacities.length === 0) {
    return <ChartLoading show={statisticOccupiedCapacities === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticOccupiedCapacities, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticOccupiedCapacity = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticOccupiedCapacity,
    payload: {
      statisticOccupiedCapacities: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticOccupiedCapacities } = useAppState()

  useEffect(() => {
    initStatisticOccupiedCapacity(dispatch)
    getStatisticOccupiedCapacity(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.occupied_capacity')}>
      <OccupiedCapacityChart statisticOccupiedCapacities={statisticOccupiedCapacities} />
    </ChartPage>
  )
}
