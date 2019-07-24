import React from 'react'
import { TransactionCellListPanel, TransactionCellListTitlePanel } from './styled'
import TransactionCell from '../TransactionCell'
import { CellType } from '../TransactionDetail'

export default ({ inputs, outputs }: { inputs?: State.InputOutput[]; outputs?: State.InputOutput[] }) => {
  const cells = inputs || outputs || []
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>{inputs ? 'Input' : 'Output'}</span>
          <span>Capacity</span>
          <span>Detail</span>
        </div>
      </TransactionCellListTitlePanel>
      {cells.map(cell => (
        <TransactionCell cell={cell} cellType={inputs ? CellType.Input : CellType.Output} />
      ))}
    </TransactionCellListPanel>
  )
}
