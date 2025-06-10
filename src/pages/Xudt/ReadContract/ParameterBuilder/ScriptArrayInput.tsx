import { useCallback, useContext } from 'react'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { ScriptInput } from './ScriptInput'
import { ReadContractContext } from '../context'
import { ReadContractParameterType, ScriptAmountType } from '../types'

export const ScriptArrayInput: React.FC<{
  index: number
  showAmount?: boolean
}> = ({ index, showAmount = true }) => {
  const { paramsList, handleChange } = useContext(ReadContractContext)

  const params = paramsList[index] as
    | {
        type: ReadContractParameterType.ScriptArray
        value: ScriptAmountType[]
        title: string
      }
    | {
        type: ReadContractParameterType.ScriptAmountArray
        value: ScriptAmountType[]
        title: string
      }

  const addScriptAmount = useCallback(() => {
    const newScript: ScriptAmountType = {
      script: { codeHash: '', hashType: 'type', args: '' },
      ...(showAmount && { amount: '0' }),
    }
    handleChange(index, {
      ...params,
      value: [...params.value, newScript],
    })
  }, [handleChange, index, params, showAmount])

  const removeScriptAmount = useCallback(
    (index: number) => {
      const newScriptAmounts: ScriptAmountType[] = [...params.value]
      newScriptAmounts.splice(index, 1)
      handleChange(index, {
        ...params,
        value: newScriptAmounts,
      })
    },
    [handleChange, params],
  )

  return (
    <div className="inputContainer">
      <label className="inputWrapperLabel">
        {showAmount ? 'Scripts with Amounts' : 'Scripts'}
        <CirclePlus onClick={addScriptAmount} className="addIcon" />
      </label>
      <div className="arrayInput">
        {params.value.map((_, idx) => (
          <div className="arrayItem">
            <ScriptInput showAmount={showAmount} index={index} subIndex={idx} />
            <CircleMinus className="deleteIcon" onClick={() => removeScriptAmount(idx)} />
          </div>
        ))}
      </div>
    </div>
  )
}
