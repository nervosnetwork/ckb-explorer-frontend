import { FC, ReactNode } from 'react'
import { ScriptInput } from './ScriptInput'
import { ScriptArrayInput } from './ScriptArrayInput'
import { ReadContractParameterType } from '../types'
import ContextCellInput from './ContextCellInput'
import HexInput from './HexInput'
import HexArrayInput from './HexArrayInput'
import './index.scss'
import TxInput from './TxInput'

const ParameterBuilder: FC<{
  type: ReadContractParameterType
  index: number
}> = ({ type, index }) => {
  let content: ReactNode = null
  switch (type) {
    case ReadContractParameterType.Hex:
      content = <HexInput index={index} placeholder="Enter hex" />
      break
    case ReadContractParameterType.ScriptArray:
      content = <ScriptArrayInput index={index} showAmount={false} />
      break
    case ReadContractParameterType.HexArray:
      content = <HexArrayInput index={index} label="Hex Array" placeholder="Enter hex" />
      break
    case ReadContractParameterType.ContextScript:
    case ReadContractParameterType.Script:
      content = <ScriptInput showAmount={false} index={index} />
      break
    case ReadContractParameterType.ContextCell:
      content = <ContextCellInput index={index} />
      break
    case ReadContractParameterType.ContextTransaction:
      content = (
        <HexInput index={index} label="Transaction Data (Hex)" placeholder="Enter transaction data in hex format" />
      )
      break
    case ReadContractParameterType.Tx:
      content = <TxInput index={index} />
      break
    case ReadContractParameterType.StringArray:
      content = <HexArrayInput index={index} label="String Array" placeholder="Enter string" />
      break
    case ReadContractParameterType.Uint64:
      content = <HexInput index={index} label="Uint64 Value" placeholder="Enter uint64 value" isNumber />
      break
    case ReadContractParameterType.Uint128:
      content = <HexInput index={index} label="Uint128 Value" placeholder="Enter uint128 value" isNumber />
      break
    case ReadContractParameterType.Uint64Array:
      content = <HexArrayInput index={index} label="Uint64 Array" placeholder="Enter uint64 value" isNumber />
      break
    case ReadContractParameterType.Uint128Array:
      content = <HexArrayInput index={index} label="Uint128 Array" placeholder="Enter uint128 value" isNumber />
      break
    case ReadContractParameterType.Byte32:
      content = <HexInput index={index} label="Byte32 Hex Value" placeholder="Enter byte32 value" />
      break
    case ReadContractParameterType.Byte32Array:
      content = <HexArrayInput index={index} label="Byte32 Array Hex Values" placeholder="Enter byte32 value" />
      break
    case ReadContractParameterType.ScriptAmountArray:
      content = <ScriptArrayInput index={index} showAmount />
      break
    case ReadContractParameterType.String:
      content = <HexInput index={index} label="String Value" placeholder="Enter string value" />
      break
    default:
      content = null
      break
  }
  return <div className="parameterBuilder">{content}</div>
}

export default ParameterBuilder
