import { Transaction } from '@ckb-ccc/core'
import { useQuery } from '@tanstack/react-query'
import NodeTransactionCellList from '../TransactionCellList/NodeTransactionCellList'
import NodeTransactionCellBase from '../TransactionCellList/NodeTransactionCellBase'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { checkIsCellBase, getTransactionOutputCells } from '../../../utils/transaction'
import Loading from '../../../components/Loading'
import { IOType } from '../../../constants/common'

export const NodeTransactionComp = ({
  transaction,
  blockNumber,
}: {
  transaction: Transaction
  blockNumber?: number
}) => {
  const isCellBase = checkIsCellBase(transaction)
  const { nodeService } = useCKBNode()
  const { data: cellBaseBlockHeader } = useQuery(
    ['node', 'header', blockNumber ? blockNumber - 11 : null],
    () => (blockNumber ? nodeService.rpc.getHeaderByNumber(blockNumber - 11) : undefined),
    {
      enabled: isCellBase && Boolean(blockNumber),
    },
  )

  const { data: inputCells, isFetching: isInputsLoading } = useQuery(['node', 'inputCells', transaction?.hash], () =>
    nodeService.getInputCells(transaction.inputs.map(i => i.previousOutput)),
  )
  const outputCells = getTransactionOutputCells(transaction)

  return (
    <>
      <div className="transactionInputs">
        {isCellBase ? (
          <NodeTransactionCellBase blockHash={cellBaseBlockHeader?.hash} blockNumber={blockNumber} />
        ) : (
          <>
            <Loading show={isInputsLoading} />
            <NodeTransactionCellList cells={inputCells} ioType={IOType.Input} />
          </>
        )}
      </div>
      <div className="transactionOutputs">
        <NodeTransactionCellList cells={outputCells} ioType={IOType.Output} />
      </div>
    </>
  )
}
