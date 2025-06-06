import { FC, useCallback, useContext } from 'react'
import styles from './ContextCellInput.module.scss'
import { ReadContractContext } from '../context'
import { ReadContractParameterContextCell } from '../types'
import Input from './Input'
import { ScriptInput } from './ScriptInput'

const ContextCellInput: FC<{ index: number }> = ({ index }) => {
  const { paramsList, handleChange } = useContext(ReadContractContext)
  const paramValues = paramsList[index] as ReadContractParameterContextCell

  const handleValuesChange = useCallback(
    (key: string) => (value: string) => {
      const newValue = { ...paramValues.value }
      switch (key) {
        case 'capacity':
          newValue.cellOutput.capacity = value
          break
        case 'data':
          newValue.outputData = value
          break
        default:
          break
      }
      handleChange(index, {
        ...paramValues,
        value: newValue,
      })
    },
    [handleChange, index, paramValues],
  )
  const handleNotUsingNoneTypeCheckboxChange = useCallback(
    (checked: boolean) => {
      const newValue = { ...paramValues.value }
      if (checked) {
        newValue.cellOutput.type = {
          codeHash: '',
          hashType: 'type',
          args: '',
        }
      } else {
        newValue.cellOutput.type = undefined
      }
      handleChange(index, {
        ...paramValues,
        value: newValue,
      })
    },
    [handleChange, index, paramValues],
  )

  return (
    <div className={styles.container}>
      <Input
        placeholder="Enter capacity"
        label="Capacity"
        value={paramValues.value.cellOutput.capacity.toString()}
        onChange={e => handleValuesChange('capacity')(e.target.value)}
      />
      <Input
        placeholder="Enter cell data in Hex"
        label="Data"
        value={paramValues.value.outputData.toString()}
        onChange={e => handleValuesChange('data')(e.target.value)}
      />
      <div className="inputWrapper">
        <label className="label">Lock</label>
        <div className="inputContainerWithSubContent">
          <ScriptInput showAmount={false} index={index} contextCellType="lock" />
        </div>
      </div>
      <div className="inputWrapper">
        <label className="label">Type</label>
        <div className="inputContainerWithSubContent">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={paramValues.value.cellOutput.type !== undefined}
              onChange={e => handleNotUsingNoneTypeCheckboxChange(e.target.checked)}
            />
            Use None
          </label>
          {!!paramValues.value.cellOutput.type && (
            <ScriptInput showAmount={false} index={index} contextCellType="type" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ContextCellInput
