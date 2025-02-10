import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EChartOption } from 'echarts'
import { SmartChartPage } from '../../../StatisticsChart/common'
import { variantColors } from '../../../../utils/chart'

interface AssetRecord {
  symbol: string
  usd: string
}

const useOption = (list: AssetRecord[]): echarts.EChartOption => {
  const { t } = useTranslation()

  const tooltip: EChartOption.Tooltip = {
    formatter: data => {
      const item = Array.isArray(data) ? data[0] : data
      return `${item.name}: ${item.value} USD (${item.percent}%)`
    },
  }

  const colors = variantColors(list.length)
  return {
    color: colors,
    tooltip,
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
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: list.map(data => {
          return {
            name: data.symbol,
            value: data.usd,
          }
        }),
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
      getEChartOption={useOption}
    />
  )
}

export default LiquidityChart
