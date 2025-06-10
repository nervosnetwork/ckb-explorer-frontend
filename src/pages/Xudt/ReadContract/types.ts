import { ccc, Hex } from '@ckb-ccc/core'
import { XUDT } from '../../../models/Xudt'

export enum ReadContractParameterType {
  ContextScript = 'Context Script',
  ContextCell = 'Context Cell',
  ContextTransaction = 'Context Transaction',
  Hex = 'Generic Data (HexLike)',
  HexArray = 'Generic Data Array (HexLike)',
  String = 'String',
  StringArray = 'String Array',
  Uint64 = 'Number (Uint64)',
  Uint64Array = 'Number Array (Uint64)',
  Uint128 = 'Number (Uint128)',
  Uint128Array = 'Number Array (Uint128)',
  Script = 'Script',
  ScriptArray = 'Script Array',
  Byte32 = 'Byte32',
  Byte32Array = 'Byte32 Array',
  Tx = 'Transaction',
  ScriptAmountArray = 'Script Amount Array',
}

export interface ScriptAmountType {
  script: ccc.ScriptLike
  amount?: string
}

export interface ReadContractParameterContextScript {
  type: ReadContractParameterType.ContextScript | ReadContractParameterType.Script
  value: ScriptAmountType
  title: string
}
export interface ReadContractParameterScript {
  type: ReadContractParameterType.Script
  value: ScriptAmountType
  title: string
}
export interface ReadContractParameterContextCell {
  type: ReadContractParameterType.ContextCell
  value: ccc.CellLike
  title: string
}
export interface ReadContractParameterContextTransaction {
  type: ReadContractParameterType.ContextTransaction
  value: Hex
  title: string
}
export interface ReadContractParameterHex {
  type: ReadContractParameterType.Hex
  value: Hex
  title: string
}
export interface ReadContractParameterHexArray {
  type: ReadContractParameterType.HexArray
  value: string[]
  title: string
}
export interface ReadContractParameterString {
  type: ReadContractParameterType.String
  value: string
  title: string
}
export interface ReadContractParameterStringArray {
  type: ReadContractParameterType.StringArray
  value: string[]
  title: string
}
export interface ReadContractParameterUint64 {
  type: ReadContractParameterType.Uint64
  value: string
  title: string
}
export interface ReadContractParameterUint64Array {
  type: ReadContractParameterType.Uint64Array
  value: string[]
  title: string
}
export interface ReadContractParameterUint128 {
  type: ReadContractParameterType.Uint128
  value: string
  title: string
}
export interface ReadContractParameterUint128Array {
  type: ReadContractParameterType.Uint128Array
  value: string[]
  title: string
}
export interface ReadContractParameterByte32 {
  type: ReadContractParameterType.Byte32
  value: string
  title: string
}
export interface ReadContractParameterByte32Array {
  type: ReadContractParameterType.Byte32Array
  value: string[]
  title: string
}
export interface ReadContractParameterTx {
  type: ReadContractParameterType.Tx
  value: Hex | undefined
  title: string
}
export interface ReadContractParameterScriptArray {
  type: ReadContractParameterType.ScriptArray
  value: ScriptAmountType[]
  title: string
}
export interface ReadContractParameterScriptAmountArray {
  type: ReadContractParameterType.ScriptAmountArray
  value: ScriptAmountType[]
  title: string
}

export type ReadContractParameter =
  | ReadContractParameterContextScript
  | ReadContractParameterScript
  | ReadContractParameterContextCell
  | ReadContractParameterContextTransaction
  | ReadContractParameterScriptArray
  | ReadContractParameterScriptAmountArray
  | ReadContractParameterHexArray
  | ReadContractParameterHex
  | ReadContractParameterString
  | ReadContractParameterStringArray
  | ReadContractParameterUint64
  | ReadContractParameterUint64Array
  | ReadContractParameterUint128
  | ReadContractParameterUint128Array
  | ReadContractParameterByte32
  | ReadContractParameterByte32Array
  | ReadContractParameterTx

export const SSRIBaseMethods = [
  {
    method: 'UDT.name',
    hash: '0xc78a67cec2fcc54f',
    type: 'string',
    getValue: (xudt: XUDT) => xudt.fullName,
  },
  {
    method: 'UDT.symbol',
    hash: '0x35fa711c8c918aad',
    type: 'string',
    getValue: (xudt: XUDT) => xudt.symbol,
  },
  {
    method: 'UDT.decimals',
    hash: '0x2f87f08056af234d',
    type: 'string',
    getValue: (xudt: XUDT) => xudt.decimal,
  },
  {
    method: 'UDT.icon',
    hash: '0xa306f89e40893737',
    type: 'image',
    getValue: (xudt: XUDT) => xudt.iconFile,
  },
]
