import React, { useEffect, useCallback } from 'react'
import { getStatisticMinerMoreAddressDistribution } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import browserHistory from '../../../routes/history'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
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
  '#FF8C00',
  '#F08080',
  '#FF6347',
  '#FF0000',
  '#CD661D',
  '#8B7E66',
]

const addressText = (address: string) =>
  isMobile() ? adaptMobileEllipsis(address, 4) : adaptPCEllipsis(address, 2, 80)

const getOption = (
  statisticMinerMoreAddresses: State.StatisticMinerAddress[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: Colors,
    tooltip: !isThumbnail
      ? {
          formatter: (data: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 60 : 65)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.address'))} ${addressText(
              data.data.title,
            )}</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.miner_radio'))} ${(
              Number(data.data.value) * 100
            ).toFixed(1)}%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    series: [
      {
        name: i18n.t('statistic.miner_radio'),
        type: 'pie',
        radius: isMobile() || isThumbnail ? '40%' : '75%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: statisticMinerMoreAddresses.map((data, index) => {
          return isThumbnail && index > 16
            ? {}
            : {
                name: `${addressText(data.address.toLowerCase())} (${(Number(data.radio) * 100).toFixed(1)}%)`,
                title: data.address.toLowerCase(),
                value: data.radio,
              }
        }),
      },
    ],
  }
}

export const MinerMoreAddressDistributionChart = ({
  isThumbnail = false,
  clickEvent,
}: {
  isThumbnail?: boolean
  clickEvent?: Function
}) => {
  const { statisticMinerMoreAddresses, statisticMinerMoreAddressesFetchEnd } = useAppState()
  if (!statisticMinerMoreAddressesFetchEnd || statisticMinerMoreAddresses.length === 0) {
    return <ChartLoading show={!statisticMinerMoreAddressesFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticMinerMoreAddresses, isThumbnail)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

const toCSV = (statisticMinerMoreAddresses: State.StatisticMinerAddress[]) => {
  return statisticMinerMoreAddresses ? statisticMinerMoreAddresses.map(data => [data.address, data.radio]) : []
}

export default () => {
  const dispatch = useDispatch()
  const { statisticMinerMoreAddresses } = useAppState()

  const clickEvent = useCallback((param: any) => {
    if (param && param.data.title) {
      browserHistory.push(`/address/${param.data.title}`)
    }
  }, [])

  useEffect(() => {
    getStatisticMinerMoreAddressDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.miner_more_addresses_rank')} data={toCSV(statisticMinerMoreAddresses)}>
      <MinerMoreAddressDistributionChart clickEvent={clickEvent} />
    </ChartPage>
  )
}
