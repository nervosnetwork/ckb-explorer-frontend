import echarts from 'echarts'
import dayjs from 'dayjs'
import { SmartChartPage } from '../../../StatisticsChart/common'

export type Dataset = Record<'timestamp' | 'value', string>[]

const getOption =
  (seriaName: string, color: string) =>
  (dataset: Dataset): echarts.EChartOption => {
    return {
      color: [color],
      tooltip: {
        trigger: 'axis',
        formatter: data => {
          if (!Array.isArray(data)) return ''
          const v = data[0].value
          return `${data[0].name}: ${typeof v === 'number' ? v.toLocaleString('en') : v} ${data[0].seriesName}`
        },
      },
      grid: {
        left: '10',
        right: '10',
        top: '10',
        bottom: '10',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dataset.map(item => dayjs(+item.timestamp * 1000).format('YYYY/MM/DD')),
          show: false,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
        },
      ],
      series: [
        {
          name: seriaName,
          type: 'line',
          yAxisIndex: 0,
          symbol: 'none',
          symbolSize: 3,
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color }, // Top color (red, semi-transparent)
              { offset: 0.7, color: '#fff' }, // Bottom color (transparent)
              { offset: 1, color: '#fff' }, // Bottom color (transparent)
            ]) as any,
          },
          lineStyle: {
            width: 1,
          },
          data: dataset.map(i => +i.value),
        },
      ],
    }
  }

export const HistoryChart = ({ color, seriaName, dataset }: { color: string; seriaName: string; dataset: Dataset }) => {
  return (
    <SmartChartPage
      title=""
      isThumbnail
      fetchData={() => Promise.resolve(dataset)}
      getEChartOption={getOption(seriaName, color)}
      queryKey={Math.random().toString()}
    />
  )
}

export default HistoryChart
