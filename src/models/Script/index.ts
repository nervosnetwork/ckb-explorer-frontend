export interface Script {
  codeHash: string
  args: string
  hashType: string
  verifiedScriptName?: string | null
  tags?: string[]
}

export interface ScriptDetail {
  typeHash: string
  dataHash: string
  hashType: string | null
  depType: string
  name: string
  rfc: string
  sourceUrl: string
  website: string
  isTypeScript: boolean
  isLockScript: boolean
  deprecated: boolean
  deployedBlockTimestamp: number
  totalReferringCellsCapacity: string
  isZeroLock: boolean
}
