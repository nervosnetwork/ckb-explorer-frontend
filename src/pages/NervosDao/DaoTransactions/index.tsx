import TransactionItem from '../../../components/TransactionItem'
import { TransactionsPagination, DAONoResultPanel } from './styled'
import Pagination from '../../../components/Pagination'
import { PageParams } from '../../../constants/common'
import i18n from '../../../utils/i18n'
import { deprecatedAddrToNewAddr } from '../../../utils/util'

export default ({
  currentPage = 1,
  pageSize = PageParams.PageSize,
  transactions,
  total,
  onPageChange,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: State.Transaction[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
}) => {
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <DAONoResultPanel>
        <span>{i18n.t('search.dao_filter_no_result')}</span>
      </DAONoResultPanel>
    )
  }
  const txList = transactions.map(tx => ({
    ...tx,
    displayInputs: tx.displayInputs.map(i => ({
      ...i,
      addressHash: deprecatedAddrToNewAddr(i.addressHash),
    })),
    displayOutputs: tx.displayOutputs.map(o => ({
      ...o,
      addressHash: deprecatedAddrToNewAddr(o.addressHash),
    })),
  }))

  return (
    <>
      {txList.map(
        (transaction: State.Transaction, index: number) =>
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              transaction={transaction}
              circleCorner={{
                bottom: index === txList.length - 1 && totalPages === 1,
              }}
            />
          ),
      )}
      {totalPages > 1 && (
        <TransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </TransactionsPagination>
      )}
    </>
  )
}
