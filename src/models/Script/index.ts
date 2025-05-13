export interface Script {
  codeHash: string
  args: string
  hashType: string
  verifiedScriptName?: string | null
}

export interface ScriptDetail {
  typeHash: string
  dataHash: string
  hashType: string | null
  txHash: string
  depType: string
  name: string
  rfc: string
  sourceCode: string
  website: string
  isTypeScript: boolean
  isLockScript: boolean
  deprecated: boolean
  deployedBlockTimestamp: number
  totalReferringCellsCapacity: string
}
