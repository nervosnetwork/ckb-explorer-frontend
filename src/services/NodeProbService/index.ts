import config from '../../config'
import { IS_MAINNET } from '../../constants/common'

const { PROB_NODE: node } = config

if (!node) {
  throw new Error('NodeProbService not implemented')
}

export const getPeers = async (): Promise<RawPeer[]> => {
  const params = new URLSearchParams({
    network: IS_MAINNET ? 'minara' : 'pudge',
    offline_timeout: '10080',
    unknown_offline_timeout: '10080',
  })

  const response = await fetch(`${node}/peer?${params}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

interface LastSeen {
  secs_since_epoch: number
  nanos_since_epoch: number
}

export interface RawPeer {
  id: number
  version: string
  version_short: string
  last_seen: LastSeen[]
  country: string
  city: string
  latitude: number
  longitude: number
  node_type: number
}
