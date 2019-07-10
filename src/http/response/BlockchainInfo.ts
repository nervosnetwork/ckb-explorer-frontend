export interface BlockchainInfo {
  is_initial_block_download: boolean
  epoch: string
  difficulty: string
  median_time: string
  chain: string
  alerts: Alert[]
}

export interface Alert {
  id: string
  message: string
  notice_until: string
  priority: string
}

export interface BlockchainInfoWrapper {
  id: number
  type: string
  attributes: {
    blockchain_info: BlockchainInfo
  }
}
