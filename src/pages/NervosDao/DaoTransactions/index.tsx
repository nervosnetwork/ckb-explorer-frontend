import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useAppState, useDispatch } from '../../../contexts/providers'
import TransactionItem from '../../../components/TransactionItem'
import { TransactionsPagination, DAONoResultPanel } from './styled'
import Pagination from '../../../components/Pagination'
import { PageParams } from '../../../constants/common'
import i18n from '../../../utils/i18n'
import { ComponentActions } from '../../../contexts/actions'

export default ({ currentPage = 1, pageSize = PageParams.PageSize }: { currentPage: number; pageSize: number }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    nervosDaoState: { transactions = [], total },
    components: { filterNoResult },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    history.push(`/nervosdao?page=${page}&size=${pageSize}`)
  }

  useEffect(
    () => () => {
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: false,
        },
      })
    },
    [dispatch],
  )

  if (filterNoResult) {
    return (
      <DAONoResultPanel>
        <span>{i18n.t('search.dao_filter_no_result')}</span>
      </DAONoResultPanel>
    )
  }

  return (
    <>
      {transactions.map(
        (transaction: State.Transaction, index: number) =>
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              transaction={transaction}
              circleCorner={{
                bottom: index === transactions.length - 1 && totalPages === 1,
              }}
            />
          ),
      )}
      {totalPages > 1 && (
        <TransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </TransactionsPagination>
      )}
    </>
  )
}
