export interface Transaction {
  txId: string
  confirmations: number
  commitment: string
  transfers: Transfer[]
}

export interface Transfer {
  address: string
  transfers: TransferAsset[]
}

export interface TransferAsset {
  cellType: string
  capacity: string
}

export enum TransactionLeapDirection {
  IN = 'in',
  OUT = 'out',
}
