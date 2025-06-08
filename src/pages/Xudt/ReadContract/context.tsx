import { ccc, Hex } from '@ckb-ccc/core'
import { ssri } from '@ckb-ccc/ssri'
import { createContext, FC, useCallback, useState } from 'react'
import { useSetToast } from '../../../components/Toast'
import { ReadContractParameter, ReadContractParameterType } from './types'
import CONFIG from '../../../config'

export const ReadContractContext = createContext<{
  paramsList: ReadContractParameter[]
  handleChange: (index: number, value: ReadContractParameter) => void
  signer: ccc.Signer | undefined
  handleAddParam: (type: ReadContractParameterType) => void
  handleDeleteParam: (index: number) => void
  contractOutPointTx: string
  contractOutPointIndex: number
  method: string
  SSRIExecutor: ssri.ExecutorJsonRpc
  expandedMethods: string[]
  setExpandedMethods: (methods: string[]) => void
}>({
  paramsList: [],
  handleChange: () => {},
  signer: undefined,
  handleAddParam: () => {},
  handleDeleteParam: () => {},
  contractOutPointTx: '',
  contractOutPointIndex: 0,
  method: '',
  SSRIExecutor: new ssri.ExecutorJsonRpc(CONFIG.REACT_APP_SSRI_RPC_URL!),
  expandedMethods: [],
  setExpandedMethods: () => {},
})

export const ReadContractContextProvider: FC<{
  children: React.ReactNode
  contractOutPointTx: string
  contractOutPointIndex: number
  method: string
  SSRIExecutor: ssri.ExecutorJsonRpc
  signer: ccc.Signer | undefined
  expandedMethods: string[]
  setExpandedMethods: (methods: string[]) => void
}> = ({
  children,
  contractOutPointTx,
  contractOutPointIndex,
  method,
  SSRIExecutor,
  signer,
  expandedMethods,
  setExpandedMethods,
}) => {
  const [paramsList, setParamsList] = useState<ReadContractParameter[]>([])
  const setToast = useSetToast()

  const handleChange = useCallback(
    (index: number, value: ReadContractParameter) => {
      setParamsList(paramsList.map((param, i) => (i === index ? value : param)))
    },
    [paramsList, setParamsList],
  )
  const handleAddParam = useCallback(
    (type: ReadContractParameterType) => {
      const contextTypes = [
        ReadContractParameterType.ContextScript,
        ReadContractParameterType.ContextCell,
        ReadContractParameterType.ContextTransaction,
      ]
      const hasContextParam = paramsList.some(param => param.type && contextTypes.includes(param.type))

      if (contextTypes.includes(type) && hasContextParam) {
        setToast({
          message: 'Invalid Parameter: You can only have one context parameter (Script, Cell, or Transaction)',
          type: 'danger',
        })
        return
      }
      const title = `Parameter ${paramsList.length + 1}`
      let newParameter: ReadContractParameter | null = null
      switch (type) {
        case ReadContractParameterType.Hex:
          newParameter = { type, value: '' as Hex, title }
          break
        case ReadContractParameterType.ScriptArray:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.HexArray:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.ContextScript:
        case ReadContractParameterType.Script:
          newParameter = {
            type,
            value: {
              script: { codeHash: '', hashType: 'type', args: '' },
            },
            title,
          }
          break
        case ReadContractParameterType.ContextCell:
          newParameter = {
            type,
            value: {
              outPoint: { txHash: '0x', index: 0 },
              cellOutput: {
                capacity: '',
                type: {
                  codeHash: '',
                  hashType: 'type',
                  args: '',
                },
                lock: {
                  codeHash: '',
                  hashType: 'type',
                  args: '',
                },
              },
              outputData: '',
            },
            title,
          }
          break
        case ReadContractParameterType.ContextTransaction:
          newParameter = { type, value: '' as Hex, title }
          break
        case ReadContractParameterType.Tx:
          newParameter = { type, value: '' as Hex, title }
          break
        case ReadContractParameterType.StringArray:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.Uint64:
        case ReadContractParameterType.Uint128:
          newParameter = { type, value: '', title }
          break
        case ReadContractParameterType.Uint64Array:
        case ReadContractParameterType.Uint128Array:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.Byte32:
          newParameter = { type, value: '', title }
          break
        case ReadContractParameterType.Byte32Array:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.ScriptAmountArray:
          newParameter = { type, value: [], title }
          break
        case ReadContractParameterType.String:
          newParameter = { type, value: '', title }
          break
        default:
          newParameter = null
          break
      }
      if (newParameter) {
        setParamsList(prev => [...prev, newParameter!])
      }
    },
    [paramsList, setParamsList, setToast],
  )
  const handleDeleteParam = useCallback((index: number) => {
    setParamsList(prev =>
      prev.filter((_, i) => i !== index).map((param, i) => ({ ...param, title: `Parameter ${i + 1}` })),
    )
  }, [])

  return (
    <ReadContractContext.Provider
      value={{
        paramsList,
        signer,
        handleChange,
        handleAddParam,
        handleDeleteParam,
        contractOutPointTx,
        contractOutPointIndex,
        method,
        SSRIExecutor,
        expandedMethods,
        setExpandedMethods,
      }}
    >
      {children}
    </ReadContractContext.Provider>
  )
}
