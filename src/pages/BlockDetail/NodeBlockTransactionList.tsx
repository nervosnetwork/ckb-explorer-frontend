import { useState } from 'react'
import { Transaction } from '@ckb-lumos/base'
import { useTranslation } from 'react-i18next'
import Pagination from '../../components/Pagination'
import NodeTransactionItem from '../../components/TransactionItem/NodeTransactionItem'
import { localeNumberString } from '../../utils/number'
import { Card } from '../../components/Card'
import styles from './styles.module.scss'
import { CardHeader } from '../../components/Card/CardHeader'

export const NodeBlockTransactionList = ({
  transactions,
  blockNumber,
  highlightAddress,
}: {
  transactions: Transaction[]
  blockNumber?: number
  highlightAddress?: string
}) => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.ceil(transactions.length / pageSize)

  return (
    <>
      <Card className={styles.transactionListOptionsCard} rounded="top">
        <CardHeader
          className={styles.cardHeader}
          leftContent={`${t('transaction.transactions')} (${localeNumberString(transactions.length)})`}
          rightProps={{ className: styles.rear }}
        />
      </Card>

      {transactions.slice((page - 1) * pageSize, page * pageSize).map(transaction => (
        <NodeTransactionItem
          showBlock={false}
          key={transaction.hash}
          transaction={transaction}
          blockHashOrNumber={blockNumber?.toString()}
          highlightAddress={highlightAddress}
        />
      ))}

      {totalPages > 1 && (
        <div className={styles.blockTransactionsPagination}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={(page, size) => {
              setPage(page)
              if (size) {
                setPageSize(size)
              }
            }}
          />
        </div>
      )}
    </>
  )
}
