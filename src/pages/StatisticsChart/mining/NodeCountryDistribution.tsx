import { useTranslation } from 'react-i18next'
import type { EChartsOption, TooltipComponentOption } from 'echarts'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { getPeers, RawPeer } from '../../../services/NodeProbService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const Colors: string[] = ['#6839fb', '#794ffb', '#8a65fc', '#9a7bfc', '#ab91fd']

interface CountryRecord {
  country: string
  percent: number
}

const useOption = (
  list: CountryRecord[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

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
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  const tooltip: TooltipComponentOption | undefined = !isThumbnail
    ? {
        formatter: data => {
          const item = Array.isArray(data) ? data[0] : data
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 100 : 120)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.country'))} ${
            (item.data as Record<string, string>).title
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.percent'))} ${
            (item.data as Record<string, string>).value
          }%</div>`
          return result
        },
      }
    : {
        show: false,
      }

  const colors = [chartColor.colors[0], ...Colors]
  if (list.length > colors.length) {
    const diff = list.length - colors.length
    const base = colors[colors.length - 1]
    colors.push(...Array.from({ length: diff }, (_, idx) => `${base}${(255 - idx * 10).toString(16)}`))
  }
  return {
    color: colors,
    tooltip,
    grid: isThumbnail ? gridThumbnail : grid,
    legend: {
      show: !isThumbnail,
      right: 40,
      bottom: 40,
      orient: 'vertical',
      icon: 'circle',
    },
    series: [
      {
        name: t('statistic.node_country_distribution'),
        type: 'pie',
        radius: isMobile || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0)',
          },
        },
        data: list.slice(0, isThumbnail ? 10 : undefined).map(data => {
          const country = data.country === 'others' ? t(`statistic.others`) : data.country
          return {
            name: `${country} (${data.percent}%)`,
            title: country,
            value: data.percent,
          }
        }),
      },
    ],
  }
}

const fetchData = async (): Promise<CountryRecord[]> => {
  const list: RawPeer[] = await getPeers()
  const result: { key: string; value: number } = list.reduce((acc: any, cur: any) => {
    acc[cur.country] = (acc[cur.country] || 0) + 1
    return acc
  }, {})
  return Object.entries(result)
    .sort((a, b) => +b[1] - +a[1])
    .map(v => ({
      country: v[0],
      percent: +(((v[1] as number) * 100) / list.length).toFixed(2),
    }))
}

const toCSV = (countryList: CountryRecord[]) => countryList?.map(r => [r.country, `${r.percent}%`]) ?? []

export const NodeCountryDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.node_country_distribution')}
      isThumbnail={isThumbnail}
      fetchData={fetchData}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticNodeCountryDistribution"
    />
  )
}

export default NodeCountryDistributionChart
