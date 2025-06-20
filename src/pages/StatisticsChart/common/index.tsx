import { ComponentProps, CSSProperties, ReactElement, ReactNode, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
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
import 'echarts/lib/component/visualMap'
import echarts from 'echarts/lib/echarts'
import { EChartOption, ECharts } from 'echarts'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../../components/Loading'
import ChartNoDataImage from './chart_no_data.png'
import ChartNoDataAggronImage from './chart_no_data_aggron.png'
import { isMainnet } from '../../../utils/chain'
import SmallLoading from '../../../components/Loading/SmallLoading'
import Content from '../../../components/Content'
import { useIsMobile, usePrevious, useWindowResize } from '../../../hooks'
import { isDeepEqual } from '../../../utils/util'
import { HelpTip } from '../../../components/HelpTip'
import { ChartColor, ChartColorConfig } from '../../../constants/common'
import styles from './index.module.scss'

const LoadingComp = ({ isThumbnail }: { isThumbnail?: boolean }) => (isThumbnail ? <SmallLoading /> : <Loading show />)

const ChartLoading = ({ show, isThumbnail = false }: { show: boolean; isThumbnail?: boolean }) => {
  const { t } = useTranslation()
  return (
    <div className={classNames(styles.loadingPanel, isThumbnail && styles.isThumbnail)}>
      {show ? (
        <LoadingComp isThumbnail={isThumbnail} />
      ) : (
        <div className={classNames(styles.chartNoDataPanel, isThumbnail && styles.isThumbnail)}>
          <img
            className={isThumbnail ? styles.isThumbnail : ''}
            alt="no data"
            src={isMainnet() ? ChartNoDataImage : ChartNoDataAggronImage}
          />
          <span>{t('statistic.no_data')}</span>
        </div>
      )}
    </div>
  )
}

const ReactChartCore = ({
  option,
  isThumbnail,
  onClick,
  notMerge = false,
  lazyUpdate = false,
  style,
  className = '',
}: {
  option: EChartOption
  isThumbnail?: boolean
  onClick?: (param: echarts.CallbackDataParams) => void
  notMerge?: boolean
  lazyUpdate?: boolean
  style?: CSSProperties
  className?: string
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<ECharts | null>(null)
  const prevOption = usePrevious(option)
  const prevClickEvent = usePrevious(onClick)

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
        if (onClick && typeof onClick === 'function' && onClick !== prevClickEvent) {
          chartInstance.on('click', onClick)
        }
      } catch (error) {
        console.error('error', error)
        if (chartInstance) {
          chartInstance.dispose()
        }
      }
    }
  }, [onClick, lazyUpdate, notMerge, option, prevClickEvent, prevOption])

  useWindowResize(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.resize()
    }
  })

  return <div style={{ height: isThumbnail ? '200px' : '70vh', ...style }} className={className} ref={chartRef} />
}

const dataToCsv = (data?: (string | number)[][]) => {
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
  style,
}: {
  style?: CSSProperties
  title: string
  children: ReactNode
  description?: string
  data?: (string | number)[][]
}) => {
  const csv = dataToCsv(data)
  const { t } = useTranslation()
  const fileName = (title.indexOf(' (') > 0 ? title.substring(0, title.indexOf(' (')) : title)
    .replace(/&/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
  return (
    <Content>
      <div
        className={`${styles.chartDetailTitle} container`}
        // TODO: refactor
        style={{ borderTopLeftRadius: style?.borderRadius, borderTopRightRadius: style?.borderRadius }}
      >
        <div className="chartDetailTitlePanel">
          <span>{title}</span>
          {description && (
            <HelpTip placement="bottom" iconProps={{ alt: 'chart help' }}>
              {description}
            </HelpTip>
          )}
        </div>
        {csv && (
          <a
            className="chartDetailTitleDownload"
            rel="noopener noreferrer"
            href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
            target="_blank"
            download={`${fileName}.csv`}
          >
            {t('statistic.download_data')}
          </a>
        )}
      </div>
      <div
        className={`${styles.chartDetailPanel} container`}
        // TODO: refactor
        style={{ borderBottomLeftRadius: style?.borderRadius, borderBottomRightRadius: style?.borderRadius }}
      >
        {children}
      </div>
    </Content>
  )
}

export interface SmartChartPageProps<T> {
  title: string
  description?: string
  note?: string
  isThumbnail?: boolean
  chartProps?: Partial<ComponentProps<typeof ReactChartCore>>
  fetchData: () => Promise<T[]>
  onFetched?: (dataList: T[]) => void
  getEChartOption: (
    dataList: T[],
    chartColor: ChartColorConfig,
    isMobile: boolean,
    isThumbnail?: boolean,
  ) => echarts.EChartOption
  toCSV?: (dataList: T[]) => (string | number)[][]
  queryKey?: string
  style?: CSSProperties
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
  queryKey,
  style,
}: SmartChartPageProps<T>): ReactElement {
  const isMobile = useIsMobile()

  const query = useQuery(['SmartChartPage', queryKey], () => fetchData(), { refetchOnWindowFocus: false })
  const dataList = useMemo(() => query.data ?? [], [query.data])
  useEffect(() => {
    if (onFetched && query.data) {
      onFetched(query.data)
    }
  }, [onFetched, query.data])

  const option = getEChartOption(dataList, ChartColor, isMobile, isThumbnail)

  const content = query.isLoading ? (
    <ChartLoading show isThumbnail={isThumbnail} />
  ) : (
    <ReactChartCore option={option} isThumbnail={isThumbnail} {...chartProps} style={style} />
  )

  return isThumbnail ? (
    content
  ) : (
    <ChartPage title={title} description={description} data={toCSV?.(dataList)} style={style}>
      {content}
      {note != null && <div className={styles.chartNotePanel}>{note}</div>}
    </ChartPage>
  )
}

const tooltipColor = (color: string) =>
  `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`

const tooltipWidth = (value: string, width: number) =>
  `<span style="width:${width}px;display:inline-block;">${value}:</span>`

export type SeriesItem = { seriesName: string; name: string; color: string; dataIndex: number }

export { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth }
