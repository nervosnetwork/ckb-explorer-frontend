import Script from './Script'

export default interface Address {
  address_hash: string
  balance: number
  transactions_count: number
  cell_consumed: number
  lock_script: Script
}
