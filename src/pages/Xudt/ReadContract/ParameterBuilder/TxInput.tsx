import { Hex } from '@ckb-ccc/core'
import { FC, useContext } from 'react'
import { ReadContractContext } from '../context'
import { ReadContractParameterTx } from '../types'
import HexInput from './HexInput'

const TxInput: FC<{ index: number }> = ({ index }) => {
  const { paramsList, handleChange } = useContext(ReadContractContext)
  const param = paramsList[index] as ReadContractParameterTx

  return (
    <div className="inputWrapper">
      <label className="checkboxLabel">
        <input
          type="checkbox"
          checked={param.value !== undefined}
          onChange={e =>
            handleChange(index, {
              ...param,
              value: e.target.checked ? ('' as Hex) : undefined,
            })
          }
        />
        Leave Blank
      </label>
      {param.value !== undefined && (
        <HexInput index={index} label="Transaction Data (Hex)" placeholder="Enter transaction data in hex format" />
      )}
    </div>
  )
}

export default TxInput
