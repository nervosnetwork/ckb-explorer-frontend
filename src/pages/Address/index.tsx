import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import AddressHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { AddressContentPanel } from './styled'
import { AddressTransactions, AddressOverview } from './AddressComp'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { usePaginationParamsInListPage, useSortParam } from '../../utils/hook'
import { isAxiosError } from '../../utils/error'

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()
  const { currentPage, pageSize } = usePaginationParamsInListPage()

  // REFACTOR: avoid using useSortParam
  const { sortBy, orderBy, sort } = useSortParam<'time'>(s => s === 'time')

  const addressInfoQuery = useQuery(['address_info', address], () => explorerService.api.fetchAddressInfo(address))

  const addressTransactionsQuery = useQuery(
    ['address_transactions', address, currentPage, pageSize, sort],
    async () => {
      try {
        const { data: transactions, total } = await explorerService.api.fetchTransactionsByAddress(
          address,
          currentPage,
          pageSize,
          sort,
        )
        return {
          transactions,
          total,
        }
      } catch (err) {
        const isEmptyAddress = isAxiosError(err) && err.response?.status === 404
        if (isEmptyAddress) {
          return {
            transactions: [],
            total: 0,
          }
        }
        throw err
      }
    },
  )

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressInfoQuery.data?.type === 'LockHash' ? t('address.lock_hash') : t('address.address')}
          hash={address}
          specialAddress={addressInfoQuery.data?.isSpecial ? addressInfoQuery.data.specialAddress : ''}
          showDASInfoOnHeader={addressInfoQuery.data?.addressHash ?? false}
        />

        <QueryResult query={addressInfoQuery} delayLoading>
          {data => <AddressOverview address={data} />}
        </QueryResult>

        <QueryResult query={addressTransactionsQuery} delayLoading>
          {data => (
            <AddressTransactions
              address={address}
              transactions={data.transactions}
              transactionsTotal={data.total}
              timeOrderBy={sortBy === 'time' ? orderBy : 'desc'}
            />
          )}
        </QueryResult>
      </AddressContentPanel>
    </Content>
  )
}

export default Address
