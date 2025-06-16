import { ccc } from '@ckb-ccc/core'
import React, { useCallback, useContext, useState } from 'react'
import { ReadContractContext } from '../context'
import CommonSelect from '../../../../components/CommonSelect'
import styles from './ScriptInput.module.scss'
import Input from './Input'
import {
  ReadContractParameterScriptArray,
  ReadContractParameterScriptAmountArray,
  ReadContractParameterContextCell,
  ReadContractParameterContextScript,
  ReadContractParameterScript,
  ReadContractParameterType,
  ScriptAmountType,
} from '../types'

export interface ScriptAmountInputProps {
  showAmount: boolean
  index: number
  subIndex?: number
  contextCellType?: 'lock' | 'type'
}

export const ScriptInput: React.FC<ScriptAmountInputProps> = ({ showAmount, index, subIndex, contextCellType }) => {
  const [inputType, setInputType] = useState<'script' | 'address'>('address')
  const [addressErr, setAddressErr] = useState('')
  const [address, setAddress] = useState('')
  const { signer, paramsList, handleChange } = useContext(ReadContractContext)

  const getValue = useCallback(() => {
    let value: ScriptAmountType | null = null
    switch (paramsList[index].type) {
      case ReadContractParameterType.ContextScript:
      case ReadContractParameterType.Script:
        value = paramsList[index].value as ScriptAmountType
        break
      case ReadContractParameterType.ContextCell:
        value = {
          script:
            contextCellType === 'lock'
              ? (paramsList[index].value as ccc.CellLike).cellOutput.lock
              : (paramsList[index].value as ccc.CellLike).cellOutput.type!,
          amount: undefined,
        }
        break
      case ReadContractParameterType.ScriptArray:
      case ReadContractParameterType.ScriptAmountArray:
        if (subIndex !== undefined) {
          value = (paramsList[index].value as ScriptAmountType[])[subIndex]
        }
        break
      default:
        break
    }
    return value
  }, [contextCellType, index, paramsList, subIndex])
  const handleValuesChange = useCallback(
    (key: string) => async (inputValue: string) => {
      let newValue: ScriptAmountType | null = getValue()
      if (!newValue) return
      newValue = { ...newValue }
      switch (key) {
        case 'address': {
          setAddress(inputValue)
          if (signer && inputValue) {
            try {
              const { script } = await ccc.Address.fromString(inputValue, signer.client)
              setAddressErr('')
              newValue.script = {
                codeHash: script.codeHash,
                hashType: script.hashType,
                args: script.args,
              }
            } catch (error) {
              setAddressErr(error instanceof Error ? error.message : String(error))
            }
          } else {
            setAddressErr('')
          }
          break
        }
        case 'codeHash': {
          newValue.script.codeHash = inputValue
          break
        }
        case 'hashType': {
          newValue.script.hashType = inputValue as ccc.HashTypeLike
          break
        }
        case 'args': {
          newValue.script.args = inputValue
          break
        }
        case 'amount': {
          newValue.amount = inputValue
          break
        }
        default:
          break
      }
      switch (paramsList[index].type) {
        case ReadContractParameterType.ContextScript:
        case ReadContractParameterType.Script:
          handleChange(index, {
            ...(paramsList[index] as ReadContractParameterContextScript | ReadContractParameterScript),
            value: newValue,
          })
          break
        case ReadContractParameterType.ContextCell: {
          handleChange(index, {
            ...(paramsList[index] as ReadContractParameterContextCell),
            value: {
              ...(paramsList[index].value as ccc.CellLike),
              cellOutput: {
                ...(paramsList[index].value as ccc.CellLike).cellOutput,
                [contextCellType === 'lock' ? 'lock' : 'type']: newValue.script,
              },
            },
          })
          break
        }
        case ReadContractParameterType.ScriptArray:
        case ReadContractParameterType.ScriptAmountArray:
          if (subIndex !== undefined) {
            const newValues = [...(paramsList[index].value as ScriptAmountType[])]
            newValues[subIndex] = newValue
            handleChange(index, {
              ...(paramsList[index] as ReadContractParameterScriptArray | ReadContractParameterScriptAmountArray),
              value: newValues,
            })
          }
          break
        default:
          break
      }
    },
    [contextCellType, getValue, handleChange, index, paramsList, signer, subIndex],
  )

  const value = getValue()
  if (!value) return null

  return (
    <div className="inputContainer">
      <div className="inputWrapper">
        <label className="label">Input Type</label>
        <CommonSelect
          className={styles.paramSelect}
          options={[
            { value: 'script', label: 'script' },
            { value: 'address', label: 'address' },
          ]}
          onChange={type => setInputType(type as 'script' | 'address')}
          value={inputType}
        />
      </div>

      {inputType === 'address' ? (
        <Input
          placeholder="Enter CKB address"
          label="Address"
          errorMessage={addressErr}
          value={address}
          onChange={e => handleValuesChange('address')(e.target.value)}
        />
      ) : (
        <>
          <Input
            placeholder="Enter code hash"
            label="Code Hash"
            value={value.script?.codeHash?.toString() ?? ''}
            onChange={e => handleValuesChange('codeHash')(e.target.value)}
          />
          <div className="inputWrapper">
            <label className="label">Hash Type</label>
            <CommonSelect
              className={styles.paramSelect}
              options={[
                { value: 'type', label: 'type' },
                { value: 'data', label: 'data' },
                { value: 'data1', label: 'data1' },
                { value: 'data2', label: 'data2' },
              ]}
              onChange={hashType => handleValuesChange('hashType')(hashType)}
              value={value.script?.hashType?.toString() ?? 'type'}
            />
          </div>
          <Input
            placeholder="Enter args"
            label="Args"
            value={value.script?.args?.toString() ?? ''}
            onChange={e => handleValuesChange('args')(e.target.value)}
          />
        </>
      )}

      {showAmount && (
        <Input
          placeholder="Enter amount"
          label="Amount"
          value={value.amount ?? ''}
          onChange={e => handleValuesChange('amount')(e.target.value)}
        />
      )}
    </div>
  )
}
