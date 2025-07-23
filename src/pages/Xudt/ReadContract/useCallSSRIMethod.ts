import { ccc } from '@ckb-ccc/core'
// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
import { cccA } from '@ckb-ccc/core/advanced'
import { ssri } from '@ckb-ccc/ssri'
import { useCallback, useContext, useState } from 'react'
import { IS_MAINNET } from '../../../constants/common'
import { ReadContractContext } from './context'
import { ReadContractParameterType } from './types'

export function useCallSSRIMethod() {
  const { paramsList, signer, contractOutPointTx, contractOutPointIndex, method, SSRIExecutor } =
    useContext(ReadContractContext)
  const [methodResult, setMethodResult] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [iconDataURL, setIconDataURL] = useState('')
  const [ckbAddress, setCkbAddress] = useState<string | undefined>(undefined)
  const [isError, setIsError] = useState(false)
  const [cellDeps, setCellDeps] = useState<cccA.JsonRpcOutPoint[] | undefined>(undefined)
  const [transactionResult, setTransactionResult] = useState<ccc.Transaction | undefined>(undefined)

  const callSSRIMethod = useCallback(async () => {
    if (!signer) return

    setIsLoading(true)
    setMethodResult(undefined)
    setIconDataURL('')
    setIsError(false)
    setCkbAddress(undefined)
    setCellDeps(undefined)

    let contract: ssri.Trait | undefined
    try {
      const targetOutPoint = {
        txHash: contractOutPointTx,
        index: contractOutPointIndex,
      }
      const scriptCell = await signer.client.getCell(targetOutPoint)

      if (!scriptCell) {
        throw new Error('Script cell not found')
      }

      if (!scriptCell.cellOutput.type?.hash()) {
        throw new Error('Script cell type hash not found')
      }
      contract = new ssri.Trait(scriptCell.outPoint, SSRIExecutor)

      if (!contract) {
        throw new Error('Contract not initialized')
      }

      let context: ssri.ContextScript | ssri.ContextCell | ssri.ContextTransaction | undefined

      paramsList.forEach(paramType => {
        if (paramType.type === ReadContractParameterType.ContextScript) {
          context = { script: paramType.value.script } as ssri.ContextScript
        } else if (paramType.type === ReadContractParameterType.ContextCell) {
          context = { cell: paramType.value } as ssri.ContextCell
        } else if (paramType.type === ReadContractParameterType.ContextTransaction) {
          context = {
            tx: paramType.value as ccc.TransactionLike,
          } as ssri.ContextTransaction
        }
      })

      // setSSRICallDetails({
      //   trait: rawMethodPath.split('.')[0],
      //   method: rawMethodPath.split('.')[1],
      //   args: args,
      //   contractOutPoint: {
      //     txHash: contractOutPointTx,
      //     index: parseInt(contractOutPointIndex),
      //   },
      //   ssriContext: context,
      // })

      // log(
      //   'Calling',
      //   rawMethodPath,
      //   'on contract at',
      //   String(contractOutPointTx),
      //   'index',
      //   String(contractOutPointIndex),
      // )
      const argsHex = paramsList
        .map(param => {
          switch (param.type) {
            case ReadContractParameterType.ContextScript:
            case ReadContractParameterType.ContextCell:
            case ReadContractParameterType.ContextTransaction:
              return undefined
            case ReadContractParameterType.Hex:
              if (!param.value) return '0x'
              return param.value
            case ReadContractParameterType.HexArray:
              if (!param.value) return '0x'
              return ccc.mol.BytesVec.encode(param.value)
            case ReadContractParameterType.String:
              return ccc.bytesFrom((param.value as string).trimStart().trimEnd(), 'utf8')
            case ReadContractParameterType.StringArray:
              return ccc.mol.BytesVec.encode(
                (param.value as string[]).map(str => ccc.bytesFrom(str.trimStart().trimEnd(), 'utf8')),
              )
            case ReadContractParameterType.Uint64:
              return ccc.numLeToBytes(Number(param.value), 8)
            case ReadContractParameterType.Uint64Array:
              return ccc.mol.Uint64Vec.encode(param.value.map(Number))
            case ReadContractParameterType.Uint128:
              return ccc.numLeToBytes(Number(param.value), 16)
            case ReadContractParameterType.Uint128Array:
              return ccc.mol.Uint128Vec.encode(param.value.map(Number))
            case ReadContractParameterType.Script:
              if (!param.value) return '0x'
              return ccc.Script.encode(param.value.script)
            case ReadContractParameterType.ScriptArray:
              if (!param.value) return '0x'
              return ccc.ScriptVec.encode(param.value.map(scriptAmount => scriptAmount.script))
            case ReadContractParameterType.Tx:
              if (!param.value) return '0x'
              return ccc.Transaction.encode(param.value)
            case ReadContractParameterType.Byte32:
              if (!param.value) return '0x'
              return ccc.mol.Byte32.encode(param.value)
            case ReadContractParameterType.Byte32Array:
              if (!param.value) return '0x'
              return ccc.mol.Byte32Vec.encode(param.value)
            default:
              throw new Error(`Unsupported parameter type: ${param.type}`)
          }
        })
        .filter(arg => arg !== undefined) as ccc.HexLike[]

      const code = ccc.OutPoint.from(contract.code)
      const [rpcMethod, rpcContext] = (() => {
        if (context?.tx) {
          const tx = ccc.Transaction.from(context.tx)
          return [
            'run_script_level_transaction',
            [
              {
                inner: cccA.JsonRpcTransformers.transactionFrom(tx),
                hash: tx.hash(),
              },
            ],
          ]
        }
        if (context?.cell) {
          return [
            'run_script_level_cell',
            [
              {
                cell_output: cccA.JsonRpcTransformers.cellOutputFrom(ccc.CellOutput.from(context.cell.cellOutput)),
                hex_data: ccc.hexFrom(context.cell.outputData),
              },
            ],
          ]
        }
        if (context?.script) {
          return ['run_script_level_script', [cccA.JsonRpcTransformers.scriptFrom(context.script)]]
        }
        return ['run_script_level_code', []]
      })()

      const { content, cell_deps } = (await SSRIExecutor.requestor.request(rpcMethod, [
        code.txHash,
        Number(code.index),
        [method, ...argsHex.map(ccc.hexFrom)],
        ...rpcContext,
      ])) as { content: ccc.Hex; cell_deps: cccA.JsonRpcOutPoint[] }

      setCellDeps(cell_deps)

      if (content) {
        try {
          const transaction = ccc.Transaction.fromBytes(content)
          setTransactionResult(transaction)
        } catch (e) {
          // empty
        }
        try {
          ccc.Address.fromString(content, IS_MAINNET ? new ccc.ClientPublicMainnet() : new ccc.ClientPublicTestnet())
          setCkbAddress(content)
        } catch (e) {
          // empty
        }
        try {
          const dataURL = ccc.bytesTo(content as string, 'utf8')
          if (dataURL.startsWith('http') || dataURL.startsWith('data:image')) {
            setIconDataURL(dataURL)
          }
        } catch (e) {
          // empty
        }
        setMethodResult(content)
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e) || 'Unknown error'
      setMethodResult(`Error: ${errorMessage}`)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [SSRIExecutor, contractOutPointIndex, contractOutPointTx, method, paramsList, signer])

  return { callSSRIMethod, methodResult, isLoading, iconDataURL, transactionResult, isError, ckbAddress, cellDeps }
}
