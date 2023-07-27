import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import Content from '../../components/Content'
import { DaoContentPanel, DaoTabBarPanel } from './styled'
import DaoTransactions from './DaoTransactions'
import Filter from '../../components/Search/Filter'
import DepositorRank from './DepositorRank'
import { usePaginationParamsInPage, useSearchParams } from '../../utils/hook'
import DaoOverview from './DaoOverview'
import SimpleButton from '../../components/SimpleButton'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import {
  fetchNervosDao,
  fetchNervosDaoDepositors,
  fetchNervosDaoTransactions,
  fetchNervosDaoTransactionsByAddress,
  fetchNervosDaoTransactionsByHash,
} from '../../service/http/fetcher'
import { QueryResult } from '../../components/QueryResult'
import { defaultNervosDaoInfo } from './state'

export const NervosDao = () => {
  const { push } = useHistory()
  const [t] = useTranslation()

  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const params = useSearchParams('tab')
  const tab = params.tab as 'transactions' | 'depositors'
  const daoTab = tab || 'transactions'

  const queryNervosDao = useQuery(['nervos-dao'], async () => {
    const wrapper = await fetchNervosDao()
    const nervosDao = wrapper.attributes
    return nervosDao
  })

  const [filterText, setFilterText] = useState<string>()
  const filtering = filterText != null
  const isInvalidFilter = filtering && containSpecialChar(filterText)

  const queryNervosDaoTransactions = useQuery(
    ['nervos-dao-transactions', currentPage, _pageSize, filterText, isInvalidFilter],
    async () => {
      if (filterText != null) {
        if (isInvalidFilter) {
          return { transactions: [], total: 0 }
        }

        // search address
        if (filterText.startsWith('ckt') || filterText.startsWith('ckb')) {
          const { data, meta } = await fetchNervosDaoTransactionsByAddress(filterText, currentPage, _pageSize)
          const transactions = data.map(wrapper => wrapper.attributes)
          return {
            transactions,
            total: meta?.total ?? transactions.length,
          }
        }

        // search transaction
        const wrapper = await fetchNervosDaoTransactionsByHash(addPrefixForHash(filterText))
        const transactions = [wrapper.attributes]
        return {
          transactions,
          total: transactions.length,
        }
      }

      const { data, meta } = await fetchNervosDaoTransactions(currentPage, _pageSize)
      const transactions = data.map(wrapper => wrapper.attributes)
      return {
        transactions,
        total: meta?.total ?? transactions.length,
        pageSize: meta?.pageSize,
      }
    },
  )
  const filterNoResult = filtering && (isInvalidFilter || queryNervosDaoTransactions.isError)

  const queryNervosDaoDepositors = useQuery(['nervos-dao-depositors'], async () => {
    const { data } = await fetchNervosDaoDepositors()
    return { depositors: data.map(wrapper => wrapper.attributes) }
  })

  const pageSize = queryNervosDaoTransactions.data?.pageSize ?? _pageSize

  return (
    <Content>
      <DaoContentPanel className="container">
        <DaoOverview nervosDao={queryNervosDao.data ?? defaultNervosDaoInfo} />
        <DaoTabBarPanel containSearchBar={daoTab === 'transactions'}>
          <div className="nervos_dao_tab_bar">
            <SimpleButton
              className={daoTab === 'transactions' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=transactions')}
            >
              {t('nervos_dao.dao_tab_transactions')}
            </SimpleButton>
            <SimpleButton
              className={daoTab === 'depositors' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=depositors')}
            >
              {t('nervos_dao.dao_tab_depositors')}
            </SimpleButton>
          </div>
          {daoTab === 'transactions' && (
            <Filter
              showReset={filtering}
              placeholder={t('nervos_dao.dao_search_placeholder')}
              onFilter={query => {
                setPage(1)
                setFilterText(query)
              }}
              onReset={() => {
                setPage(1)
                setFilterText(undefined)
              }}
            />
          )}
        </DaoTabBarPanel>

        {daoTab === 'transactions' ? (
          <QueryResult query={queryNervosDaoTransactions} delayLoading>
            {data => (
              <DaoTransactions
                currentPage={currentPage}
                pageSize={pageSize}
                transactions={data.transactions}
                total={data.total}
                onPageChange={setPage}
                filterNoResult={filterNoResult}
              />
            )}
          </QueryResult>
        ) : (
          <QueryResult query={queryNervosDaoDepositors} delayLoading>
            {data => <DepositorRank depositors={data.depositors} />}
          </QueryResult>
        )}
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
