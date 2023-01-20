import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { shannonToCkb } from '../../../utils/util'
import { fetchStatisticOccupiedCapacity } from '../../../service/http/fetcher'

const getOption = (
  statisticOccupiedCapacities: State.StatisticOccupiedCapacity[],
  chartColor: State.App['chartColor'],
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '4%',
    right: '3%',
    top: isMobile ? '3%' : '8%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 170 : 165)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(
              `${i18n.t('statistic.occupied_capacity')} (CKB)`,
            )} ${handleAxis(dataList[0].data)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : i18n.t('statistic.date'),
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
        name: isMobile || isThumbnail ? '' : `${i18n.t('statistic.occupied_capacity')} (CKB)`,
        type: 'value',
        scale: true,
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

const toCSV = (statisticOccupiedCapacities: State.StatisticOccupiedCapacity[]) =>
  statisticOccupiedCapacities
    ? statisticOccupiedCapacities.map(data => [data.createdAtUnixtimestamp, data.occupiedCapacity])
    : []

export const OccupiedCapacityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.occupied_capacity')}
      isThumbnail={isThumbnail}
      fetchData={fetchStatisticOccupiedCapacity}
      getEChartOption={getOption}
      toCSV={toCSV}
    />
  )
}

export default OccupiedCapacityChart
