import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import TransactionCellListPanel from './styled'

interface TransactionCellListProps {
  cells: State.InputOutput[]
  showSize: number
  transaction: State.Transaction
  render: (item: State.InputOutput) => ReactNode
}

export default ({ cells, showSize, transaction, render }: TransactionCellListProps) => {
  return (
    <TransactionCellListPanel>
      {cells && cells.map((cell, index) => index < showSize && render(cell))}
      {cells && showSize < cells.length && (
        <div className="transaction_item__view_all">
          <Link to={`/transaction/${transaction.transactionHash}`}>View All</Link>
        </div>
      )}
    </TransactionCellListPanel>
  )
}
