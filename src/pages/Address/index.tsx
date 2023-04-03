import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import AddressHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { AddressContentPanel } from './styled'
import { AddressTransactions, AddressOverview } from './AddressComp'
import { fetchAddressInfo, fetchTransactionsByAddress } from '../../service/http/fetcher'
import { QueryResult } from '../../components/QueryResult'
import { defaultAddressInfo } from './state'
import { usePaginationParamsInPage } from '../../utils/hook'
import { isAxiosError } from '../../utils/error'

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()

  const addressInfoQuery = useQuery(['address_info', address], async () => {
    const wrapper = await fetchAddressInfo(address)
    const result: State.Address = {
      ...wrapper.attributes,
      type: wrapper.type === 'lock_hash' ? 'LockHash' : 'Address',
    }
    return result
  })

  const addressTransactionsQuery = useQuery(['address_transactions', address, currentPage, pageSize], async () => {
    try {
      const { data, meta } = await fetchTransactionsByAddress(address, currentPage, pageSize)
      return {
        transactions: data.map(wrapper => wrapper.attributes),
        total: meta ? meta.total : 0,
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
  })

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressInfoQuery.data?.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
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
              addressInfo={addressInfoQuery.data ?? defaultAddressInfo}
            />
          )}
        </QueryResult>
      </AddressContentPanel>
    </Content>
  )
}

export default Address
