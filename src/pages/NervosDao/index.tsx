import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
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

  const queryNervosDao = useQuery(['nervos-dao'], () => explorerService.api.fetchNervosDao())

  const queryNervosDaoTransactions = useQuery(
    ['nervos-dao-transactions', currentPage, _pageSize, params.filter],
    async () => {
      const {
        data: transactions,
        total,
        pageSize,
      } = await explorerService.api.fetchNervosDaoTransactionsByFilter({
        filter: params.filter,
        page: currentPage,
        size: _pageSize,
      })

      return { transactions, total, pageSize }
    },
    { enabled: !params.tab || params.tab === 'transactions' },
  )

  const queryNervosDaoDepositors = useQuery(
    ['nervos-dao-depositors'],
    () => explorerService.api.fetchNervosDaoDepositors(),
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
          <div className="nervosDaoTabBar">
            <SimpleButton
              className={tab === 'transactions' ? 'tabBarSelected' : 'tabBarNormal'}
              onClick={() => push('/nervosdao?tab=transactions')}
            >
              {t('nervos_dao.dao_tab_transactions')}
            </SimpleButton>
            <SimpleButton
              className={tab === 'depositors' ? 'tabBarSelected' : 'tabBarNormal'}
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
                transactions={data?.transactions ?? []}
                total={data?.total ?? 0}
                onPageChange={setPage}
                filterNoResult={!!params.filter && data?.total === 0}
              />
            )}
          </QueryResult>
        ) : (
          <QueryResult query={queryNervosDaoDepositors} delayLoading>
            {data => <DepositorRank depositors={data ?? []} filter={params.filter} />}
          </QueryResult>
        )}
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
