import React, { ReactNode } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/map'
import 'echarts/map/js/world.js'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markLine'
import { LoadingPanel, ChartNoDataPanel, ChartDetailTitle, ChartDetailPanel } from './styled'
import Loading from '../../../components/Loading'
import ChartNoDataImage from '../../../assets/chart_no_data.png'
import ChartNoDataAggronImage from '../../../assets/chart_no_data_aggron.png'
import { isMainnet } from '../../../utils/chain'
import SmallLoading from '../../../components/Loading/SmallLoading'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import i18n from '../../../utils/i18n'
import Content from '../../../components/Content'

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
  option: any
  isThumbnail?: boolean
  clickEvent?: any
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
        height: isThumbnail ? '200px' : '70vh',
      }}
      onEvents={events}
    />
  )
}

const ChartPage = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <Content>
      <ChartDetailTitle>{title}</ChartDetailTitle>
      <ChartDetailPanel>{children}</ChartDetailPanel>
    </Content>
  )
}

const tooltipColor = (color: string) =>
  `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`

const tooltipWidth = (value: string, width: number) =>
  `<span style="width:${width}px;display:inline-block;">${value}:</span>`

export { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth }
