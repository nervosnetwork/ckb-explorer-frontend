import { Script } from './Script'

export interface Address {
  address_hash: string
  lock_hash: string
  balance: number
  transactions_count: number
  cell_consumed: number
  lock_script: Script
  pending_reward_blocks_count: number
}

export interface AddressWrapper {
  id: number
  type: string
  attributes: Address
}
