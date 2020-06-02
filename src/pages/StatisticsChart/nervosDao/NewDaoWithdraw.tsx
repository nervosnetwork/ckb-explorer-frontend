import React, { useEffect } from 'react'
import { getStatisticNewDaoWithdraw } from '../../../service/app/charts/nervosDao'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { ChartNotePanel } from '../common/styled'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { shannonToCkb } from '../../../utils/util'
import { ChartColors } from '../../../utils/const'
import { isMainnet } from '../../../utils/chain'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
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
  left: '4%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticNewDaoWithdraw: State.StatisticNewDaoWithdraw[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 195)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            if (dataList[0].data) {
              result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
                i18n.t('statistic.new_dao_withdraw'),
              )} ${handleAxis(dataList[0].data, 2)}</div>`
            }
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
        data: statisticNewDaoWithdraw.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.new_dao_withdraw'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${handleAxis(value)}B`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.new_dao_withdraw'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticNewDaoWithdraw.map(data => Number(shannonToCkb(data.dailyDaoWithdraw)).toFixed(0)),
      },
    ],
  }
}

export const NewDaoWithdrawChart = ({
  statisticNewDaoWithdraw,
  isThumbnail = false,
}: {
  statisticNewDaoWithdraw: State.StatisticNewDaoWithdraw[]
  isThumbnail?: boolean
}) => {
  if (!statisticNewDaoWithdraw || statisticNewDaoWithdraw.length === 0) {
    return <ChartLoading show={statisticNewDaoWithdraw === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticNewDaoWithdraw, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticNewDaoWithdraw = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticNewDaoWithdraw,
    payload: {
      statisticNewDaoWithdraw: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticNewDaoWithdraw } = useAppState()

  useEffect(() => {
    initStatisticNewDaoWithdraw(dispatch)
    getStatisticNewDaoWithdraw(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.new_dao_withdraw')}>
      <NewDaoWithdrawChart statisticNewDaoWithdraw={statisticNewDaoWithdraw} />
      {isMainnet() && <ChartNotePanel>{`${i18n.t('common.note')}1MB = 1,000,000 CKBytes`}</ChartNotePanel>}
    </ChartPage>
  )
}
