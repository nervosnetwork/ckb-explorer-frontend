import { FC, useCallback, useContext } from 'react'
import { Hex } from '@ckb-ccc/core'
import { ReadContractContext } from '../context'
import Input from './Input'
import { ReadContractParameterType } from '../types'

const HexInput: FC<{
  index: number
  subIndex?: number
  label?: string
  placeholder: string
  isNumber?: boolean
}> = ({ index, subIndex, label, placeholder, isNumber }) => {
  const { paramsList, handleChange } = useContext(ReadContractContext)

  const param = paramsList[index]

  const handleValueChange = useCallback(
    (idx: number) => (value: string) => {
      if (isNumber && Number.isNaN(Number(value))) {
        return
      }
      switch (param.type) {
        case ReadContractParameterType.Hex:
        case ReadContractParameterType.ContextTransaction:
        case ReadContractParameterType.Tx:
        case ReadContractParameterType.Byte32:
        case ReadContractParameterType.Uint64:
        case ReadContractParameterType.Uint128: {
          handleChange(index, {
            ...param,
            value: value as Hex,
          })
          break
        }
        case ReadContractParameterType.HexArray:
        case ReadContractParameterType.StringArray:
        case ReadContractParameterType.Byte32Array:
        case ReadContractParameterType.Uint64Array:
        case ReadContractParameterType.Uint128Array: {
          const newValues = [...param.value]
          newValues[idx] = value
          handleChange(index, {
            ...param,
            value: newValues,
          })
          break
        }
        default:
          break
      }
    },
    [isNumber, param, handleChange, index],
  )

  let value: Hex | undefined
  let onChange: (e: React.ChangeEvent<HTMLInputElement>) => void = () => {}
  switch (param.type) {
    case ReadContractParameterType.Hex:
    case ReadContractParameterType.ContextTransaction:
    case ReadContractParameterType.Tx:
    case ReadContractParameterType.Byte32:
    case ReadContractParameterType.Uint64:
    case ReadContractParameterType.Uint128: {
      value = param.value as Hex
      onChange = e => handleValueChange(0)(e.target.value)
      break
    }
    case ReadContractParameterType.HexArray:
    case ReadContractParameterType.StringArray:
    case ReadContractParameterType.Byte32Array:
    case ReadContractParameterType.Uint64Array:
    case ReadContractParameterType.Uint128Array: {
      value = param.value[subIndex ?? 0] as Hex
      onChange = e => handleValueChange(subIndex ?? 0)(e.target.value)
      break
    }
    default:
      break
  }

  return <Input placeholder={placeholder || 'Enter hex'} label={label} value={value} onChange={onChange} />
}

export default HexInput
