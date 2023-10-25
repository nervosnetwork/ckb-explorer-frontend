import { Script } from '../Script'

export interface UDT {
  symbol: string
  fullName: string
  iconFile: string
  published: boolean
  description: string
  totalAmount: string
  addressesCount: string
  decimal: string
  h24CkbTransactionsCount: string
  createdAt: string
  typeHash: string
  issuerAddress: string
  typeScript: Script
  displayName?: string
  uan?: string
}
