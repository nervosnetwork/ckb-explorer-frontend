import React, { useContext } from 'react'
import browserHistory from '../../routes/history'
import { AppContext } from '../../contexts/providers'
import TransactionItem from '../../components/TransactionItem'
import { TransactionsPagition } from './styled'
import Pagination from '../../components/Pagination'
import { PageParams } from '../../utils/const'

export default ({ currentPage = 1, pageSize = PageParams.PageSize }: { currentPage?: number; pageSize?: number }) => {
  const { nervosDaoState } = useContext(AppContext)
  const { transactions, total } = nervosDaoState

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.push(`/nervosdao?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      {transactions &&
        transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                key={transaction.transactionHash}
                transaction={transaction}
                isLastItem={index === transactions.length - 1}
              />
            )
          )
        })}
      {totalPages > 1 && (
        <TransactionsPagition>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </TransactionsPagition>
      )}
    </>
  )
}
