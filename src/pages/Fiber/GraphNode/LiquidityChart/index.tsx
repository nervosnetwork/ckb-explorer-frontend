import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { SmartChartPage } from '../../../StatisticsChart/common'
import { parseNumericAbbr } from '../../../../utils/chart'
import type { AssetRecord } from '../types'
import { uniqueColor } from '../../../../utils/color'

const useChartOption = (list: AssetRecord[]): EChartsOption => {
  const { t } = useTranslation()
  const colors = list.map(i => uniqueColor(i.key))

  return {
    color: colors,
    tooltip: {
      formatter: data => {
        const item = Array.isArray(data) ? data[0] : data
        return typeof item.value === 'number'
          ? `${item.name}: ${parseNumericAbbr(item.value, 2)} USD (${item.percent}%)`
          : ''
      },
    },
    grid: {
      left: '4%',
      right: '10%',
      top: '8%',
      bottom: '6%',
      containLabel: true,
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: t('fiber.graph.node.liquidity_allocation'),
        type: 'pie',
        center: ['50%', '50%'],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: list.map(data => ({
          name: data.symbol,
          value: Number(data.usd),
        })),
      },
    ],
  }
}

export const LiquidityChart: FC<{ assets: AssetRecord[] }> = ({ assets }) => {
  const [t] = useTranslation()
  const data = assets.filter(a => +a.usd > 0)

  if (!data.length) return null

  return (
    <SmartChartPage
      title={t('fiber.graph.node.liquidity_allocation')}
      isThumbnail
      fetchData={() => Promise.resolve(data)}
      getEChartOption={useChartOption}
      queryKey={`liquidity-chart-${data.map(d => d.usd).join('-')}`}
    />
  )
}

export default LiquidityChart
