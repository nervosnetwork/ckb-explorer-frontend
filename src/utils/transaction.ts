import { Cell, OutPoint, Transaction } from '@ckb-ccc/core'
import { BI } from '@ckb-lumos/bi'

const TRANSACTION_SIZE_PADDING = 4
const CELLBASE_TX_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

function calculateFeeRate(size: number, fee: BI): BI {
  const ratio = BI.from(1000)
  return fee.mul(ratio).div(BI.from(size))
}

export function calculateFeeByTxIO(
  inputs: Cell[],
  outputs: Cell[],
  transactionSize: number,
): {
  fee: number
  feeRate: number
} {
  const inputCapacities = inputs.reduce((sum, cell) => sum.add(BI.from(cell.cellOutput.capacity)), BI.from(0))
  const outputCapacities = outputs.reduce((sum, cell) => sum.add(BI.from(cell.cellOutput.capacity)), BI.from(0))
  const fee = inputCapacities.sub(outputCapacities)
  const feeRate = calculateFeeRate(transactionSize, fee)

  return {
    fee: fee.toNumber(),
    feeRate: feeRate.toNumber(),
  }
}

export function getTransactionOutputCells(tx: Transaction): Cell[] {
  return tx.outputs.map((output, index) =>
    Cell.from({
      cellOutput: {
        capacity: output.capacity,
        lock: output.lock,
        type: output.type,
      },
      outputData: tx.outputsData[index],
      outPoint: OutPoint.from({
        txHash: tx.hash(),
        index,
      }),
    }),
  )
}

export function calculateTransactionSize(tx: Transaction): number {
  return tx.toBytes().length + TRANSACTION_SIZE_PADDING
}

export function checkIsCellBase(tx: Transaction): boolean {
  if (tx.inputs.length !== 1) {
    return false
  }

  return tx.inputs[0].previousOutput.txHash === CELLBASE_TX_HASH
}
