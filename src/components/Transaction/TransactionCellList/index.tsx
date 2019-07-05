import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import TransactionCellListPanel from './styled'
import { Transaction, InputOutput } from '../../../http/response/Transaction'

interface TransactionCellListProps {
  cells: InputOutput[]
  showSize: number
  transaction: Transaction
  render: (item: InputOutput) => ReactNode
}

export default ({ cells, showSize, transaction, render }: TransactionCellListProps) => {
  return (
    <TransactionCellListPanel>
      {cells && cells.map((cell, idx) => idx < showSize && render(cell))}
      {showSize < cells.length && <Link to={`/transaction/${transaction.transaction_hash}`}>View All</Link>}
    </TransactionCellListPanel>
  )
}
