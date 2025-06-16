import { CircleMinus, CirclePlus } from 'lucide-react'
import { FC, useCallback, useContext } from 'react'
import { ReadContractContext } from '../context'
import { ReadContractParameterType } from '../types'
import HexInput from './HexInput'

const HexArrayInput: FC<{
  index: number
  label: string
  placeholder: string
  isNumber?: boolean
}> = ({ index, label, placeholder, isNumber }) => {
  const { paramsList, handleChange } = useContext(ReadContractContext)

  const param = paramsList[index]

  const handleAdd = useCallback(() => {
    switch (param.type) {
      case ReadContractParameterType.HexArray:
      case ReadContractParameterType.StringArray:
      case ReadContractParameterType.Byte32Array:
      case ReadContractParameterType.Uint64Array:
      case ReadContractParameterType.Uint128Array: {
        handleChange(index, {
          ...param,
          value: [...param.value, ''],
        })
        break
      }
      default:
        break
    }
  }, [param, handleChange, index])
  const handleDelete = useCallback(
    (idx: number) => {
      switch (param.type) {
        case ReadContractParameterType.HexArray:
        case ReadContractParameterType.StringArray:
        case ReadContractParameterType.Byte32Array:
        case ReadContractParameterType.Uint64Array:
        case ReadContractParameterType.Uint128Array: {
          handleChange(index, {
            ...param,
            value: param.value.filter((_, i) => i !== idx),
          })
          break
        }
        default:
          break
      }
    },
    [param, handleChange, index],
  )

  if (
    ![
      ReadContractParameterType.HexArray,
      ReadContractParameterType.StringArray,
      ReadContractParameterType.Byte32Array,
      ReadContractParameterType.Uint64Array,
      ReadContractParameterType.Uint128Array,
    ].includes(param.type)
  ) {
    return null
  }

  return (
    <div className="inputContainer">
      <label className="inputWrapperLabel">
        {label}
        <CirclePlus onClick={handleAdd} className="addIcon" />
      </label>
      <div className="arrayInput">
        {(param.value as string[])?.map((_, idx) => (
          <div className="arrayItem">
            <HexInput index={index} subIndex={idx} placeholder={placeholder} isNumber={isNumber} />
            <CircleMinus className="deleteIcon" onClick={() => handleDelete(idx)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HexArrayInput
