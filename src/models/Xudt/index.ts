import { Script } from '../Script'

export interface XUDT {
  addressesCount: string
  createdAt: string
  h24CkbTransactionsCount: string
  issuerAddress: string
  published: boolean
  decimal: string | null
  fullName: string | null
  symbol: string | null
  totalAmount: string
  typeHash: string
  typeScript: Script
  udtType: 'xudt'
  xudtTags?: string[]
  iconFile: string
  operatorWebsite: string
  email: string
  description: string
}
