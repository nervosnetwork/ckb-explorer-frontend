import { Script } from './Script'

export interface Address {
  address_hash: string
  balance: number
  transactions_count: number
  cell_consumed: number
  lock_script: Script
}

export interface AddressWrapper {
  id: number
  type: string
  attributes: Address
}
