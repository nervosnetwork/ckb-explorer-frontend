import { useEffect, useRef } from 'react'
import 'echarts-gl'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from 'echarts/components'
import { MapChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import worldMap from './worldMap.json'
import styles from './index.module.scss'
import { getPrimaryColor } from '../../constants/common'

echarts.registerMap('world', { geoJSON: worldMap as any, specialAreas: {} })
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
  LinesChart,
  EffectScatterChart,
])

const primaryColor = getPrimaryColor()

export type IpPoint = {
  id: string
  ip: string
  lon: number
  lat: number
  city: string
  connections: string[] // other node id
}

type EchartPoint = [long: number, lat: number, city: string]
type EchartLine = [EchartPoint, EchartPoint]

export const isValidIpPoint = (ip: unknown): ip is IpPoint => {
  if (typeof ip !== 'object' || ip === null) return false
  if (typeof (ip as IpPoint).ip !== 'string') return false
  if (typeof (ip as IpPoint).lon !== 'number') return false
  if (typeof (ip as IpPoint).lat !== 'number') return false
  if (typeof (ip as IpPoint).city !== 'string') return false
  return true
}

const option = {
  backgroundColor: '#000',
  geo: {
    silent: true,
    map: 'world',
    roam: true,
    zoom: 2,
    label: {
      show: false,
    },
    itemStyle: {
      areaColor: '#1b1b1b',
      borderColor: '#555',
    },
    emphasis: {
      areaColor: '#444',
    },
    environment: '#333',
  },
}

export const NodesMap = ({ ips }: { ips: IpPoint[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const points: EchartPoint[] = ips.map(i => [i.lon, i.lat, i.city])
    if (!points.length) return
    let ins = echarts.getInstanceByDom(containerRef.current)
    if (!ins) {
      ins = echarts.init(containerRef.current)
    }

    const lines: EchartLine[] = []

    ips.forEach(ip => {
      ip.connections.forEach(connId => {
        const conn = ips.find(i => i.id === connId)

        if (!conn) {
          return
        }

        lines.push([
          [ip.lon, ip.lat, ip.city],
          [conn.lon, conn.lat, conn.city],
        ])
      })
    })

    const series = [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: points,
        symbolSize: 8,
        rippleEffect: {
          scale: 3,
          brushType: 'stroke',
        },
        itemStyle: {
          color: primaryColor,
          shadowBlur: 10,
          shadowColor: primaryColor,
        },
        tooltip: {
          show: true,
        },
        label: {
          show: true,
          position: 'right',
          formatter: (p: { data: EchartPoint }) => {
            return p.data[2]
          },
          color: '#fff',
          fontSize: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: [4, 6],
          broderRadius: 3,
        },
      },
      {
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 2,
        effect: {
          show: true,
          period: 1,
          trailLength: 0.1, // Shorter trail
          symbol: 'arrow',
          symbolSize: 3,
        },
        animationEasing: 'cubicOut',

        lineStyle: {
          curveness: 0.2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: primaryColor },
              { offset: 0.5, color: '#00ffea' },
              { offset: 1, color: primaryColor },
            ],
          },
          width: 1,
          opacity: 0.4,
        },
        data: lines,
      },
    ]

    ins.setOption({
      ...option,
      series,
    } as any)
  }, [ips])

  useEffect(() => {
    if (!containerRef.current) return
    const ins = echarts.getInstanceByDom(containerRef.current)
    const handleResize = () => {
      if (ins) {
        ins.resize()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  if (!ips) {
    return <div>Data not found</div>
  }

  return <div className={styles.container} ref={containerRef} />
}

export default NodesMap
