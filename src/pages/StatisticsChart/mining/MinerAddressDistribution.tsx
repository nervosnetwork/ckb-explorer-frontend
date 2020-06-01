import React, { useEffect, useCallback } from 'react'
import { getStatisticMinerAddressDistribution } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import browserHistory from '../../../routes/history'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
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
  right: '4%',
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
        radius: isMobile() || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: statisticMinerAddresses.map(data => {
          return {
            name: `${addressText(data.address.toLowerCase())} (${(Number(data.radio) * 100).toFixed(1)}%)`,
            title: data.address.toLowerCase(),
            value: data.radio,
          }
        }),
      },
    ],
  }
}

export const MinerAddressDistributionChart = ({
  statisticMinerAddresses,
  isThumbnail = false,
  clickEvent,
}: {
  statisticMinerAddresses: State.StatisticMinerAddress[]
  isThumbnail?: boolean
  clickEvent?: Function
}) => {
  if (!statisticMinerAddresses || statisticMinerAddresses.length === 0) {
    return <ChartLoading show={statisticMinerAddresses === undefined} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticMinerAddresses, isThumbnail)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

export const initStatisticMinerAddressDistribution = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticMinerAddressDistribution,
    payload: {
      statisticMinerAddresses: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticMinerAddresses } = useAppState()

  const clickEvent = useCallback((param: any) => {
    if (param && param.data.title) {
      browserHistory.push(`/address/${param.data.title}`)
    }
  }, [])

  useEffect(() => {
    initStatisticMinerAddressDistribution(dispatch)
    getStatisticMinerAddressDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.miner_addresses_rank')}>
      <MinerAddressDistributionChart statisticMinerAddresses={statisticMinerAddresses} clickEvent={clickEvent} />
    </ChartPage>
  )
}
