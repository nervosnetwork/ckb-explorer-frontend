import { useTranslation } from 'react-i18next'
import { EChartOption } from 'echarts'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { ChartCachedKeys } from '../../../constants/cache'
import { fetchStatisticMinerVersionDistribution } from '../../../service/http/fetcher'

const Colors = [
  '#069ECD',
  '#69C7D4',
  '#AACFE9',
  '#29B97A',
  '#66CC99',
  '#228159',
  '#525860',
  '#74808E',
  '#9DA6B0',
  '#FBB04C',
]

interface VersionRecord {
  version: string
  percent: number
}

const getOption = (
  list: Array<VersionRecord>,
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
    left: '3%',
    right: '3%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  const tooltip: EChartOption.Tooltip | undefined = !isThumbnail
    ? {
        formatter: data => {
          const item = Array.isArray(data) ? data[0] : data
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 80 : 60)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.version'))} ${
            item.data.title
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(i18n.t('statistic.percent'))} ${
            item.data.value
          }%</div>`
          return result
        },
      }
    : {
        show: false,
      }

  return {
    color: [chartColor.colors[0], ...Colors],
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
        name: i18n.t('statistic.miner_version_distribution'),
        type: 'pie',
        radius: isMobile || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: list.map(data => {
          const version = data.version === 'others' ? i18n.t(`statistic.others`) : data.version
          return {
            name: `${version} (${data.percent}%)`,
            title: version,
            value: data.percent,
          }
        }),
      },
    ],
  }
}

const fetchData = async () => {
  const { data: list } = await fetchStatisticMinerVersionDistribution()
  const totalBlocks = list.reduce((acc, cur) => acc + cur.blocksCount, 0)
  return list.map(v => ({
    version: v.version,
    percent: +((100 * v.blocksCount) / totalBlocks).toFixed(2),
  }))
}

const toCSV = (versionList: Array<VersionRecord>) => versionList?.map(r => [r.version, `${r.percent}%`]) ?? []

export const MinerVersionDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.miner_version_distribution')}
      isThumbnail={isThumbnail}
      fetchData={fetchData}
      getEChartOption={getOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.MinerVersionDistribution}
      cacheMode="date"
    />
  )
}

export default MinerVersionDistributionChart
