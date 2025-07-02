import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import 'echarts-gl'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from 'echarts/components'
import { MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import Loading from '../../../components/Loading/SmallLoading'
import { getPeers, RawPeer } from '../../../services/NodeProbService'
import { getPrimaryColor, IS_MAINNET } from '../../../constants/common'
import styles from './nodeGeoDistribution.module.scss'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
])

const LAUNCH_TIME_OF_MAINNET = 0x16e70e6985c

type Point = [long: number, lat: number, city: string]
type Line = [Point, Point]

const fetchData = async (): Promise<{ lines: Line[]; points: Point[] }> => {
  const list: RawPeer[] = await getPeers()
  const points: Point[] = list.map(peer => [peer.longitude, peer.latitude, peer.city])
  const lines: Line[] = []
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1: Point = points[i]
      const p2: Point = points[j]
      lines.push([p1, p2])
    }
  }

  return { lines, points }
}

const option = {
  backgroundColor: '#000',
  tooltip: {
    show: true,
    formatter: (params: { data: Point }) => {
      return params.data[2]
    },
  },
  globe: {
    environment: '/images/chart/dark.webp',
    baseTexture: '/images/chart/earth.jpg',
    heightTexture: '/images/chart/earth.jpg',
    displacementScale: 0.04,
    displacementQuality: 'high',
    shading: 'realistic',
    realisticMaterial: {
      roughness: 0.9,
      metalness: 0,
    },
    temporalSuperSampling: {
      enable: true,
    },
    postEffect: {
      enable: true,
      depthOfField: {
        enable: false,
        focalDistance: 150,
      },
    },
    light: {
      main: {
        intensity: 10,
        shadow: true,
        time: new Date(LAUNCH_TIME_OF_MAINNET),
      },
    },
    viewControl: {
      autoRotate: true,
      autoRotateSpeed: 1,
      distance: 800,
    },
    silent: true,
  },
}

const color = getPrimaryColor()

export const NodeGeoDistribution = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading } = useQuery(['node distribution'], fetchData, { enabled: !isThumbnail })

  useEffect(() => {
    if (!containerRef.current) return
    if (!data) return
    let ins = echarts.getInstanceByDom(containerRef.current)
    if (!ins) {
      ins = echarts.init(containerRef.current)
    }

    const series = [
      {
        type: 'lines3D',
        name: 'blocks',
        coordinateSystem: 'globe',
        blendMode: 'lighter',
        symbolSize: 2,
        itemStyle: {
          color,
          opacity: 0.1,
        },
        effect: {
          show: true,
          trailWidth: 1,
          trailLength: 0.15,
          trailOpacity: 0.1,
          constantSpeed: 10,
        },
        lineStyle: {
          width: 1,
          color,
          opacity: 0.02,
        },
        data: data.lines,
      },
      {
        type: 'scatter3D',
        coordinateSystem: 'globe',
        blendMode: 'lighter',
        symbolSize: 10,
        itemStyle: {
          color,
          opacity: 0.2,
        },
        label: {
          show: true,
          formatter: '{b}',
        },
        data: data.points,
      },
    ]

    ins.setOption({
      ...option,
      series,
    } as any)
  }, [data])

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

  if (isThumbnail) {
    return (
      <div
        className={styles.thumbnail}
        style={{
          backgroundImage: `url(/images/chart/geo_cover_${IS_MAINNET ? 'mainnet' : 'testnet'}.png)`,
        }}
      />
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    return <div>Fail to load data</div>
  }

  return <div className={styles.container} ref={containerRef} />
}

export default NodeGeoDistribution
