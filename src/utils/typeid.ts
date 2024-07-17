import type { Script } from '../models/Script'

const TYPE_ID_BASE = {
  codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
  hashType: 'type',
}
export const isTypeIdScript = (script: Script) => {
  return script.codeHash === TYPE_ID_BASE.codeHash && script.hashType === TYPE_ID_BASE.hashType
}

export const TYPE_ID_TAG = 'Type ID'

export const TYPE_ID_RFC =
  'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id'
