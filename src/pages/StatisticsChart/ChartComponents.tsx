import React from 'react'
import { LoadingPanel } from './styled'
import Loading from '../../components/Loading'
import ChartNoDataImage from '../../assets/chart_no_data.png'
import ChartNoDataAggronImage from '../../assets/chart_no_data_aggron.png'
import { isMainnet } from '../../utils/chain'
import SmallLoading from '../../components/Loading/SmallLoading'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import { ObjectMap, Func } from 'echarts-for-react'

const LoadingComp = ({ isThumbnail }: { isThumbnail?: boolean }) => {
  return isThumbnail ? <SmallLoading /> : <Loading show />
}

const ChartLoading = ({ show, isThumbnail = false }: { show: boolean; isThumbnail?: boolean }) => {
  return (
    <LoadingPanel>
      {show ? (
        <LoadingComp isThumbnail={isThumbnail} />
      ) : (
        <img
          className="chart__card__no_data"
          alt="no data"
          src={isMainnet() ? ChartNoDataImage : ChartNoDataAggronImage}
        />
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
