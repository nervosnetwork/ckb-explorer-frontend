import React from 'react'
import { LoadingPanel, ChartNoDataPanel } from './styled'
import Loading from '../../components/Loading'
import ChartNoDataImage from '../../assets/chart_no_data.png'
import ChartNoDataAggronImage from '../../assets/chart_no_data_aggron.png'
import { isMainnet } from '../../utils/chain'
import SmallLoading from '../../components/Loading/SmallLoading'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import { ObjectMap, Func } from 'echarts-for-react'
import i18n from '../../utils/i18n'

const LoadingComp = ({ isThumbnail }: { isThumbnail?: boolean }) => {
  return isThumbnail ? <SmallLoading /> : <Loading show />
}

const ChartLoading = ({ show, isThumbnail = false }: { show: boolean; isThumbnail?: boolean }) => {
  return (
    <LoadingPanel isThumbnail={isThumbnail}>
      {show ? (
        <LoadingComp isThumbnail={isThumbnail} />
      ) : (
        <ChartNoDataPanel isThumbnail={isThumbnail}>
          <img alt="no data" src={isMainnet() ? ChartNoDataImage : ChartNoDataAggronImage} />
          <span>{i18n.t('statistic.no_data')}</span>
        </ChartNoDataPanel>
      )}
    </LoadingPanel>
  )
}

const ReactChartCore = ({
  option,
  isThumbnail,
  clickEvent,
}: {
  option: ObjectMap
  isThumbnail?: boolean
  clickEvent?: Func
}) => {
  let events = undefined
  if (clickEvent) {
    events = { click: clickEvent }
  }
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={option}
      notMerge
      lazyUpdate
      style={{
        height: isThumbnail ? '230px' : '70vh',
      }}
      onEvents={events}
    />
  )
}

export { ChartLoading, ReactChartCore }
