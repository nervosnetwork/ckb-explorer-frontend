import React, { useEffect } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticAddressCount } from '../../service/app/statisticsChart'
import i18n from '../../utils/i18n'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel } from './styled'
import { parseDateNoTime } from '../../utils/date'
import { isMobile } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers'
import { ChartLoading, ReactChartCore } from './ChartComponents'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'
import { ChartColors } from '../../utils/const'

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

const getOption = (statisticAddressCounts: State.StatisticAddressCount[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:120px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.address_count'))} ${handleAxis(
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
        data: statisticAddressCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.address_count'),
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
        name: i18n.t('statistic.address_count'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAddressCounts.map(data => new BigNumber(data.addressesCount).toNumber()),
      },
    ],
  }
}

export const initStatisticAddressCount = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticAddressCount,
    payload: {
      statisticAddressCounts: undefined,
    },
  })
}

export const AddressCountChart = ({
  statisticAddressCounts,
  isThumbnail = false,
}: {
  statisticAddressCounts?: State.StatisticAddressCount[]
  isThumbnail?: boolean
}) => {
  if (!statisticAddressCounts || statisticAddressCounts.length === 0) {
    return <ChartLoading show={statisticAddressCounts === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticAddressCounts, isThumbnail)} isThumbnail={isThumbnail} />
}

export default () => {
  const dispatch = useDispatch()
  const { statisticAddressCounts } = useAppState()

  useEffect(() => {
    initStatisticAddressCount(dispatch)
    getStatisticAddressCount(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{i18n.t('statistic.address_count')}</ChartTitle>
      <ChartPanel>
        <AddressCountChart statisticAddressCounts={statisticAddressCounts} />
      </ChartPanel>
    </Content>
  )
}
