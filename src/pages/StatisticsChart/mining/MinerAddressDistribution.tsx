import { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router'
import { getStatisticMinerAddressDistribution } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../constants/common'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { isMobile } from '../../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'

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

const Colors = [
  '#3182BD',
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

const addressText = (address: string) =>
  isMobile() ? adaptMobileEllipsis(address, 4) : adaptPCEllipsis(address, 2, 80)

const getOption = (
  statisticMinerAddresses: State.StatisticMinerAddress[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: Colors,
  tooltip: !isThumbnail
    ? {
        formatter: (data: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 65)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.address'))} ${addressText(
            data.data.title,
          )}</div>`
          result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.miner_ratio'))} ${(
            Number(data.data.value) * 100
          ).toFixed(1)}%</div>`
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  series: [
    {
      name: i18n.t('statistic.miner_ratio'),
      type: 'pie',
      radius: isMobile() || isThumbnail ? '50%' : '75%',
      center: ['50%', '50%'],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      data: statisticMinerAddresses.map(data => ({
        name: `${addressText(data.address.toLowerCase())} (${(Number(data.radio) * 100).toFixed(1)}%)`,
        title: data.address.toLowerCase(),
        value: data.radio,
      })),
    },
  ],
})

export const MinerAddressDistributionChart = ({
  isThumbnail = false,
  clickEvent,
}: {
  isThumbnail?: boolean
  clickEvent?: Function
}) => {
  const { statisticMinerAddresses, statisticMinerAddressesFetchEnd } = useAppState()
  if (!statisticMinerAddressesFetchEnd || statisticMinerAddresses.length === 0) {
    return <ChartLoading show={!statisticMinerAddressesFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticMinerAddresses, isThumbnail)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

const toCSV = (statisticMinerAddresses: State.StatisticMinerAddress[]) =>
  statisticMinerAddresses ? statisticMinerAddresses.map(data => [data.address, data.radio]) : []

export default () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { statisticMinerAddresses } = useAppState()

  const clickEvent = useCallback(
    (param: any) => {
      if (param && param.data.title) {
        history.push(`/address/${param.data.title}`)
      }
    },
    [history],
  )

  useEffect(() => {
    getStatisticMinerAddressDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.miner_addresses_rank')} data={toCSV(statisticMinerAddresses)}>
      <MinerAddressDistributionChart clickEvent={clickEvent} />
    </ChartPage>
  )
}
