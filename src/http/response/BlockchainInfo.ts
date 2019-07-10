export interface BlockchainInfo {
  is_initial_block_download: boolean
  epoch: string
  difficulty: string
  median_time: string
  chain: string
  alerts: string[]
}

export interface BlockchainInfoWrapper {
  id: number
  type: string
  attributes: {
    blockchain_info: BlockchainInfo
  }
}
