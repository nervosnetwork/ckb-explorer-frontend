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
import { QueryResult } from '../../components/QueryResult'
import { defaultNervosDaoInfo } from './state'
import { explorerService } from '../../services/ExplorerService'

export const NervosDao = () => {
  const { push } = useHistory()
  const [t] = useTranslation()

  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const params = useSearchParams('tab', 'filter')
  const tab = (params.tab as 'transactions' | 'depositors') || 'transactions'

  const queryNervosDao = useQuery(['nervos-dao'], async () => {
    const wrapper = await explorerService.api.fetchNervosDao()
    const nervosDao = wrapper.attributes
    return nervosDao
  })

  const queryNervosDaoTransactions = useQuery(
    ['nervos-dao-transactions', currentPage, _pageSize, params.filter],
    async () => {
      const { data, meta } = await explorerService.api.fetchNervosDaoTransactionsByFilter({
        filter: params.filter,
        page: currentPage,
        size: _pageSize,
      })

      const transactions = data.map(wrapper => wrapper.attributes)
      return {
        transactions,
        total: meta?.total ?? transactions.length,
        pageSize: meta?.pageSize,
      }
    },
    { enabled: !params.tab || params.tab === 'transactions' },
  )

  const queryNervosDaoDepositors = useQuery(
    ['nervos-dao-depositors'],
    async () => {
      const { data } = await explorerService.api.fetchNervosDaoDepositors()
      return { depositors: data.map(wrapper => wrapper.attributes) }
    },
    {
      enabled: params.tab === 'depositors',
    },
  )

  const pageSize = queryNervosDaoTransactions.data?.pageSize ?? _pageSize

  return (
    <Content>
      <DaoContentPanel className="container">
        <DaoOverview nervosDao={queryNervosDao.data ?? defaultNervosDaoInfo} />
        <DaoTabBarPanel>
          <div className="nervos_dao_tab_bar">
            <SimpleButton
              className={tab === 'transactions' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=transactions')}
            >
              {t('nervos_dao.dao_tab_transactions')}
            </SimpleButton>
            <SimpleButton
              className={tab === 'depositors' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=depositors')}
            >
              {t('nervos_dao.dao_tab_depositors')}
            </SimpleButton>
          </div>

          <Filter
            defaultValue={params.filter}
            showReset={!!params.filter}
            placeholder={tab === 'depositors' ? t('search.addr') : `${t('search.tx')} / ${t('search.addr')}`}
            onFilter={filter => {
              push(`/nervosdao?${new URLSearchParams({ filter, tab })}`)
            }}
            onReset={() => {
              push(`/nervosdao?${new URLSearchParams({ tab })}`)
            }}
          />
        </DaoTabBarPanel>

        {tab === 'transactions' ? (
          <QueryResult query={queryNervosDaoTransactions} delayLoading>
            {data => (
              <DaoTransactions
                currentPage={currentPage}
                pageSize={pageSize}
                transactions={data.transactions}
                total={data.total}
                onPageChange={setPage}
                filterNoResult={!!params.filter && data.total === 0}
              />
            )}
          </QueryResult>
        ) : (
          <QueryResult query={queryNervosDaoDepositors} delayLoading>
            {data => <DepositorRank depositors={data.depositors} filter={params.filter} />}
          </QueryResult>
        )}
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
