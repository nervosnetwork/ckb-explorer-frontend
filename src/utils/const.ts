export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000

export const CachedKeys = {
  // Block List
  BlockList: 'block_list',

  // Home
  Blocks: 'blocks',
  Statistics: 'statistics',
}

export enum TransactionFeeStatus {
  calculating = 'calculating',
  calculated = 'calculated',
}

export enum RewardStatus {
  pending = 'pending',
  issued = 'issued',
}
