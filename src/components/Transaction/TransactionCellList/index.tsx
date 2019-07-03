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

export default ({ items, showSize, transaction, render }: TransactionCellListProps) => {
  return (
    <TransactionCellListPanel>
      {items && items.map((item, idx) => idx < showSize && render(item))}
      {showSize < items.length && <Link to={`/transaction/${transaction.transaction_hash}`}>View All</Link>}
    </TransactionCellListPanel>
  )
}
