import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticAddressCount } from '../../../service/app/charts/activities'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '3%',
  top: isMobile() ? '3%' : '8%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticAddressCounts: State.StatisticAddressCount[],
  chartColor: State.App['chartColor'],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: chartColor.colors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 155 : 110)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${
            dataList[0].data[0]
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}\
          ${widthSpan(i18n.t('statistic.address_count'))} ${handleAxis(dataList[0].data[1])}</div>`
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.address_count'),
      type: 'value',
      scale: true,
      nameTextStyle: {
        align: 'left',
      },
      axisLine: {
        lineStyle: {
          color: chartColor.colors[0],
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
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
    },
  ],
  dataset: {
    source: statisticAddressCounts.map(data => [
      parseDateNoTime(data.createdAtUnixtimestamp),
      new BigNumber(data.addressesCount).toNumber(),
    ]),
  },
})

export const AddressCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticAddressCounts, statisticAddressCountsFetchEnd, app } = useAppState()
  const option = useMemo(
    () => getOption(statisticAddressCounts, app.chartColor, isThumbnail),
    [statisticAddressCounts, app.chartColor, isThumbnail],
  )
  if (!statisticAddressCountsFetchEnd || statisticAddressCounts.length === 0) {
    return <ChartLoading show={!statisticAddressCountsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={option} isThumbnail={isThumbnail} />
}

const toCSV = (statisticAddressCounts?: State.StatisticAddressCount[]) =>
  statisticAddressCounts ? statisticAddressCounts.map(data => [data.createdAtUnixtimestamp, data.addressesCount]) : []

export default () => {
  const dispatch = useDispatch()
  const { statisticAddressCounts } = useAppState()

  useEffect(() => {
    getStatisticAddressCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.address_count')}
      description={i18n.t('statistic.address_count_description')}
      data={toCSV(statisticAddressCounts)}
    >
      <AddressCountChart />
    </ChartPage>
  )
}
