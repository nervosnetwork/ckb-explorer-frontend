import React from 'react'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel } from './styled'
import browserHistory from '../../routes/history'

const simpleUDTInfo = (udt: State.UDT) => {
  const { fullName, symbol, addressesCount, decimal, totalAmount } = udt
  return [
    {
      title: i18n.t('udt.name'),
      content: fullName,
    },
    {
      title: i18n.t('udt.holder_addresses'),
      content: addressesCount,
    },
    {
      title: i18n.t('udt.symbol'),
      content: symbol,
    },
    {
      title: i18n.t('udt.decimal'),
      content: decimal,
    },
    {
      title: i18n.t('udt.total_amount'),
      content: totalAmount,
    },
  ] as OverviewItemData[]
}

export const SimpleUDTComp = ({
  currentPage,
  pageSize,
  typeHash,
}: {
  currentPage: number
  pageSize: number
  typeHash: string
}) => {
  const {
    udtState: { transactions = [], total, udt },
    app: { tipBlockNumber },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/sudt/${typeHash}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <TitleCard title={i18n.t('common.overview')} />
      <OverviewCard items={simpleUDTInfo(udt)} />
      {transactions.length > 0 && <TitleCard title={i18n.t('transaction.transactions')} />}
      <SimpleUDTTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                transaction={transaction}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                isLastItem={index === transactions.length - 1}
              />
            )
          )
        })}
      </SimpleUDTTransactionsPanel>
      {totalPages > 1 && (
        <SimpleUDTTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </SimpleUDTTransactionsPagination>
      )}
    </>
  )
}

export default SimpleUDTComp
