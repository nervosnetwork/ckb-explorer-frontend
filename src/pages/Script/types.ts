export interface ScriptInfo {
  scriptName: string
  scriptType: string
  typeId: number
  codeHash: string
  hashType: string
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  ckbTransactions?: {
    total?: number
    page?: number
    size?: number
  }
  deployedCells?: {
    total?: number
    page?: number
    size?: number
  }
  referringCells?: {
    total?: number
    page?: number
    size?: number
  }
}

export type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export interface ScriptResponse {
  id: number
  codeHash: string
  hashType: 'lock' | 'type'
  scriptType: 'lock' | 'type'
  typeId: number
  scriptName: string
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  ckbTransactions?: CkbTransactionInScript[]
  deployedCells?: CellInScript[]
  referringCells?: CellInScript[]
}

export interface CkbTransactionInScript {
  id: number
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  transactionFee: number
  isCellbase: boolean
  txStatus: string
  displayInputs: State.Cell[]
  displayOutputs: State.Cell[]
}

export interface CellInScript {
  id: number
  capacity: string
  data: string
  ckbTransactionId: number
  createdAt: string
  updatedAt: string
  status: string
  addressId: number
  blockId: number
  txHash: string
  cellIndex: number
  generatedById?: number
  consumedById?: number
  cellType: string
  dataSize: number
  occupiedCapacity: number
  blockTimestamp: number
  consumedBlockTimestamp: number
  typeHash?: string
  udtAmount: number
  dao: string
  lockScriptId?: number
  typeScriptId?: number
}
