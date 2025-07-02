import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import type { ChartColorConfig } from '../../../constants/common'
import { SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG, handleAxis, variantColors } from '../../../utils/chart'
import { explorerService } from '../../../services/ExplorerService'

// Helper function to get ISO week number and year
function getWeekNumber(timestamp: string) {
  const date = new Date(+timestamp * 1000)
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + firstDayOfYear.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${weekNumber}`
}

const useOption = (
  activeAddresses: {
    createdAtUnixtimestamp: string
    distribution: Record<string, number>
  }[],
  _: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '4%',
    right: '8%',
    top: '12%',
    bottom: '5%',
    containLabel: true,
  }

  const aggregatedByWeek = activeAddresses.reduce((acc, item) => {
    const week = getWeekNumber(item.createdAtUnixtimestamp)

    if (!acc[week]) {
      acc[week] = {
        createdAtWeek: week,
        distribution: {},
      }
    }

    Object.entries(item.distribution).forEach(([key, value]) => {
      acc[week].distribution[key] = (acc[week].distribution[key] || 0) + value
    })

    return acc
  }, {} as Record<string, { createdAtWeek: string; distribution: Record<string, number> }>)

  const aggregatedDdata = Object.values(aggregatedByWeek)
  const dataset = aggregatedDdata.slice(0, aggregatedDdata.length - 1) // Remove the last week data because it's not complete
  const xAxisData = dataset.map(item => item.createdAtWeek)
  const allKeys = Array.from(new Set(dataset.flatMap(item => Object.keys(item.distribution)))).sort((a, b) => {
    if (a === 'others') return 1
    if (b === 'others') return -1
    return a.localeCompare(b)
  })
  const series: EChartsOption['series'] = allKeys.map(key => ({
    name: t(`statistic.address_label.${key}`),
    type: 'line',
    stack: 'total',
    areaStyle: {},
    lineStyle: {
      width: 0,
    },
    symbol: 'none',
    emphasis: {
      focus: 'series',
    },
    data: dataset.map(item => item.distribution[key] || 0),
  }))
  const colors = variantColors(allKeys.length)

  return {
    color: colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: params => {
            // Filter out fields with value 0
            if (!Array.isArray(params)) return ''
            const filteredParams = params.filter(item => item.value !== 0)

            // Construct the tooltip content
            if (filteredParams.length === 0) return '' // No fields to display

            const header = `${(filteredParams[0] as any).axisValue}<br/>` // Show week
            const sum = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:white;"></span>
${t('statistic.active_address_count')}: ${filteredParams.reduce(
              (acc, item) => acc + Number(item.value),
              0,
            )}<br/><hr style="margin: 4px 0" />`
            const body = filteredParams
              .map(
                item =>
                  `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
             ${item.seriesName}: ${item.value}`,
              )
              .join('<br/>')

            return header + sum + body
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    legend: { data: isThumbnail ? [] : allKeys.map(key => t(`statistic.address_label.${key}`) as string) },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        formatter: (value: string) => value, // Display week labels
      },
      name: isMobile || isThumbnail ? '' : t('statistic.week'),
    },
    yAxis: {
      type: 'value',
      name: isMobile || isThumbnail ? '' : `${t('statistic.active_address_count')}`,
      axisLabel: {
        formatter: (value: number) => handleAxis(value),
      },
    },
    series,
  }
}

const toCSV = (data: Awaited<ReturnType<typeof explorerService.api.fetchStatisticActiveAddresses>>) => {
  if (!Array.isArray(data)) {
    return []
  }
  return data.flatMap(item => {
    return Object.entries(item.distribution).map(([key, value]) => [item.createdAtUnixtimestamp, key, value.toString()])
  })
}

export const ActiveAddressesChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.active_addresses')}
      description={t('statistic.active_addresses_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticActiveAddresses}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticActiveAddresses"
    />
  )
}

export default ActiveAddressesChart
