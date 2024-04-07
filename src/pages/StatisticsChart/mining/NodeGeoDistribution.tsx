import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import 'echarts-gl'
import echarts from 'echarts/lib/echarts'
import Loading from '../../../components/Loading/SmallLoading'
import { getPeers, RawPeer } from '../../../services/NodeProbService'
import { IS_MAINNET } from '../../../constants/common'

const fetchData = async (): Promise<[[number, number], [number, number]][]> => {
  const list: RawPeer[] = await getPeers()
  const points: [number, number][] = list.map(peer => [peer.longitude, peer.latitude])
  const lines: [[number, number], [number, number]][] = []
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1: [number, number] = points[i]
      const p2: [number, number] = points[j]
      lines.push([p1, p2])
    }
  }

  return lines
}

const globeOption: any = {
  backgroundColor: '#000',
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
        time: new Date(0x16e70e6985c), // launch time of CKB mainnet
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

export const NodeGeoDistribution = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading } = useQuery(['node distribution'], fetchData)

  useEffect(() => {
    if (!containerRef.current) return
    if (!data) return
    let ins = echarts.getInstanceByDom(containerRef.current)
    if (!ins) {
      ins = echarts.init(containerRef.current)
    }

    const color = IS_MAINNET ? '#00cc9b' : '#9a2cec'

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
        data,
      },
      {
        type: 'scatter3D',
        coordinateSystem: 'globe',
        blendMode: 'lighter',
        symbolSize: 30,
        itemStyle: {
          color,
          opacity: 0.2,
        },
        silent: true,
        data: data.flat(),
      },
    ]
    const option = globeOption

    ins.setOption({
      ...option,
      series,
    } as any)
  }, [data, isThumbnail])

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
        style={{
          width: '280px',
          height: 200,
          background: `center / cover url(/images/chart/geo_cover_${IS_MAINNET ? 'mainnet' : 'testnet'}.png)`,
        }}
      />
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    return <div> Fail to load data </div>
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
      ref={containerRef}
    />
  )
}

export default NodeGeoDistribution
