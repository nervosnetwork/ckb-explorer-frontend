import React from 'react'
import browserHistory from '../../routes/history'
import { useAppState } from '../../contexts/providers'
import TransactionItem from '../../components/TransactionItem'
import { TransactionsPagination } from './styled'
import Pagination from '../../components/Pagination'
import { PageParams } from '../../utils/const'

export default ({ currentPage = 1, pageSize = PageParams.PageSize }: { currentPage: number; pageSize: number }) => {
  const {
    nervosDaoState: { transactions = [], total },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.push(`/nervosdao?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      {transactions.map((transaction: State.Transaction) => {
        return transaction && <TransactionItem key={transaction.transactionHash} transaction={transaction} />
      })}
      {totalPages > 1 && (
        <TransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </TransactionsPagination>
      )}
    </>
  )
}
