import type { Cell, OutPoint, Output, Transaction } from '@ckb-lumos/base'
import { common } from '@ckb-lumos/common-scripts'
import { BI } from '@ckb-lumos/bi'

const CELLBASE_TX_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

export function outputToCell(
  output: Output,
  data: string,
  {
    outPoint,
    blockHash,
    blockNumber,
    txIndex,
  }: {
    outPoint?: OutPoint
    blockHash?: string
    blockNumber?: string
    txIndex?: string
  },
): Cell {
  return {
    cellOutput: {
      capacity: output.capacity,
      lock: output.lock,
      type: output.type,
    },
    data,
    outPoint,
    blockHash,
    blockNumber,
    txIndex,
  }
}

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
    outputToCell(output, tx.outputsData[index], {
      outPoint: tx.hash
        ? {
            txHash: tx.hash,
            index: `0x${index.toString(16)}`,
          }
        : undefined,
    }),
  )
}

export function calculateTransactionSize(tx: Transaction): number {
  // eslint-disable-next-line no-underscore-dangle
  return common.__tests__.getTransactionSizeByTx(tx)
}

export function checkIsCellBase(tx: Transaction): boolean {
  if (tx.inputs.length !== 1) {
    return false
  }

  return tx.inputs[0].previousOutput.txHash === CELLBASE_TX_HASH
}
