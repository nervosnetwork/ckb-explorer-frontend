import React, { useContext, useEffect } from 'react'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router'
import { StateWithDispatch, PageActions, AppActions, AppDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { DaoContentPanel, DaoTabBarPanel } from './styled'
import { getNervosDao, getNervosDaoTransactions, getNervosDaoDepositors } from '../../service/app/nervosDao'
import DaoTransactions from './DaoTransactions'
import DaoSearch from '../../components/Search/DaoSearch'
import DepositorRank from './DepositorRank'
import { parsePageNumber } from '../../utils/string'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import Error from '../../components/Error'
import Loading from '../../components/Loading'
import { useTimeoutWithUnmount } from '../../utils/hook'
import DaoOverview from './DaoOverview'

const NervosDAOStateComp = ({
  daoTab,
  currentPage,
  pageSize,
  dispatch,
}: {
  daoTab: 'transactions' | 'depositors'
  currentPage: number
  pageSize: number
  dispatch: AppDispatch
}) => {
  const { nervosDaoState, app } = useContext(AppContext)
  switch (nervosDaoState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return daoTab === 'transactions' ? (
        <DaoTransactions currentPage={currentPage} pageSize={pageSize} dispatch={dispatch} />
      ) : (
        <DepositorRank dispatch={dispatch} />
      )
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

export const NervosDao = ({
  location: { search },
  dispatch,
  history: { push },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const parsed = queryString.parse(search)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  const { nervosDaoState } = useContext(AppContext)

  const tab = parsed.tab as 'transactions' | 'depositors'
  const daoTab = tab || 'transactions'

  useEffect(() => {
    getNervosDao(dispatch)
    getNervosDaoTransactions(dispatch, currentPage, pageSize)
    getNervosDaoDepositors(dispatch)
  }, [dispatch, currentPage, pageSize])

  useTimeoutWithUnmount(
    () => {
      if (nervosDaoState.status === 'None') {
        dispatch({
          type: AppActions.UpdateLoading,
          payload: {
            loading: true,
          },
        })
      }
    },
    () => {
      dispatch({
        type: PageActions.UpdateNervosDaoStatus,
        payload: {
          status: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <DaoContentPanel className="container">
        <DaoOverview />
        <DaoTabBarPanel containSearchBar={daoTab === 'transactions'}>
          <div className="nervos_dao_tab_bar">
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => {}}
              className={daoTab === 'transactions' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=transactions')}
            >
              {i18n.t('nervos_dao.dao_tab_transactions')}
            </div>
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => {}}
              className={daoTab === 'depositors' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=depositors')}
            >
              {i18n.t('nervos_dao.dao_tab_depositors')}
            </div>
          </div>
          {daoTab === 'transactions' && <DaoSearch dispatch={dispatch} />}
        </DaoTabBarPanel>

        <NervosDAOStateComp daoTab={daoTab} currentPage={currentPage} pageSize={pageSize} dispatch={dispatch} />
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
