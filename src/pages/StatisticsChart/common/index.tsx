import { ComponentProps, CSSProperties, ReactElement, ReactNode, useEffect, useMemo, useRef } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/brush'
import echarts from 'echarts/lib/echarts'
import { Tooltip } from 'antd'
import { EChartOption, ECharts } from 'echarts'
import { LoadingPanel, ChartNoDataPanel, ChartDetailTitle, ChartDetailPanel, ChartNotePanel } from './styled'
import Loading from '../../../components/Loading'
import ChartNoDataImage from '../../../assets/chart_no_data.png'
import ChartNoDataAggronImage from '../../../assets/chart_no_data_aggron.png'
import HelpIcon from '../../../assets/qa_help.png'
import { isMainnet } from '../../../utils/chain'
import SmallLoading from '../../../components/Loading/SmallLoading'
import i18n from '../../../utils/i18n'
import Content from '../../../components/Content'
import { useChartQueryWithCache, useIsMobile, usePrevious, useWindowResize } from '../../../utils/hook'
import { useAppState } from '../../../contexts/providers'
import { isDeepEqual } from '../../../utils/util'

const LoadingComp = ({ isThumbnail }: { isThumbnail?: boolean }) => (isThumbnail ? <SmallLoading /> : <Loading show />)

const ChartLoading = ({ show, isThumbnail = false }: { show: boolean; isThumbnail?: boolean }) => (
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

const ReactChartCore = ({
  option,
  isThumbnail,
  clickEvent,
  notMerge = false,
  lazyUpdate = false,
  style,
  className = '',
}: {
  option: EChartOption
  isThumbnail?: boolean
  clickEvent?: any
  notMerge?: boolean
  lazyUpdate?: boolean
  style?: CSSProperties
  className?: string
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<ECharts | null>(null)
  const prevOption = usePrevious(option)
  const prevClickEvent = usePrevious(clickEvent)

  useEffect(() => {
    let chartInstance: ECharts | null = null
    if (chartRef.current) {
      if (!chartInstanceRef.current) {
        const renderedInstance = echarts.getInstanceByDom(chartRef.current)
        if (renderedInstance) {
          renderedInstance.dispose()
        }
        chartInstanceRef.current = echarts.init(chartRef.current)
      }
      chartInstance = chartInstanceRef.current
      try {
        if (!isDeepEqual(prevOption, option, ['formatter'])) {
          chartInstance.setOption(option, { notMerge, lazyUpdate })
        }
        if (clickEvent && typeof clickEvent === 'function' && clickEvent !== prevClickEvent) {
          chartInstance.on('click', clickEvent)
        }
      } catch (error) {
        console.error('error', error)
        if (chartInstance) {
          chartInstance.dispose()
        }
      }
    }
  }, [clickEvent, lazyUpdate, notMerge, option, prevClickEvent, prevOption])

  useWindowResize(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.resize()
    }
  })

  return <div style={{ height: isThumbnail ? '200px' : '70vh', ...style }} className={className} ref={chartRef} />
}

const dataToCsv = (data: any[] | undefined) => {
  if (!data || data.length === 0) {
    return undefined
  }
  let csv = ''
  data.forEach(row => {
    csv += row.join(',')
    csv += '\n'
  })
  return csv
}

const ChartPage = ({
  title,
  children,
  description,
  data,
}: {
  title: string
  children: ReactNode
  description?: string
  data?: (string | number)[][]
}) => {
  const csv = dataToCsv(data)
  const fileName = (title.indexOf(' (') > 0 ? title.substring(0, title.indexOf(' (')) : title)
    .replace(/&/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
  return (
    <Content>
      <ChartDetailTitle className="container">
        <div className="chart__detail__title__panel">
          <span>{title}</span>
          {description && (
            <Tooltip placement="bottom" title={description}>
              <img src={HelpIcon} alt="chart help" />
            </Tooltip>
          )}
        </div>
        {csv && (
          <a
            className="chart__detail__title__download"
            rel="noopener noreferrer"
            href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
            target="_blank"
            download={`${fileName}.csv`}
          >
            {i18n.t('statistic.download_data')}
          </a>
        )}
      </ChartDetailTitle>
      <ChartDetailPanel className="container">{children}</ChartDetailPanel>
    </Content>
  )
}

export interface SmartChartPageProps<T> {
  title: string
  description?: string
  note?: string
  isThumbnail?: boolean
  chartProps?: Partial<ComponentProps<typeof ReactChartCore>>
  fetchData: () => Promise<T[] | Response.Response<Response.Wrapper<T>[]>>
  onFetched?: (dataList: T[]) => void
  getEChartOption: (
    dataList: T[],
    chartColor: State.App['chartColor'],
    isMobile: boolean,
    isThumbnail: boolean,
  ) => echarts.EChartOption
  toCSV: (dataList: T[]) => (string | number)[][]
  cacheKey?: string
  cacheMode?: 'forever' | 'date' | 'epoch'
}

export function SmartChartPage<T>({
  title,
  description,
  note,
  isThumbnail = false,
  chartProps,
  fetchData,
  onFetched,
  getEChartOption,
  toCSV,
  cacheKey,
  cacheMode = 'forever',
}: SmartChartPageProps<T>): ReactElement {
  const isMobile = useIsMobile()
  const { app } = useAppState()

  const query = useChartQueryWithCache(fetchData, cacheKey, cacheMode)
  const dataList = useMemo(() => query.data ?? [], [query.data])
  useEffect(() => {
    if (onFetched && query.data) {
      onFetched(query.data)
    }
  }, [onFetched, query.data])

  const option = useMemo(
    () => getEChartOption(dataList, app.chartColor, isMobile, isThumbnail),
    [app.chartColor, dataList, getEChartOption, isMobile, isThumbnail],
  )

  const content = query.isLoading ? (
    <ChartLoading show isThumbnail={isThumbnail} />
  ) : (
    <ReactChartCore option={option} isThumbnail={isThumbnail} {...chartProps} />
  )

  return isThumbnail ? (
    content
  ) : (
    <ChartPage title={title} description={description} data={toCSV(dataList)}>
      {content}
      {note != null && <ChartNotePanel>{note}</ChartNotePanel>}
    </ChartPage>
  )
}

const tooltipColor = (color: string) =>
  `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`

const tooltipWidth = (value: string, width: number) =>
  `<span style="width:${width}px;display:inline-block;">${value}:</span>`

export type SeriesItem = { seriesName: string; name: string; color: string; dataIndex: number }

export { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth }
