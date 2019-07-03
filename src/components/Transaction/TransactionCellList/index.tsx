import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import TransactionCellListPanel from './styled'
import { Transaction } from '../../../http/response/Transaction'

interface TransactionCellListProps {
  data: any[]
  showSize: number
  transaction: Transaction
  render: (item: any) => ReactNode
}

export default ({ data, showSize, transaction, render }: TransactionCellListProps) => {
  return (
    <TransactionCellListPanel>
      {data && data.map((item, idx) => idx < showSize && render(item))}
      {showSize < data.length && <Link to={`/transaction/${transaction.transaction_hash}`}>View All</Link>}
    </TransactionCellListPanel>
  )
}
